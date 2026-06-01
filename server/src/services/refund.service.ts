import {
    OrderStatus,
    Prisma,
    RefundRequestStatus,
    SystemJobType,
} from "@prisma/client";

import { prisma } from "../utils/prisma";
import { AppError } from "../utils/AppError";
import paymentService from "./payment.service";
import {
    AdminRefundRequestQuery,
    CreateRefundRequestInput,
} from "../schema/refund.schema";

class RefundService {
    async createRefundRequest(data: CreateRefundRequestInput) {
        const order = await prisma.order.findUnique({
            where: {
                orderCode: data.orderCode,
            },
            select: {
                id: true,
                userId: true,
                orderCode: true,
                status: true,
                totalAmount: true,
                customerName: true,
                customerEmail: true,
                customerPhone: true,
                refundRequests: {
                    where: {
                        status: RefundRequestStatus.PENDING,
                    },
                    select: {
                        id: true,
                    },
                },
                tickets: {
                    select: {
                        eventSeat: {
                            select: {
                                event: {
                                    select: {
                                        startDate: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        if (!order) {
            throw new AppError("Order not found", 404);
        }

        if (order.status !== OrderStatus.PAID) {
            throw new AppError("Only paid orders can be refunded", 400);
        }

        if (
            order.customerEmail !== data.customerEmail ||
            order.customerPhone !== data.customerPhone
        ) {
            throw new AppError("Order information does not match", 400);
        }

        if (order.refundRequests.length > 0) {
            throw new AppError("Refund request already exists", 400);
        }

        const eventStartDate =
            order.tickets[0]?.eventSeat?.event?.startDate ?? null;

        if (!eventStartDate) {
            throw new AppError("Event start date is missing", 400);
        }

        const now = new Date();

        if (now >= eventStartDate) {
            throw new AppError(
                "Refund is not allowed after the event has started",
                400
            );
        }

        const threeDaysBeforeEvent = new Date(eventStartDate);
        threeDaysBeforeEvent.setDate(threeDaysBeforeEvent.getDate() - 3);

        const refundPercent = now <= threeDaysBeforeEvent ? 100 : 50;
        const refundAmount =
            Number(order.totalAmount ?? 0) * (refundPercent / 100);

        return prisma.$transaction(async (tx) => {
            const refundRequest = await tx.refundRequest.create({
                data: {
                    orderId: order.id,
                    userId: order.userId,
                    customerName: data.customerName,
                    customerEmail: data.customerEmail,
                    customerPhone: data.customerPhone,
                    bankName: data.bankName,
                    bankAccountNumber: data.bankAccountNumber,
                    bankAccountHolder: data.bankAccountHolder,
                    note: data.note,
                    refundPercent,
                    refundAmount,
                    status: RefundRequestStatus.PENDING,
                },
                select: {
                    id: true,
                    orderId: true,
                    customerName: true,
                    customerEmail: true,
                    customerPhone: true,
                    bankName: true,
                    bankAccountNumber: true,
                    bankAccountHolder: true,
                    note: true,
                    refundPercent: true,
                    refundAmount: true,
                    status: true,
                    createdAt: true,
                },
            });

            await tx.order.update({
                where: {
                    id: order.id,
                },
                data: {
                    status: OrderStatus.REFUND_PENDING,
                },
            });

            await tx.systemJob.create({
                data: {
                    type: SystemJobType.SEND_REFUND_REQUEST_RECEIVED_EMAIL,
                    payload: {
                        email: refundRequest.customerEmail,
                        fullName: refundRequest.customerName,
                        orderCode: order.orderCode ?? data.orderCode,
                        refundAmount: refundRequest.refundAmount,
                        refundPercent: refundRequest.refundPercent,
                        bankName: refundRequest.bankName,
                        bankAccountNumber: refundRequest.bankAccountNumber,
                        bankAccountHolder: refundRequest.bankAccountHolder,
                    },
                },
            });

            return {
                ...refundRequest,
                orderCode: order.orderCode,
            };
        });
    }

    async getRefundRequestsForAdmin(query: AdminRefundRequestQuery) {
        const page = Number(query.page || 1);
        const limit = Number(query.limit || 10);
        const skip = (page - 1) * limit;

        const where: Prisma.RefundRequestWhereInput = {
            ...(query.status && {
                status: query.status,
            }),
            ...(query.search && {
                OR: [
                    {
                        customerName: {
                            contains: query.search,
                        },
                    },
                    {
                        customerEmail: {
                            contains: query.search,
                        },
                    },
                    {
                        customerPhone: {
                            contains: query.search,
                        },
                    },
                    {
                        order: {
                            orderCode: {
                                contains: query.search,
                            },
                        },
                    },
                ],
            }),
        };

        const [refundRequests, totalItems] = await Promise.all([
            prisma.refundRequest.findMany({
                where,
                skip,
                take: limit,
                orderBy: {
                    createdAt: "desc",
                },
                select: {
                    id: true,
                    customerName: true,
                    customerEmail: true,
                    customerPhone: true,
                    bankName: true,
                    bankAccountNumber: true,
                    bankAccountHolder: true,
                    note: true,
                    refundPercent: true,
                    refundAmount: true,
                    status: true,
                    createdAt: true,
                    updatedAt: true,
                    order: {
                        select: {
                            id: true,
                            orderCode: true,
                            status: true,
                            totalAmount: true,
                        },
                    },
                },
            }),
            prisma.refundRequest.count({
                where,
            }),
        ]);

        return {
            items: refundRequests,
            meta: {
                totalItems,
                itemCount: refundRequests.length,
                itemsPerPage: limit,
                totalPages: Math.ceil(totalItems / limit),
                currentPage: page,
            },
        };
    }

    async completeRefundRequest(refundRequestId: string) {
        return prisma.$transaction(async (tx) => {
            const refundRequest = await tx.refundRequest.findUnique({
                where: {
                    id: refundRequestId,
                },
                select: {
                    id: true,
                    status: true,
                    customerName: true,
                    customerEmail: true,
                    refundAmount: true,
                    refundPercent: true,
                    order: {
                        select: {
                            id: true,
                            orderCode: true,
                            status: true,
                        },
                    },
                },
            });

            if (!refundRequest) {
                throw new AppError("Refund request not found", 404);
            }

            if (refundRequest.status !== RefundRequestStatus.PENDING) {
                throw new AppError("Refund request is not pending", 400);
            }

            if (refundRequest.order.status !== OrderStatus.REFUND_PENDING) {
                throw new AppError("Order is not pending refund", 400);
            }

            await paymentService.releaseBookedSeatsForRefund(
                tx,
                refundRequest.order.id
            );

            await tx.order.update({
                where: {
                    id: refundRequest.order.id,
                },
                data: {
                    status: OrderStatus.REFUNDED,
                },
            });

            const updatedRefundRequest = await tx.refundRequest.update({
                where: {
                    id: refundRequest.id,
                },
                data: {
                    status: RefundRequestStatus.COMPLETED,
                },
                select: {
                    id: true,
                    status: true,
                    refundPercent: true,
                    refundAmount: true,
                    updatedAt: true,
                    order: {
                        select: {
                            id: true,
                            orderCode: true,
                            status: true,
                        },
                    },
                },
            });

            await tx.systemJob.create({
                data: {
                    type: SystemJobType.SEND_REFUND_RESULT_EMAIL,
                    payload: {
                        email: refundRequest.customerEmail,
                        fullName: refundRequest.customerName,
                        orderCode: refundRequest.order.orderCode ?? "",
                        refundAmount: refundRequest.refundAmount,
                        refundPercent: refundRequest.refundPercent,
                        result: "COMPLETED",
                    },
                },
            });

            return updatedRefundRequest;
        });
    }

    async rejectRefundRequest(refundRequestId: string) {
        return prisma.$transaction(async (tx) => {
            const refundRequest = await tx.refundRequest.findUnique({
                where: {
                    id: refundRequestId,
                },
                select: {
                    id: true,
                    status: true,
                    customerName: true,
                    customerEmail: true,
                    refundAmount: true,
                    refundPercent: true,
                    order: {
                        select: {
                            id: true,
                            orderCode: true,
                            status: true,
                        },
                    },
                },
            });

            if (!refundRequest) {
                throw new AppError("Refund request not found", 404);
            }

            if (refundRequest.status !== RefundRequestStatus.PENDING) {
                throw new AppError("Refund request is not pending", 400);
            }

            if (refundRequest.order.status !== OrderStatus.REFUND_PENDING) {
                throw new AppError("Order is not pending refund", 400);
            }

            await tx.order.update({
                where: {
                    id: refundRequest.order.id,
                },
                data: {
                    status: OrderStatus.PAID,
                },
            });

            const updatedRefundRequest = await tx.refundRequest.update({
                where: {
                    id: refundRequest.id,
                },
                data: {
                    status: RefundRequestStatus.REJECTED,
                },
                select: {
                    id: true,
                    status: true,
                    refundPercent: true,
                    refundAmount: true,
                    updatedAt: true,
                    order: {
                        select: {
                            id: true,
                            orderCode: true,
                            status: true,
                        },
                    },
                },
            });

            await tx.systemJob.create({
                data: {
                    type: SystemJobType.SEND_REFUND_RESULT_EMAIL,
                    payload: {
                        email: refundRequest.customerEmail,
                        fullName: refundRequest.customerName,
                        orderCode: refundRequest.order.orderCode ?? "",
                        refundAmount: refundRequest.refundAmount,
                        refundPercent: refundRequest.refundPercent,
                        result: "REJECTED",
                    },
                },
            });

            return updatedRefundRequest;
        });
    }
}

export default new RefundService();
