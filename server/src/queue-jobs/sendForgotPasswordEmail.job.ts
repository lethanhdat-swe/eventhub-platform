import { SystemJob } from "@prisma/client";
import mailService from "../services/mail.service";

export async function sendForgotPasswordEmailJob(job: SystemJob) {
    const payload = job.payload as {
        email: string;
        fullName: string;
        token: string;
    };

    await mailService.sendForgotPasswordEmail(
        payload.email,
        payload.fullName,
        payload.token
    );
}
