import { registerCronJobs } from "./cron";
import { expirePendingOrdersTask } from "./tasks/expirePendingOrders.task";
import { generateWeeklyBlogTask } from "./tasks/generateWeeklyBlog.task";

export const startCronJobs = () => {
    registerCronJobs([
        {
            name: "Expire pending orders",
            schedule: "*/1 * * * *",
            task: expirePendingOrdersTask,
        },
        {
            name: "Generate weekly AI blog",
            schedule: "0 8 * * 1",
            task: generateWeeklyBlogTask,
        },
    ]);
};
