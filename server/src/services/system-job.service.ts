import { SystemJobType } from "@prisma/client";
import { prisma } from "../utils/prisma";

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
}

export default new SystemJobService();
