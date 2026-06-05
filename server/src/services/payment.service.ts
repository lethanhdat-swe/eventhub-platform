import crypto from "crypto";
import {
    EventSeatStatus,
    NotificationType,
    OrderStatus,
    PaymentTransactionStatus,
    Prisma,
} from "@prisma/client";

import { prisma } from "../utils/prisma";
import { AppError } from "../utils/AppError";
import { SepayWebhookInput } from "../schema/payment.schema";
import qrService from "./qr.service";
import mailService from "./mail.service";
import notificationService from "./notification.service";
import systemJobService from "./system-job.service";
import {
    emitPaymentExpired,
    emitPaymentFailed,
    emitPaymentPaid,
    emitSeatChanged,
} from "../socket/emitters";

type PaymentSuccessInput = {
    orderCode: string;
    transactionId: string;
    amount: number;
};

class PaymentService {
    buildSepayPaymentInfo(orderCode: string, amount: number) {
        const bankCode = process.env.SEPAY_BANK_CODE;
        const accountNumber = process.env.SEPAY_ACCOUNT_NUMBER;
        const accountName = process.env.SEPAY_ACCOUNT_NAME;

        const qrUrl =
            `https://qr.sepay.vn/img` +
            `?bank=${bankCode}` +
            `&acc=${accountNumber}` +
            `&template=compact` +
            `&amount=${amount}` +
            `&des=${encodeURIComponent(orderCode)}`;

        return {
            method: "SEPAY",
            orderCode,
            amount,

            bankCode,
            accountNumber,
            accountName,

            transferContent: orderCode,

            qrUrl,

            paymentUrl: `https://sepay.vn/pay?orderCode=${orderCode}`,
        };
    }
    async handleSepayWebhook(payload: SepayWebhookInput) {
        if (payload.transferType !== "in") {
            return {
                ignored: true,
                reason: "Not an incoming transaction",
            };
        }

        const orderCode = this.extractOrderCode(payload.content);

        const paymentTransaction = await prisma.paymentTransaction.create({
            data: {
                transactionId: String(payload.referenceCode),
                orderCode,
                amount: Number(payload.transferAmount) ?? 0,
                content: payload.content,
                gateway: payload.gateway,
                status: PaymentTransactionStatus.PENDING,
            },
        });

        await notificationService.createNotification({
            type: NotificationType.PAYMENT_CREATED,
            title: "Giao dịch thanh toán mới",
            message: `Hệ thống vừa nhận giao dịch ${paymentTransaction.transactionId} với số tiền ${paymentTransaction.amount.toLocaleString("vi-VN")}đ.`,
        });

        if (!orderCode) {
            await prisma.paymentTransaction.update({
                where: { id: paymentTransaction.id },
                data: {
                    status: PaymentTransactionStatus.UNMATCHED,
                },
            });

            throw new AppError("Order code not found in transfer content", 400);
        }

        const transactionId = String(payload.referenceCode ?? "");

        if (!transactionId) {
            throw new AppError("Transaction ID is required", 400);
        }

        return this.handlePaymentSuccess({
            orderCode,
            transactionId,
            amount: payload.transferAmount,
        });
    }

    private extractOrderCode(content: string) {
        const match = content.match(/\bEH\d+\b/i);
        return match?.[0]?.toUpperCase() ?? null;
    }

