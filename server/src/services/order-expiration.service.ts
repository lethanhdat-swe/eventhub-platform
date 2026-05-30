import paymentService from "./payment.service";
import { prisma } from "../utils/prisma";

const ORDER_EXPIRE_MINUTES = 1;

class OrderExpirationService {
    async expirePendingOrders() {
        const expiredAt = new Date(
            Date.now() - ORDER_EXPIRE_MINUTES * 60 * 1000
        );

        const expiredOrders = await prisma.order.findMany({
            where: {
                status: "PENDING",
                orderCode: {
                    not: null,
                },
                createdAt: {
                    lt: expiredAt,
                },
            },
            select: {
                id: true,
                orderCode: true,
                createdAt: true,
            },
            take: 50,
            orderBy: {
                createdAt: "asc",
            },
        });

        if (expiredOrders.length === 0) {
            return {
                expiredCount: 0,
            };
        }

        let expiredCount = 0;

        for (const order of expiredOrders) {
            if (!order.orderCode) continue;

            try {
                await paymentService.handlePaymentFailed(order.orderCode);
                expiredCount++;
            } catch (error) {
                console.error(
                    `[ORDER_EXPIRATION] Failed to expire order ${order.orderCode}`,
                    error
                );
            }
        }

        return {
            expiredCount,
        };
    }
}

export default new OrderExpirationService();
