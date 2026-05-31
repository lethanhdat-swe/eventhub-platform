import eventReminderService from "../../services/event-reminder.service";

export const sendEventReminderTask = async () => {
    const result = await eventReminderService.sendUpcomingEventReminders();

    if (result.checkedEventCount > 0) {
        console.log(
            `[EVENT_REMINDER] Checked ${result.checkedEventCount} events, sent ${result.sentCount}, skipped ${result.skippedCount}, failed ${result.failedCount}`
        );
    }
};
