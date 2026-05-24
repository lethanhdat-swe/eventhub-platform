import { registerCronJobs } from "./cron";
import { expirePendingOrdersTask } from "./tasks/expirePendingOrders.task";

export const startCronJobs = () => {
    registerCronJobs([
        {
            name: "Expire pending orders",
            schedule: "*/1 * * * *",
            task: expirePendingOrdersTask,
        },
    ]);
};
