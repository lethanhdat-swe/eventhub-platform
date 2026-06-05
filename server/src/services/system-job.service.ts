import { SystemJobType } from "@prisma/client";
import { prisma } from "../utils/prisma";

type RefundRequestReceivedEmailJobData = {
    email: string;
    fullName: string;
    orderCode: string;
    refundAmount: number;
    refundPercent: number;
    bankName: string;
    bankAccountNumber: string;
    bankAccountHolder: string;
};

type RefundResultEmailJobData = {
    email: string;
    fullName: string;
    orderCode: string;
    refundAmount: number;
    refundPercent: number;
    result: "COMPLETED" | "REJECTED";
};

class SystemJobService {
    async createSendVerifyEmailJob(
        email: string,
        fullName: string,
        token: string
    ) {
        return prisma.systemJob.create({
            data: {
                type: SystemJobType.SEND_VERIFY_EMAIL,
                payload: {
                    email,
                    fullName,
                    token,
                },
            },
        });
    }

    async createSendForgotPasswordEmailJob(
        email: string,
        fullName: string,
        token: string
    ) {
        return prisma.systemJob.create({
            data: {
                type: SystemJobType.SEND_FORGOT_PASSWORD_EMAIL,
                payload: {
                    email,
                    fullName,
                    token,
                },
            },
        });
    }

    async createSendTicketAfterPaymentEmailJob(
        email: string,
        customerName: string,
        order: {
            orderCode: string;
            totalAmount: number;
            paymentMethod: string;
            paidAt?: Date | string | null;
            createdAt: Date | string;
            eventTitle?: string | null;
            eventStartDate?: Date | string | null;
            eventLocation?: string | null;
        },
        tickets: {
            seatLabel: string;
            qrImage: string;
        }[]
    ) {
        return prisma.systemJob.create({
            data: {
                type: SystemJobType.SEND_TICKET_AFTER_PAYMENT_EMAIL,
                payload: {
                    email,
                    customerName,
                    order,
                    tickets,
                },
            },
        });
    }

    async createSendEventReminderEmailJob(data: {
        email: string;
        fullName: string;
        event: {
            title: string;
            location: string | null;
            startDate: Date | null;
        };
    }) {
        return prisma.systemJob.create({
            data: {
                type: SystemJobType.SEND_EVENT_REMINDER_EMAIL,
                payload: data,
            },
        });
    }

    async createSendRefundRequestReceivedEmailJob(
        data: RefundRequestReceivedEmailJobData
    ) {
        return prisma.systemJob.create({
            data: {
                type: SystemJobType.SEND_REFUND_REQUEST_RECEIVED_EMAIL,
                payload: data,
            },
        });
    }

    async createSendRefundResultEmailJob(data: RefundResultEmailJobData) {
        return prisma.systemJob.create({
            data: {
                type: SystemJobType.SEND_REFUND_RESULT_EMAIL,
                payload: data,
            },
        });
    }
}

export default new SystemJobService();