    async handlePaymentSuccess(data: PaymentSuccessInput) {
        const { orderCode, transactionId, amount } = data;

        const outcome = await prisma.$transaction(async (tx) => {
            const order = await tx.order.findUnique({
                where: { orderCode },
                select: {
                    id: true,
                    status: true,
                    totalAmount: true,
                    sepayTransactionId: true,
                    orderCode: true,
                    orderSeats: {
                        select: {
                            eventSeatId: true,
                            eventSeat: {
                                select: {
                                    eventId: true,
                                },
                            },
                        },
                    },
                },
            });

            if (!order) {
                await tx.paymentTransaction.update({
                    where: { transactionId },
                    data: {
                        status: PaymentTransactionStatus.UNMATCHED,
                    },
                });

                throw new AppError("Order not found", 404);
            }

            if (
                Math.round(Number(order.totalAmount ?? 0)) !==
                Math.round(amount)
            ) {
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

                const paidOrder = await this.getPaidOrder(tx, order.id);

                return {
                    kind: "idempotent" as const,
                    data: paidOrder,
                };
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
            const eventId = order.orderSeats[0]?.eventSeat?.eventId ?? null;

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

            const paidOrder = await this.getPaidOrder(tx, order.id);
            const ticketsWithQr = await Promise.all(
                paidOrder.tickets.map(async (ticket: any) => ({
                    ...ticket,
                    qrImage: await qrService.generateTicketQr(
                        ticket.qrSecureToken
                    ),
                }))
            );

            const event = ticketsWithQr[0]?.eventSeat?.event;

            await systemJobService.createSendTicketAfterPaymentEmailJob(
                paidOrder.customerEmail,
                paidOrder.customerName ??
                    paidOrder.user?.fullName ??
                    "Customer",
                {
                    orderCode: paidOrder.orderCode ?? orderCode,
                    totalAmount: paidOrder.totalAmount ?? 0,
                    paymentMethod:
                        paidOrder.paymentMethod === "SEPAY"
                            ? "SePay"
                            : String(paidOrder.paymentMethod),
                    paidAt: paidOrder.updatedAt,
                    createdAt: paidOrder.createdAt,
                    eventTitle: event?.title ?? null,
                    eventStartDate: event?.startDate ?? null,
                    eventLocation: event?.location ?? null,
                },
                ticketsWithQr.map((ticket) => ({
                    seatLabel: `${ticket.eventSeat?.rowLabel ?? ""}${
                        ticket.eventSeat?.seatNumber ?? ""
                    }`,
                    qrImage: ticket.qrImage,
                }))
            );

            await tx.paymentTransaction.update({
                where: { transactionId },
                data: {
                    orderId: order.id,
                    orderCode,
                    status: PaymentTransactionStatus.MATCHED,
                },
            });

            return {
                kind: "new" as const,
                data: {
                    ...paidOrder,
                    tickets: ticketsWithQr,
                },
                orderId: order.id,
                orderCode: paidOrder.orderCode ?? orderCode,
                eventId,
            };
        });

        if (
            outcome.kind === "new" &&
            outcome.orderId &&
            outcome.orderCode
        ) {
            emitPaymentPaid(outcome.orderId, {
                orderCode: outcome.orderCode,
                status: "PAID",
            });

            if (outcome.eventId) {
                emitSeatChanged(outcome.eventId);
            }
        }

        return outcome.data;
    }

    async handlePaymentFailed(
        orderCode: string,
        options: { reason: "failed" | "expired" } = { reason: "failed" }
    ) {
        const outcome = await prisma.$transaction(async (tx) => {
            const order = await tx.order.findUnique({
                where: { orderCode },
                select: {
                    id: true,
                    status: true,
                    orderCode: true,
                    orderSeats: {
                        select: {
                            eventSeatId: true,
                            eventSeat: {
                                select: {
                                    eventId: true,
                                },
                            },
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
                return {
                    cancelled: false,
                    data: order,
                };
            }

            if (order.status !== OrderStatus.PENDING) {
                throw new AppError("Order is not pending payment", 400);
            }

            const eventSeatIds = order.orderSeats.map(
                (orderSeat) => orderSeat.eventSeatId
            );
            const eventId =
                order.orderSeats[0]?.eventSeat?.eventId ?? null;

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

            const updatedOrder = await tx.order.update({
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

            return {
                cancelled: true,
                data: updatedOrder,
                orderId: order.id,
                orderCode: order.orderCode,
                eventId,
            };
        });

        if (
            outcome.cancelled &&
            outcome.orderId &&
            outcome.orderCode
        ) {
            if (options.reason === "expired") {
                emitPaymentExpired(outcome.orderId, {
                    orderCode: outcome.orderCode,
                    status: "EXPIRED",
                });
            } else {
                emitPaymentFailed(outcome.orderId, {
                    orderCode: outcome.orderCode,
                    status: "FAILED",
                });
            }

            if (outcome.eventId) {
                emitSeatChanged(outcome.eventId);
            }
        }

        return outcome.data;
    }

    private async getPaidOrder(tx: any, orderId: string) {
        const paidOrder = await tx.order.findUnique({
            where: { id: orderId },
            select: {
                id: true,
                customerEmail: true,
                customerName: true,
                status: true,
                totalAmount: true,
                paymentMethod: true,
                createdAt: true,
                updatedAt: true,
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
                                rowLabel: true,
                                seatNumber: true,
                                event: {
                                    select: {
                                        title: true,
                                        startDate: true,
                                        location: true,
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

        return paidOrder;
    }

    async releaseBookedSeatsForRefund(
        tx: Prisma.TransactionClient,
        orderId: string
    ) {
        const orderSeats = await tx.orderSeat.findMany({
            where: {
                orderId,
            },
            select: {
                eventSeatId: true,
            },
        });

        const eventSeatIds = orderSeats.map(
            (orderSeat) => orderSeat.eventSeatId
        );

        if (eventSeatIds.length === 0) {
            throw new AppError("Order has no seats", 400);
        }

        const seatUpdate = await tx.eventSeat.updateMany({
            where: {
                id: {
                    in: eventSeatIds,
                },
                status: EventSeatStatus.BOOKED,
            },
            data: {
                status: EventSeatStatus.AVAILABLE,
            },
        });

        if (seatUpdate.count !== eventSeatIds.length) {
            throw new AppError(
                "Seat booking state mismatch; cannot complete refund",
                409
            );
        }

        return {
            releasedSeatCount: seatUpdate.count,
        };
    }
}

export default new PaymentService();
