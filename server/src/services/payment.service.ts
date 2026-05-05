import { prisma } from "../utils/prisma";
import { AppError } from "../utils/AppError";

class PaymentService {
    async create(body: { orderCode: string }) {
        const { orderCode } = body;

        const order = await prisma.order.findUnique({
            where: { orderCode },
        });

        if (!order) {
            throw new AppError("Order not found", 404);
        }

        if (order.status !== "pending") {
            throw new AppError("Order is not eligible for payment", 400);
        }

        // giả lập response SEPAY
        return {
            orderCode: order.orderCode,
            amount: order.totalAmount,
            paymentUrl: `https://sepay.vn/pay?orderCode=${order.orderCode}`,
        };
    }

    async handleCallback(body: {
        orderCode: string;
        status: "SUCCESS" | "FAILED";
        transactionId?: string;
    }) {
        const { orderCode, status, transactionId } = body;

        const order = await prisma.order.findUnique({
            where: { orderCode },
        });

        if (!order) {
            throw new AppError("Order not found", 404);
        }

        if (order.status !== "pending") {
            return;
        }

        if (status === "SUCCESS") {
            await prisma.$transaction(async (tx) => {
                // 1. update order
                await tx.order.update({
                    where: { id: order.id },
                    data: {
                        status: "paid",
                        sepayTransactionId: transactionId,
                    },
                });

                // 2. lấy tickets
                const tickets = await tx.ticket.findMany({
                    where: { orderId: order.id },
                });

                // 3. update seats -> BOOKED
                for (const ticket of tickets) {
                    await tx.eventSeat.update({
                        where: { id: ticket.eventSeatId },
                        data: { status: "BOOKED" },
                    });
                }
            });

            // 4. gửi email (mock)
            // TODO: integrate mail service
            console.log(`Send success email for order ${orderCode}`);
        }

        if (status === "FAILED") {
            await prisma.$transaction(async (tx) => {
                // 1. update order
                await tx.order.update({
                    where: { id: order.id },
                    data: {
                        status: "failed",
                    },
                });

                // 2. lấy tickets
                const tickets = await tx.ticket.findMany({
                    where: { orderId: order.id },
                });

                // 3. release seats
                for (const ticket of tickets) {
                    await tx.eventSeat.update({
                        where: { id: ticket.eventSeatId },
                        data: { status: "AVAILABLE" },
                    });
                }

                // 4. delete tickets (optional nhưng nên làm)
                await tx.ticket.deleteMany({
                    where: { orderId: order.id },
                });
            });
        }
    }
}

export default PaymentService;
