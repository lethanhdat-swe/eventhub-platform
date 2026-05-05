import { prisma } from "../utils/prisma";
import { AppError } from "../utils/AppError";
import { getPaginationMetadata } from "../utils/pagination";
import crypto from "crypto";

class OrderService {
    async create(userId: string, body: any) {
        const {
            customerEmail,
            customerPhone,
            customerName,
            eventSeatIds,
            couponId,
            paymentMethod,
        } = body;

        return await prisma.$transaction(async (tx) => {
            // 1. Fetch and validate seats
            const seats = await tx.eventSeat.findMany({
                where: {
                    id: { in: eventSeatIds },
                },
                include: {
                    ticketType: true,
                },
            });

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

            // 2. Calculate total amount
            let totalAmount = seats.reduce(
                (sum, seat) => sum + seat.ticketType.price,
                0
            );

            // 3. Apply coupon if exists
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

            // 4. Generate order code
            const orderCode = `EH${Date.now()}${crypto.randomInt(100, 999)}`;

            // 5. Create the Order
            const order = await tx.order.create({
                data: {
                    userId,
                    customerEmail,
                    customerPhone,
                    customerName,
                    totalAmount,
                    status: "pending",
                    paymentMethod,
                    orderCode,
                    couponId,
                },
            });

            // 6. Update seats to RESERVING and create Tickets
            for (const seat of seats) {
                await tx.eventSeat.update({
                    where: { id: seat.id },
                    data: { status: "RESERVING" },
                });

                await tx.ticket.create({
                    data: {
                        orderId: order.id,
                        eventSeatId: seat.id,
                        qrSecureToken: crypto.randomBytes(24).toString("hex"),
                    },
                });
            }

            return order;
        });
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
                if (order.status === "success") {
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

        if (order.status === "success") {
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
        const result = await prisma.order.deleteMany({
            where: {
                id: { in: ids },
            },
        });

        if (result.count === 0) {
            throw new AppError("No orders found to delete", 404);
        }

        return result;
    }
}

export default new OrderService();
