import crypto from "crypto";
import { prisma } from "../utils/prisma";
import { AppError } from "../utils/AppError";
import { EventSeatStatus, OrderStatus } from "@prisma/client";
import { SepayWebhookInput } from "../schema/payment.schema";
import qrService from "./qr.service";
import mailService from "./mail.service";
class PaymentService {
    buildSepayPaymentInfo(orderCode: string, amount: number) {
        return {
            orderCode,
            amount,
            paymentUrl: `https://sepay.vn/pay?orderCode=${orderCode}`,
        };
    }

    async handlePaymentSuccess(data: SepayWebhookInput) {
        const { orderCode, transactionId, amount } = data;

        return prisma.$transaction(async (tx) => {
            const order = await tx.order.findUnique({
                where: { orderCode },
                select: {
                    id: true,
                    status: true,
                    totalAmount: true,
                    sepayTransactionId: true,
                    orderSeats: {
                        select: {
                            eventSeatId: true,
                        },
                    },
                },
            });

            if (!order) {
                throw new AppError("Order not found", 404);
            }

            if (Math.round(order.totalAmount ?? 0) !== Math.round(amount)) {
                throw new AppError(
                    "Payment amount does not match order total",
                    400
                );
            }

            if (order.status === OrderStatus.PAID) {
                if (order.sepayTransactionId !== transactionId) {
                    throw new AppError(
                        "Order was already paid by another transaction",
                        409
                    );
                }

                return tx.order.findUnique({
                    where: { id: order.id },
                    select: {
                        id: true,
                        status: true,
                        totalAmount: true,
                        sepayTransactionId: true,
                        orderCode: true,
                        tickets: {
                            select: {
                                id: true,
                                eventSeatId: true,
                                qrSecureToken: true,
                                isCheckedIn: true,
                                checkedInAt: true,
                            },
                        },
                        orderSeats: {
                            select: {
                                id: true,
                                eventSeatId: true,
                            },
                        },
                    },
                });
            }

            if (order.status !== OrderStatus.PENDING) {
                throw new AppError("Order is not pending payment", 400);
            }

            if (order.orderSeats.length === 0) {
                throw new AppError("Order has no seats", 400);
            }

            const existedTransaction = await tx.order.findUnique({
                where: { sepayTransactionId: transactionId },
                select: {
                    id: true,
                },
            });

            if (existedTransaction) {
                throw new AppError("Transaction ID already exists", 409);
            }

            const eventSeatIds = order.orderSeats.map(
                (orderSeat) => orderSeat.eventSeatId
            );

            const seatUpdate = await tx.eventSeat.updateMany({
                where: {
                    id: { in: eventSeatIds },
                    status: EventSeatStatus.RESERVING,
                },
                data: {
                    status: EventSeatStatus.BOOKED,
                },
            });

            if (seatUpdate.count !== order.orderSeats.length) {
                throw new AppError(
                    "Seat reservation state mismatch; cannot complete payment",
                    409
                );
            }

            await tx.order.update({
                where: { id: order.id },
                data: {
                    status: OrderStatus.PAID,
                    sepayTransactionId: transactionId,
                },
            });

            await tx.ticket.createMany({
                data: eventSeatIds.map((eventSeatId) => ({
                    orderId: order.id,
                    eventSeatId,
                    qrSecureToken: crypto.randomBytes(24).toString("hex"),
                })),
                skipDuplicates: true,
            });

            const paidOrder = await tx.order.findUnique({
                where: { id: order.id },
                select: {
                    id: true,
                    customerEmail: true,
                    customerName: true,
                    status: true,
                    totalAmount: true,
                    sepayTransactionId: true,
                    orderCode: true,
                    user: {
                        select: {
                            fullName: true,
                        },
                    },
                    tickets: {
                        select: {
                            id: true,
                            eventSeatId: true,
                            qrSecureToken: true,
                            isCheckedIn: true,
                            checkedInAt: true,
                            eventSeat: {
                                select: {
                                    seat: {
                                        select: {
                                            rowLabel: true,
                                            seatNumber: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                    orderSeats: {
                        select: {
                            id: true,
                            eventSeatId: true,
                        },
                    },
                },
            });

            if (!paidOrder) {
                throw new AppError("Order not found after payment", 404);
            }

            const ticketsWithQr = await Promise.all(
                paidOrder.tickets.map(async (ticket) => ({
                    ...ticket,
                    qrImage: await qrService.generateTicketQr(
                        ticket.qrSecureToken
                    ),
                }))
            );

            await mailService.sendTicketsEmail(
                paidOrder.customerEmail,
                paidOrder.customerName ?? paidOrder.user.fullName,
                ticketsWithQr.map((ticket) => ({
                    seatLabel: `${ticket.eventSeat.seat.rowLabel}${ticket.eventSeat.seat.seatNumber}`,
                    qrImage: ticket.qrImage,
                }))
            );

            return {
                ...paidOrder,
                tickets: ticketsWithQr,
            };
        });
    }

    async handlePaymentFailed(orderCode: string) {
        return prisma.$transaction(async (tx) => {
            const order = await tx.order.findUnique({
                where: { orderCode },
                select: {
                    id: true,
                    status: true,
                    orderCode: true,
                    orderSeats: {
                        select: {
                            eventSeatId: true,
                        },
                    },
                },
            });

            if (!order) {
                throw new AppError("Order not found", 404);
            }

            if (order.status === OrderStatus.PAID) {
                throw new AppError("Paid order cannot be cancelled", 400);
            }

            if (order.status === OrderStatus.CANCELLED) {
                return order;
            }

            if (order.status !== OrderStatus.PENDING) {
                throw new AppError("Order is not pending payment", 400);
            }

            const eventSeatIds = order.orderSeats.map(
                (orderSeat) => orderSeat.eventSeatId
            );

            if (eventSeatIds.length > 0) {
                await tx.eventSeat.updateMany({
                    where: {
                        id: { in: eventSeatIds },
                        status: EventSeatStatus.RESERVING,
                    },
                    data: {
                        status: EventSeatStatus.AVAILABLE,
                    },
                });
            }

            return tx.order.update({
                where: { id: order.id },
                data: {
                    status: OrderStatus.CANCELLED,
                },
                select: {
                    id: true,
                    orderCode: true,
                    status: true,
                    totalAmount: true,
                    updatedAt: true,
                },
            });
        });
    }
}

export default new PaymentService();
