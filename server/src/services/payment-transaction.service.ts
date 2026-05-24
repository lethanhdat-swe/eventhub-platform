import { prisma } from "../utils/prisma";
import { AppError } from "../utils/AppError";
import { PaymentTransactionStatus } from "@prisma/client";
import paymentService from "./payment.service";

class PaymentTransactionService {
    async list(query: {
        page?: number;
        limit?: number;
        status?: string;
        search?: string;
    }) {
        const page = query.page ?? 1;
        const limit = query.limit ?? 10;
        const skip = (page - 1) * limit;

        const where: any = {};

        if (query.status) {
            where.status = query.status;
        }

        if (query.search) {
            where.OR = [
                { transactionId: { contains: query.search } },
                { orderCode: { contains: query.search } },
                { content: { contains: query.search } },
                { gateway: { contains: query.search } },
            ];
        }

        const [items, total] = await Promise.all([
            prisma.paymentTransaction.findMany({
                where,
                skip,
                take: Number(limit),
                orderBy: {
                    createdAt: "desc",
                },
                include: {
                    order: {
                        select: {
                            id: true,
                            orderCode: true,
                            customerEmail: true,
                            customerPhone: true,
                            customerName: true,
                            totalAmount: true,
                            status: true,
                        },
                    },
                },
            }),
            prisma.paymentTransaction.count({ where }),
        ]);

        return {
            items,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async getDetail(id: string) {
        const transaction = await prisma.paymentTransaction.findUnique({
            where: { id },
            include: {
                order: {
                    include: {
                        orderSeats: true,
                        tickets: true,
                    },
                },
            },
        });

        if (!transaction) {
            throw new AppError("Payment transaction not found.", 404);
        }

        return transaction;
    }

    async manualConfirm(id: string, orderCode: string) {
        const transaction = await prisma.paymentTransaction.findUnique({
            where: { id },
        });

        if (!transaction) {
            throw new AppError("Payment transaction not found.", 404);
        }

        if (transaction.status === PaymentTransactionStatus.MATCHED) {
            throw new AppError("Payment transaction is already matched.", 400);
        }

        return paymentService.handlePaymentSuccess({
            orderCode,
            transactionId: transaction.transactionId,
            amount: transaction.amount,
        });
    }
}

export default new PaymentTransactionService();
