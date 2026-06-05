import { startScheduleCronJobs } from "./jobs";

const startScheduleProcess = () => {
    console.log("[SCHEDULE] Process started.");

    startScheduleCronJobs();

    process.on("SIGINT", () => {
        console.log("[SCHEDULE] Process stopped by SIGINT.");
        process.exit(0);
    });

    process.on("SIGTERM", () => {
        console.log("[SCHEDULE] Process stopped by SIGTERM.");
        process.exit(0);
    });
};

startScheduleProcess();
