import { registerCronJobs } from "./cron";
import { expirePendingOrdersTask } from "./tasks/expirePendingOrders.task";
import { generateWeeklyBlogTask } from "./tasks/generateWeeklyBlog.task";
import { sendEventReminderTask } from "./tasks/sendEventReminder.task";

export const startExpirePendingOrdersCron = () => {
    registerCronJobs([
        {
            name: "Expire pending orders",
            schedule: "*/1 * * * * *",
            task: expirePendingOrdersTask,
        },
    ]);
};

export const startScheduleCronJobs = () => {
    registerCronJobs([
        {
            name: "Generate weekly AI blog",
            schedule: "0 8 * * 1",
            task: generateWeeklyBlogTask,
        },
        {
            name: "Send event reminder emails",
            schedule: "*/1 * * * *",
            task: sendEventReminderTask,
        },
    ]);
};
