import { SystemJob } from "@prisma/client";
import mailService from "../services/mail.service";

export async function sendEventReminderEmailJob(job: SystemJob) {
    const payload = job.payload as {
        email: string;
        fullName: string;
        event: {
            title: string;
            location: string | null;
            startDate: Date | string | null;
        };
    };

    await mailService.sendEventReminderEmail({
        email: payload.email,
        fullName: payload.fullName,
        event: {
            title: payload.event.title,
            location: payload.event.location,
            startDate: payload.event.startDate
                ? new Date(payload.event.startDate)
                : null,
        },
    });
}
