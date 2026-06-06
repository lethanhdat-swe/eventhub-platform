import crypto from "crypto";
import { prisma } from "../utils/prisma";
import { AppError } from "../utils/AppError";
import { isEventEnded, isEventOngoing } from "../utils/eventDate";
import { getPaginationMetadata } from "../utils/pagination";
import {
    CouponStatus,
    EventSeatStatus,
    OrderStatus,
    PaymentTransactionStatus,
    PaymentMethod,
    Prisma,
    NotificationType,
} from "@prisma/client";
import paymentService from "./payment.service";
import { buildDirectOrderBy } from "../utils/listSort";
import qrService from "./qr.service";
import ticketPdfService from "./ticketPdf.service";
import notificationService from "./notification.service";
import { emitSeatChanged } from "../socket/emitters";

class OrderService {
    private getPaidAt(order: any) {
        return order.paymentTransactions?.[0]?.updatedAt ?? null;
    }

    private mapEvent(event: any) {
        if (!event) return null;

        return {
            id: event.id,
            title: event.title,
            bannerUrl: event.thumbnailUrl,
            startDate: event.startDate,
            endDate: event.endDate,
            location: event.location,
        };
    }

    private summarizeTicketTypes(eventSeats: any[]) {
        const ticketTypeMap = new Map<string, any>();

        for (const eventSeat of eventSeats) {
            const ticketType = eventSeat?.ticketType;
            if (!ticketType?.id) continue;

            const current = ticketTypeMap.get(ticketType.id);
            if (current) {
                current.quantity += 1;
                continue;
            }

            ticketTypeMap.set(ticketType.id, {
                id: ticketType.id,
                name: ticketType.name,
                color: ticketType.color,
                price: ticketType.price,
                quantity: 1,
            });
        }

        return Array.from(ticketTypeMap.values());
    }

