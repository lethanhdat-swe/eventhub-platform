import "dotenv/config";
import { SystemJobStatus, SystemJobType } from "@prisma/client";
import { prisma } from "./utils/prisma";
import { sendVerifyEmailJob } from "./queue-jobs/sendVerifyEmail.job";
import { sendForgotPasswordEmailJob } from "./queue-jobs/sendForgotPasswordEmail.job";
import { sendTicketAfterPaymentEmailJob } from "./queue-jobs/sendTicketAfterPaymentEmail.job";
import { sendEventReminderEmailJob } from "./queue-jobs/sendEventReminderEmail.job";
import { sendRefundResultEmailJob } from "./queue-jobs/sendRefundResultEmail.job";
import { sendRefundRequestReceivedEmailJob } from "./queue-jobs/sendRefundRequestReceivedEmail";

const QUEUE_INTERVAL_MS = 3000;

const sleep = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

async function runJob(jobId: string) {
    const job = await prisma.systemJob.findUnique({
        where: {
            id: jobId,
        },
    });

    if (!job) return;

    switch (job.type) {
        case SystemJobType.SEND_VERIFY_EMAIL:
            await sendVerifyEmailJob(job);
            break;

        case SystemJobType.SEND_FORGOT_PASSWORD_EMAIL:
            await sendForgotPasswordEmailJob(job);
            break;

        case SystemJobType.SEND_EVENT_REMINDER_EMAIL:
            await sendEventReminderEmailJob(job);
            break;

        case SystemJobType.SEND_TICKET_AFTER_PAYMENT_EMAIL:
            await sendTicketAfterPaymentEmailJob(job);
            break;

        case SystemJobType.SEND_REFUND_REQUEST_RECEIVED_EMAIL:
            await sendRefundRequestReceivedEmailJob(job.payload as any);
            break;

        case SystemJobType.SEND_REFUND_RESULT_EMAIL:
            await sendRefundResultEmailJob(job.payload as any);
            break;

        default:
            throw new Error(`Unsupported system job type: ${job.type}`);
    }
}

async function startQueue() {
    console.log("[Queue] Worker started.");

    while (true) {
        try {
            console.log("[Queue] Checking pending jobs...");

            const job = await prisma.systemJob.findFirst({
                where: {
                    status: SystemJobStatus.PENDING,
                },
                orderBy: {
                    createdAt: "asc",
                },
                select: {
                    id: true,
                    type: true,
                },
            });

            if (!job) {
                console.log(
                    `[Queue] No pending job. Waiting ${QUEUE_INTERVAL_MS / 1000}s...`
                );

                await sleep(QUEUE_INTERVAL_MS);
                continue;
            }

            console.log(`[Queue] Found job: ${job.type} - ${job.id}`);

            await prisma.systemJob.update({
                where: {
                    id: job.id,
                },
                data: {
                    status: SystemJobStatus.RUNNING,
                    log: null,
                },
            });

            console.log(`[Queue] Running job: ${job.type} - ${job.id}`);

            try {
                await runJob(job.id);

                await prisma.systemJob.update({
                    where: {
                        id: job.id,
                    },
                    data: {
                        status: SystemJobStatus.COMPLETED,
                        log: "Job completed successfully.",
                    },
                });

                console.log(`[Queue] Completed job: ${job.type} - ${job.id}`);
            } catch (error) {
                const message =
                    error instanceof Error
                        ? error.message
                        : "Unknown queue job error.";

                await prisma.systemJob.update({
                    where: {
                        id: job.id,
                    },
                    data: {
                        status: SystemJobStatus.FAILED,
                        log: message,
                    },
                });

                console.error(`[Queue] Failed job: ${job.type} - ${job.id}`);
                console.error(`[Queue] Error message: ${message}`);
            }
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Unknown queue worker error.";

            console.error("[Queue] Worker loop error.");
            console.error(`[Queue] Error message: ${message}`);

            await sleep(QUEUE_INTERVAL_MS);
        }
    }
}

startQueue();
