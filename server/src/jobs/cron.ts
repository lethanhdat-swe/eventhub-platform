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
                await job.task();
            } catch (error) {}
        });

        console.log(`[CRON] Registered: ${job.name} - ${job.schedule}`);
    });
};
