import crypto from "crypto";
import {
    EventSeatStatus,
    OrderStatus,
    PaymentTransactionStatus,
} from "@prisma/client";

import { prisma } from "../utils/prisma";
import { AppError } from "../utils/AppError";
import { SepayWebhookInput } from "../schema/payment.schema";
import qrService from "./qr.service";
import mailService from "./mail.service";

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

                return this.getPaidOrder(tx, order.id);
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

            const paidOrder = await this.getPaidOrder(tx, order.id);
            const ticketsWithQr = await Promise.all(
                paidOrder.tickets.map(async (ticket: any) => ({
                    ...ticket,
                    qrImage: await qrService.generateTicketQr(
                        ticket.qrSecureToken
                    ),
                }))
            );

            await mailService.sendTicketsEmail(
                paidOrder.customerEmail,
                paidOrder.customerName ??
                    paidOrder.user?.fullName ??
                    "Customer",
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

    private async getPaidOrder(tx: any, orderId: string) {
        const paidOrder = await tx.order.findUnique({
            where: { id: orderId },
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
                                rowLabel: true,
                                seatNumber: true,
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
}

export default new PaymentService();
