import crypto from "crypto";
import { prisma } from "../utils/prisma";
import { AppError } from "../utils/AppError";

class PaymentService {
    static buildSepayPaymentInfo(orderCode: string, amount: number) {
        return {
            orderCode,
            amount,
            paymentUrl: `https://sepay.vn/pay?orderCode=${orderCode}`,
        };
    }

    static async handlePaymentSuccess(
        orderCode: string,
        sepayTransactionId: string
    ) {
        return prisma.$transaction(async (tx) => {
            const order = await tx.order.findUnique({
                where: { orderCode },
                include: { orderSeats: true },
            });

            if (!order) {
                throw new AppError("Order not found", 404);
            }

            if (order.status === "PAID" || order.status === "SUCCESS") {
                return tx.order.findUnique({
                    where: { id: order.id },
                    include: { orderSeats: true, tickets: true },
                });
            }

            if (order.status !== "PENDING") {
                throw new AppError("Order is not pending payment", 400);
            }

            if (order.orderSeats.length === 0) {
                throw new AppError("Order has no seats", 400);
            }

            const eventSeatIds = order.orderSeats.map((os) => os.eventSeatId);

            const seatUpdate = await tx.eventSeat.updateMany({
                where: {
                    id: { in: eventSeatIds },
                    status: "RESERVING",
                },
                data: { status: "BOOKED" },
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
                    status: "PAID",
                    sepayTransactionId,
                },
            });

            await tx.ticket.createMany({
                data: eventSeatIds.map((eventSeatId) => ({
                    orderId: order.id,
                    eventSeatId,
                    qrSecureToken: crypto.randomBytes(24).toString("hex"),
                })),
            });

            return tx.order.findUnique({
                where: { id: order.id },
                include: { orderSeats: true, tickets: true },
            });
        });
    }
}

export default PaymentService;
