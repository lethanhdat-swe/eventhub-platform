import { SystemJob } from "@prisma/client";
import mailService from "../services/mail.service";

export async function sendTicketAfterPaymentEmailJob(job: SystemJob) {
    const payload = job.payload as {
        email: string;
        customerName: string;
        order: {
            orderCode: string;
            totalAmount: number;
            paymentMethod: string;
            paidAt?: Date | string | null;
            createdAt: Date | string;
            eventTitle?: string | null;
            eventStartDate?: Date | string | null;
            eventLocation?: string | null;
        };
        tickets: {
            seatLabel: string;
            qrImage: string;
        }[];
    };

    await mailService.sendTicketsEmail(
        payload.email,
        payload.customerName,
        payload.order,
        payload.tickets
    );
}