    private getOrderDetailSelect() {
        return {
            id: true,
            orderCode: true,
            status: true,
            totalAmount: true,
            paymentMethod: true,
            createdAt: true,
            customerName: true,
            customerEmail: true,
            customerPhone: true,
            user: {
                select: {
                    id: true,
                    fullName: true,
                    email: true,
                },
            },
            tickets: {
                select: {
                    id: true,
                    qrSecureToken: true,
                    isCheckedIn: true,
                    checkedInAt: true,
                    eventSeat: {
                        select: {
                            id: true,
                            rowLabel: true,
                            seatNumber: true,
                            status: true,
                            event: {
                                select: {
                                    id: true,
                                    title: true,
                                    thumbnailUrl: true,
                                    startDate: true,
                                    endDate: true,
                                    location: true,
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
            orderSeats: {
                select: {
                    eventSeat: {
                        select: {
                            event: {
                                select: {
                                    id: true,
                                    title: true,
                                    thumbnailUrl: true,
                                    startDate: true,
                                    endDate: true,
                                    location: true,
                                },
                            },
                        },
                    },
                },
            },
            paymentTransactions: {
                where: {
                    status: PaymentTransactionStatus.MATCHED,
                },
                orderBy: {
                    updatedAt: "desc" as const,
                },
                take: 1,
                select: {
                    updatedAt: true,
                },
            },
            refundRequests: {
                orderBy: {
                    createdAt: "desc" as const,
                },
                select: {
                    id: true,
                    status: true,
                    refundPercent: true,
                    refundAmount: true,
                    createdAt: true,
                },
            },
        };
    }

    private mapOrderDetail(
        order: any,
        options: {
            includeQrToken?: boolean;
            includeCustomer?: boolean;
            includeRefunds?: boolean;
        } = {}
    ) {
        const {
            includeQrToken = false,
            includeCustomer = false,
            includeRefunds = false,
        } = options;

        const firstTicketEvent = order.tickets[0]?.eventSeat.event;
        const firstOrderSeatEvent = order.orderSeats[0]?.eventSeat.event;

        const canReturnToPayment =
            order.status === "PENDING" &&
            order.paymentMethod === "SEPAY" &&
            Boolean(order.orderCode);

        const sepay = canReturnToPayment
            ? paymentService.buildSepayPaymentInfo(
                  order.orderCode as string,
                  Number(order.totalAmount || 0)
              )
            : null;

        const refundRequests = includeRefunds
            ? (order.refundRequests ?? [])
            : undefined;

        const result: Record<string, unknown> = {
            id: order.id,
            orderCode: order.orderCode,
            status: order.status,
            totalAmount: order.totalAmount,
            finalAmount: order.totalAmount,
            paymentMethod: order.paymentMethod,
            createdAt: order.createdAt,
            paidAt: this.getPaidAt(order),
            user: order.user
                ? {
                      id: order.user.id,
                      name: order.user.fullName,
                      email: order.user.email,
                  }
                : null,
            event: this.mapEvent(firstTicketEvent ?? firstOrderSeatEvent),
            tickets: order.tickets.map((ticket: any) => {
                const mapped: Record<string, unknown> = {
                    id: ticket.id,
                    isCheckedIn: ticket.isCheckedIn,
                    checkedInAt: ticket.checkedInAt,
                    eventSeat: {
                        id: ticket.eventSeat.id,
                        rowLabel: ticket.eventSeat.rowLabel,
                        seatNumber: ticket.eventSeat.seatNumber,
                        status: ticket.eventSeat.status,
                    },
                    ticketType: ticket.eventSeat.ticketType,
                };

                if (includeQrToken) {
                    mapped.qrSecureToken = ticket.qrSecureToken;
                }

                return mapped;
            }),
            sepay,
        };

        if (includeCustomer) {
            result.customerName = order.customerName;
            result.customerEmail = order.customerEmail;
            result.customerPhone = order.customerPhone;
        }

        if (includeRefunds) {
            result.refundRequests = refundRequests;
            result.latestRefundRequest = refundRequests?.[0] ?? null;
        }

        return result;
    }

    async create(userId: string | null, body: any) {
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
                    rowLabel: true,
                    seatNumber: true,
                    status: true,
                    ticketType: {
                        select: {
                            id: true,
                            name: true,
                            price: true,
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

            const eventRecord = await tx.event.findUnique({
                where: { id: eventIds[0] },
                select: { startDate: true, endDate: true },
            });

            if (!eventRecord) {
                throw new AppError("Event not found", 404);
            }

            if (isEventEnded(eventRecord)) {
                throw new AppError("This event has already ended.", 400);
            }

            if (isEventOngoing(eventRecord)) {
                throw new AppError("This event is currently in progress.", 400);
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
                (sum, seat) => sum + Number(seat.ticketType.price),
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
                    orderCode: true,
                    totalAmount: true,
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

            const orderDetail = await tx.order.findUnique({
                where: { id: order.id },
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

                    orderSeats: {
                        select: {
                            eventSeat: {
                                select: {
                                    event: {
                                        select: {
                                            id: true,
                                            title: true,
                                            location: true,
                                            startDate: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            });

            if (!orderDetail) {
                throw new AppError("Order not found after created", 404);
            }

            const event = orderDetail.orderSeats[0]?.eventSeat.event ?? null;

            return {
                ...orderDetail,
                event,
                ticketCount: orderDetail.orderSeats.length,
                expiredAt: new Date(Date.now() + 15 * 60 * 1000),
            };
        });

        if (result.event?.id) {
            emitSeatChanged(result.event.id);
        }

        await notificationService.createNotification({
            type: NotificationType.ORDER_CREATED,
            title: "Đơn hàng mới",
            message: `${result.customerName || result.customerEmail} vừa đặt ${result.ticketCount} vé cho sự kiện ${result.event?.title || "không xác định"}.`,
        });

        return {
            order: result,
            sepay: paymentService.buildSepayPaymentInfo(
                result.orderCode ?? "",
                Number(result.totalAmount)
            ),
        };
    }

    async list(query: {
        search?: string;
        page: number;
        limit: number;
        status?: OrderStatus;
        sortBy?: string;
        sortOrder?: "asc" | "desc";
    }) {
        const { page = 1, limit = 10, search, status, sortBy, sortOrder } =
            query;
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

        const orderBy = buildDirectOrderBy(
            sortBy,
            sortOrder,
            {
                orderCode: "orderCode",
                customerName: "customerName",
                customerEmail: "customerEmail",
                totalAmount: "totalAmount",
                paymentMethod: "paymentMethod",
                status: "status",
                createdAt: "createdAt",
            },
            { createdAt: "desc" }
        );

        const [orders, total] = await Promise.all([
            prisma.order.findMany({
                where,
                skip,
                take: Number(limit),
                orderBy,
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

    async myOrders(
        userId: string,
        query: {
            page?: number;
            limit?: number;
            status?: OrderStatus;
        }
    ) {
        const { page = 1, limit = 10, status } = query;
        const skip = (page - 1) * limit;

        const where: Prisma.OrderWhereInput = {
            userId,
        };

        if (status) {
            where.status = status;
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
                    orderCode: true,
                    status: true,
                    totalAmount: true,
                    paymentMethod: true,
                    createdAt: true,
                    tickets: {
                        select: {
                            eventSeat: {
                                select: {
                                    event: {
                                        select: {
                                            id: true,
                                            title: true,
                                            thumbnailUrl: true,
                                            startDate: true,
                                            endDate: true,
                                            location: true,
                                        },
                                    },
                                    ticketType: {
                                        select: {
                                            id: true,
                                            name: true,
                                            color: true,
                                            price: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                    orderSeats: {
                        select: {
                            eventSeat: {
                                select: {
                                    event: {
                                        select: {
                                            id: true,
                                            title: true,
                                            thumbnailUrl: true,
                                            startDate: true,
                                            endDate: true,
                                            location: true,
                                        },
                                    },
                                    ticketType: {
                                        select: {
                                            id: true,
                                            name: true,
                                            color: true,
                                            price: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                    paymentTransactions: {
                        where: {
                            status: PaymentTransactionStatus.MATCHED,
                        },
                        orderBy: {
                            updatedAt: "desc",
                        },
                        take: 1,
                        select: {
                            updatedAt: true,
                        },
                    },
                },
            }),
            prisma.order.count({ where }),
        ]);

        return {
            data: orders.map((order) => {
                const ticketEventSeats = order.tickets.map(
                    (ticket) => ticket.eventSeat
                );
                const orderEventSeats = order.orderSeats.map(
                    (orderSeat) => orderSeat.eventSeat
                );
                const eventSeats =
                    ticketEventSeats.length > 0
                        ? ticketEventSeats
                        : orderEventSeats;

                return {
                    id: order.id,
                    orderCode: order.orderCode,
                    status: order.status,
                    totalAmount: order.totalAmount,
                    finalAmount: order.totalAmount,
                    paymentMethod: order.paymentMethod,
                    createdAt: order.createdAt,
                    paidAt: this.getPaidAt(order),
                    ticketCount:
                        ticketEventSeats.length || orderEventSeats.length,
                    event: this.mapEvent(eventSeats[0]?.event),
                    ticketTypes: this.summarizeTicketTypes(eventSeats),
                };
            }),
            meta: getPaginationMetadata(total, page, limit),
        };
    }

    async myOrderDetail(userId: string, orderId: string) {
        const order = await prisma.order.findFirst({
            where: {
                id: orderId,
                userId,
            },
            select: this.getOrderDetailSelect(),
        });

        if (!order) {
            throw new AppError("Order not found", 404);
        }

        return this.mapOrderDetail(order, { includeQrToken: true });
    }

    async lookupByOrderCode(orderCode: string) {
        const normalizedCode = orderCode.trim();

        const order = await prisma.order.findUnique({
            where: {
                orderCode: normalizedCode,
            },
            select: this.getOrderDetailSelect(),
        });

        if (!order) {
            throw new AppError(
                "Không tìm thấy đơn hàng với mã đã nhập. Vui lòng kiểm tra lại mã đơn.",
                404
            );
        }

        return this.mapOrderDetail(order, {
            includeCustomer: true,
            includeRefunds: true,
        });
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
                                rowLabel: true,
                                seatNumber: true,
                                status: true,
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

    async exportMyOrderTicketPdf(userId: string, orderId: string) {
        const order = await prisma.order.findFirst({
            where: {
                id: orderId,
                userId,
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
                createdAt: true,
                user: {
                    select: {
                        id: true,
                        email: true,
                        fullName: true,
                        phoneNumber: true,
                    },
                },
                paymentTransactions: {
                    where: {
                        status: "MATCHED",
                    },
                    orderBy: {
                        createdAt: "desc",
                    },
                    take: 1,
                    select: {
                        id: true,
                        amount: true,
                        gateway: true,
                        createdAt: true,
                    },
                },
                tickets: {
                    orderBy: {
                        id: "asc",
                    },
                    select: {
                        id: true,
                        qrSecureToken: true,
                        isCheckedIn: true,
                        checkedInAt: true,
                        eventSeat: {
                            select: {
                                id: true,
                                rowLabel: true,
                                seatNumber: true,
                                event: {
                                    select: {
                                        id: true,
                                        title: true,
                                        location: true,
                                        startDate: true,
                                        endDate: true,
                                        thumbnailUrl: true,
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
            },
        });

        if (!order) {
            throw new AppError("Order not found.", 404);
        }

        if (order.status !== "PAID") {
            throw new AppError("Only paid orders can export ticket PDF.", 400);
        }

        if (!order.tickets.length) {
            throw new AppError("No tickets found for this order.", 400);
        }

        const pdfBuffer = await ticketPdfService.generateOrderTicketPdf(order);

        return pdfBuffer;
    }
}

export default new OrderService();
