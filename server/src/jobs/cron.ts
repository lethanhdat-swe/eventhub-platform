import cron from "node-cron";

type CronJobConfig = {
    name: string;
    schedule: string;
    task: () => Promise<void> | void;
};

export const registerCronJobs = (jobs: CronJobConfig[]) => {
    jobs.forEach((job) => {
        cron.schedule(job.schedule, async () => {
            try {
                console.log(`[CRON] Start: ${job.name}`);
                await job.task();
                console.log(`[CRON] Done: ${job.name}`);
            } catch (error) {
                console.error(`[CRON] Failed: ${job.name}`, error);
            }
        });

        console.log(`[CRON] Registered: ${job.name} - ${job.schedule}`);
    });
};
