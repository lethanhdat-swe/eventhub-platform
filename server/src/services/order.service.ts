import crypto from "crypto";
import { prisma } from "../utils/prisma";
import { AppError } from "../utils/AppError";
import { getPaginationMetadata } from "../utils/pagination";
import {
    CouponStatus,
    EventSeatStatus,
    OrderStatus,
    PaymentMethod,
    Prisma,
} from "@prisma/client";
import paymentService from "./payment.service";
import qrService from "./qr.service";

class OrderService {
    async create(userId: string, body: any) {
        const {
            customerEmail,
            customerPhone,
            customerName,
            couponCode,
            paymentMethod,
            eventSeatIds,
        } = body;

        const uniqueEventSeatIds = [...new Set(eventSeatIds)];

        if (uniqueEventSeatIds.length !== eventSeatIds.length) {
            throw new AppError("Duplicate seats are not allowed", 400);
        }

        const result = await prisma.$transaction(async (tx) => {
            const seats = await tx.eventSeat.findMany({
                where: {
                    id: { in: uniqueEventSeatIds as string[] },
                },
                select: {
                    id: true,
                    eventId: true,
                    status: true,
                    ticketType: {
                        select: {
                            id: true,
                            name: true,
                            price: true,
                        },
                    },
                    seat: {
                        select: {
                            id: true,
                            rowLabel: true,
                            seatNumber: true,
                        },
                    },
                },
            });

            if (seats.length !== uniqueEventSeatIds.length) {
                throw new AppError("Some selected seats were not found", 404);
            }

            const eventIds = [...new Set(seats.map((seat) => seat.eventId))];

            if (eventIds.length !== 1) {
                throw new AppError(
                    "All selected seats must belong to the same event",
                    400
                );
            }

            const unavailableSeats = seats.filter(
                (seat) => seat.status !== EventSeatStatus.AVAILABLE
            );

            if (unavailableSeats.length > 0) {
                throw new AppError(
                    "Some selected seats are no longer available",
                    400
                );
            }

            let totalAmount = seats.reduce(
                (sum, seat) => sum + seat.ticketType.price,
                0
            );

            let couponId: string | null = null;

            if (couponCode) {
                const coupon = await tx.coupon.findUnique({
                    where: { code: couponCode },
                    select: {
                        id: true,
                        status: true,
                        discountPercent: true,
                        validUntil: true,
                        usageLimit: true,
                    },
                });

                if (!coupon || coupon.status !== CouponStatus.ACTIVE) {
                    throw new AppError("Coupon is invalid or inactive", 400);
                }

                if (coupon.validUntil && coupon.validUntil < new Date()) {
                    throw new AppError("Coupon has expired", 400);
                }

                if (coupon.usageLimit !== null) {
                    const usedCount = await tx.order.count({
                        where: {
                            couponId: coupon.id,
                            status: {
                                not: OrderStatus.CANCELLED,
                            },
                        },
                    });

                    if (usedCount >= coupon.usageLimit) {
                        throw new AppError(
                            "Coupon usage limit has been reached",
                            400
                        );
                    }
                }

                const safeDiscountPercent = Math.min(
                    Math.max(coupon.discountPercent, 0),
                    100
                );

                const discountAmount =
                    (totalAmount * safeDiscountPercent) / 100;

                totalAmount = Math.max(totalAmount - discountAmount, 0);
                couponId = coupon.id;
            }

            const orderCode = `EH${Date.now()}${crypto.randomInt(100, 999)}`;

            const order = await tx.order.create({
                data: {
                    userId,
                    customerEmail,
                    customerPhone,
                    customerName,
                    totalAmount,
                    status: OrderStatus.PENDING,
                    paymentMethod: paymentMethod ?? PaymentMethod.SEPAY,
                    orderCode,
                    couponId,
                },
                select: {
                    id: true,
                    userId: true,
                    customerEmail: true,
                    customerPhone: true,
                    customerName: true,
                    totalAmount: true,
                    status: true,
                    paymentMethod: true,
                    orderCode: true,
                    couponId: true,
                    createdAt: true,
                    updatedAt: true,
                },
            });

            await tx.orderSeat.createMany({
                data: seats.map((seat) => ({
                    orderId: order.id,
                    eventSeatId: seat.id,
                })),
            });

            const updateResult = await tx.eventSeat.updateMany({
                where: {
                    id: { in: seats.map((seat) => seat.id) },
                    status: EventSeatStatus.AVAILABLE,
                },
                data: {
                    status: EventSeatStatus.RESERVING,
                },
            });

            if (updateResult.count !== seats.length) {
                throw new AppError(
                    "Some selected seats are no longer available",
                    400
                );
            }

            return order;
        });

        return {
            order: result,
            sepay: paymentService.buildSepayPaymentInfo(
                result.orderCode!,
                result.totalAmount ?? 0
            ),
        };
    }

