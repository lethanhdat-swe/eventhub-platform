import { SystemJob } from "@prisma/client";
import mailService from "../services/mail.service";

export async function sendTicketAfterPaymentEmailJob(job: SystemJob) {
    const payload = job.payload as {
        email: string;
        customerName: string;
        tickets: {
            seatLabel: string;
            qrImage: string;
        }[];
    };

    await mailService.sendTicketsEmail(
        payload.email,
        payload.customerName,
        payload.tickets
    );
}
