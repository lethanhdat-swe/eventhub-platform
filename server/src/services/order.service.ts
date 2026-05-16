import { prisma } from "../utils/prisma";
import { AppError } from "../utils/AppError";
import { getPaginationMetadata } from "../utils/pagination";
import PaymentService from "./payment.service";
import crypto from "crypto";

class OrderService {
    async create(userId: string, body: any) {
        const {
            customerEmail,
            customerPhone,
            customerName,
            couponId,
            paymentMethod,
            eventSeatIds,
        } = body;

        const result = await prisma.$transaction(async (tx) => {
            // 2. Load toàn bộ event_seats theo ids
            const seats = await tx.eventSeat.findMany({
                where: { id: { in: eventSeatIds } },
                include: { ticketType: true },
            });

            // 3. Đủ ghế + tất cả AVAILABLE
            if (seats.length !== eventSeatIds.length) {
                throw new AppError("Some selected seats were not found", 404);
            }

            const unavailableSeats = seats.filter(
                (s) => s.status !== "AVAILABLE"
            );
            if (unavailableSeats.length > 0) {
                throw new AppError(
                    "Some selected seats are no longer available",
                    400
                );
            }

            // 4. Tổng tiền theo ticketType.price
            let totalAmount = seats.reduce(
                (sum, seat) => sum + seat.ticketType.price,
                0
            );

            // 5. Coupon (nếu có)
            if (couponId) {
                const coupon = await tx.coupon.findUnique({
                    where: { id: couponId },
                });

                if (!coupon || coupon.status !== "ACTIVE") {
                    throw new AppError("Coupon is invalid or inactive", 400);
                }

                if (
                    coupon.validUntil &&
                    new Date(coupon.validUntil) < new Date()
                ) {
                    throw new AppError("Coupon has expired", 400);
                }

                const discountAmount =
                    (totalAmount * coupon.discountPercent) / 100;
                totalAmount -= discountAmount;
            }

            // 6. Mã đơn
            const orderCode = `EH${Date.now()}${crypto.randomInt(100, 999)}`;

            // 7. Order chờ thanh toán
            const order = await tx.order.create({
                data: {
                    userId,
                    customerEmail,
                    customerPhone,
                    customerName,
                    totalAmount,
                    status: "PENDING",
                    paymentMethod: paymentMethod ?? "SEPAY",
                    orderCode,
                    couponId,
                },
            });

            // 8. order_seats
            await tx.orderSeat.createMany({
                data: seats.map((s) => ({
                    orderId: order.id,
                    eventSeatId: s.id,
                })),
            });

            // 9. Giữ chỗ: AVAILABLE -> RESERVING
            const updateResult = await tx.eventSeat.updateMany({
                where: {
                    id: { in: seats.map((s) => s.id) },
                    status: "AVAILABLE",
                },
                data: { status: "RESERVING" },
            });

            if (updateResult.count !== seats.length) {
                throw new AppError(
                    "Some selected seats are no longer available",
                    400
                );
            }

            return order;
        });

        // 10. Thông tin thanh toán SEPAY cho FE
        return {
            order: result,
            sepay: PaymentService.buildSepayPaymentInfo(
                result.orderCode!,
                result.totalAmount ?? 0
            ),
        };
    }

    async list(query: {
        search?: string;
        page: number;
        limit: number;
        status?: string;
    }) {
        const { page = 1, limit = 10, search, status } = query;
        const skip = (page - 1) * limit;

        const where: any = {};
        if (status) {
            where.status = status;
        }

        if (search) {
            where.OR = [
                { orderCode: { contains: search } },
                { customerEmail: { contains: search } },
                { customerName: { contains: search } },
            ];
        }

        const [orders, total] = await Promise.all([
            prisma.order.findMany({
                where,
                skip,
                take: Number(limit),
                orderBy: { createdAt: "desc" },
                include: {
                    user: {
                        select: {
                            id: true,
                            email: true,
                            fullName: true,
                            phoneNumber: true,
                            role: true,
                            avatarUrl: true,
                        },
                    },
                    coupon: true,
                },
            }),
            prisma.order.count({ where }),
        ]);

        const ordersWithTickets = await Promise.all(
            orders.map(async (order) => {
                if (order.status === "PAID" || order.status === "SUCCESS") {
                    const tickets = await prisma.ticket.findMany({
                        where: { orderId: order.id },
                        include: {
                            eventSeat: {
                                include: {
                                    seat: true,
                                    ticketType: true,
                                },
                            },
                        },
                    });
                    return { ...order, tickets };
                }
                return order;
            })
        );

        return {
            data: ordersWithTickets,
            meta: getPaginationMetadata(total, page, limit),
        };
    }

    async getDetail(id: string) {
        const order = await prisma.order.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        fullName: true,
                        phoneNumber: true,
                        role: true,
                        avatarUrl: true,
                    },
                },
                coupon: true,
            },
        });

        if (!order) {
            throw new AppError("Order not found", 404);
        }

        if (order.status === "PAID" || order.status === "SUCCESS") {
            const tickets = await prisma.ticket.findMany({
                where: { orderId: order.id },
                include: {
                    eventSeat: {
                        include: {
                            seat: true,
                            ticketType: true,
                        },
                    },
                },
            });

            return { ...order, tickets };
        }

        return order;
    }

    async delete(ids: string[]) {
        return await prisma.$transaction(async (tx) => {
            const orders = await tx.order.findMany({
                where: {
                    id: { in: ids },
                },
                include: {
                    orderSeats: true,
                    tickets: true,
                },
            });

            if (orders.length === 0) {
                throw new AppError("No orders found to delete", 404);
            }

            const reservingSeatIds = orders
                .filter((order) => order.status === "PENDING")
                .flatMap((order) =>
                    order.orderSeats.map((orderSeat) => orderSeat.eventSeatId)
                );

            if (reservingSeatIds.length > 0) {
                await tx.eventSeat.updateMany({
                    where: {
                        id: { in: reservingSeatIds },
                        status: "RESERVING",
                    },
                    data: {
                        status: "AVAILABLE",
                    },
                });
            }

            await tx.ticket.deleteMany({
                where: {
                    orderId: { in: orders.map((order) => order.id) },
                },
            });

            await tx.orderSeat.deleteMany({
                where: {
                    orderId: { in: orders.map((order) => order.id) },
                },
            });

            const result = await tx.order.deleteMany({
                where: {
                    id: { in: orders.map((order) => order.id) },
                },
            });

            return result;
        });
    }
}

export default new OrderService();