    async list(query: {
        search?: string;
        page: number;
        limit: number;
        status?: OrderStatus;
    }) {
        const { page = 1, limit = 10, search, status } = query;
        const skip = (page - 1) * limit;

        const where: Prisma.OrderWhereInput = {};

        if (status) {
            where.status = status;
        }

        if (search) {
            where.OR = [
                { orderCode: { contains: search } },
                { customerEmail: { contains: search } },
                { customerName: { contains: search } },
                { customerPhone: { contains: search } },
            ];
        }

        const [orders, total] = await Promise.all([
            prisma.order.findMany({
                where,
                skip,
                take: Number(limit),
                orderBy: {
                    createdAt: "desc",
                },
                select: {
                    id: true,
                    customerEmail: true,
                    customerPhone: true,
                    customerName: true,
                    totalAmount: true,
                    status: true,
                    paymentMethod: true,
                    sepayTransactionId: true,
                    orderCode: true,
                    createdAt: true,
                    updatedAt: true,
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
                    coupon: {
                        select: {
                            id: true,
                            code: true,
                            discountPercent: true,
                            status: true,
                        },
                    },
                    _count: {
                        select: {
                            orderSeats: true,
                            tickets: true,
                        },
                    },
                },
            }),
            prisma.order.count({ where }),
        ]);

        return {
            data: orders,
            meta: getPaginationMetadata(total, page, limit),
        };
    }

    async getDetail(id: string) {
        const order = await prisma.order.findUnique({
            where: { id },
            select: {
                id: true,
                customerEmail: true,
                customerPhone: true,
                customerName: true,
                totalAmount: true,
                status: true,
                paymentMethod: true,
                sepayTransactionId: true,
                orderCode: true,
                createdAt: true,
                updatedAt: true,
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
                coupon: {
                    select: {
                        id: true,
                        code: true,
                        discountPercent: true,
                        status: true,
                    },
                },
                orderSeats: {
                    select: {
                        id: true,
                        eventSeat: {
                            select: {
                                id: true,
                                eventId: true,
                                status: true,
                                seat: {
                                    select: {
                                        id: true,
                                        rowLabel: true,
                                        seatNumber: true,
                                    },
                                },
                                ticketType: {
                                    select: {
                                        id: true,
                                        name: true,
                                        price: true,
                                        color: true,
                                    },
                                },
                            },
                        },
                    },
                },
                tickets: {
                    select: {
                        id: true,
                        eventSeatId: true,
                        qrSecureToken: true,
                        isCheckedIn: true,
                        checkedInAt: true,
                    },
                },
            },
        });

        if (!order) {
            throw new AppError("Order not found", 404);
        }

        const ticketsWithQr = await Promise.all(
            order.tickets.map(async (ticket) => ({
                ...ticket,
                qrImage: await qrService.generateTicketQr(ticket.qrSecureToken),
            }))
        );

        return {
            ...order,
            tickets: ticketsWithQr,
        };
    }

    async delete(ids: string[]) {
        const uniqueIds = [...new Set(ids)];

        return await prisma.$transaction(async (tx) => {
            const orders = await tx.order.findMany({
                where: {
                    id: { in: uniqueIds },
                },
                select: {
                    id: true,
                    status: true,
                    orderSeats: {
                        select: {
                            eventSeatId: true,
                        },
                    },
                },
            });

            if (orders.length !== uniqueIds.length) {
                throw new AppError("Some orders were not found", 404);
            }

            const paidOrders = orders.filter(
                (order) => order.status === OrderStatus.PAID
            );

            if (paidOrders.length > 0) {
                throw new AppError("Paid orders cannot be deleted", 400);
            }

            const reservingSeatIds = orders
                .filter((order) => order.status === OrderStatus.PENDING)
                .flatMap((order) =>
                    order.orderSeats.map((orderSeat) => orderSeat.eventSeatId)
                );

            if (reservingSeatIds.length > 0) {
                await tx.eventSeat.updateMany({
                    where: {
                        id: { in: reservingSeatIds },
                        status: EventSeatStatus.RESERVING,
                    },
                    data: {
                        status: EventSeatStatus.AVAILABLE,
                    },
                });
            }

            await tx.ticket.deleteMany({
                where: {
                    orderId: { in: uniqueIds },
                },
            });

            await tx.orderSeat.deleteMany({
                where: {
                    orderId: { in: uniqueIds },
                },
            });

            return await tx.order.deleteMany({
                where: {
                    id: { in: uniqueIds },
                },
            });
        });
    }
}

export default new OrderService();
