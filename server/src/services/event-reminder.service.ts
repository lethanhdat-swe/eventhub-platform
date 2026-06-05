import { prisma } from "../utils/prisma";
import mailService from "./mail.service";
import systemJobService from "./system-job.service";

type ReminderUser = {
    userId: string;
    email: string;
    fullName: string;
};

class EventReminderService {
    private readonly reminderBeforeHours = 24;

    async sendUpcomingEventReminders() {
        const now = new Date();
        const reminderDeadline = this.getReminderDeadline(now);

        const events = await prisma.event.findMany({
            where: {
                status: "PUBLISHED",
                startDate: {
                    not: null,
                    gte: now,
                    lte: reminderDeadline,
                },
            },
            select: {
                id: true,
                title: true,
                slug: true,
                location: true,
                startDate: true,
                endDate: true,
                thumbnailUrl: true,
            },
            orderBy: {
                startDate: "asc",
            },
        });

        let sentCount = 0;
        let skippedCount = 0;
        let failedCount = 0;

        for (const event of events) {
            const users = await this.getPaidUsersByEventId(event.id);

            for (const user of users) {
                const alreadySent = await this.hasReminderLog({
                    eventId: event.id,
                    userId: user.userId,
                });

                if (alreadySent) {
                    skippedCount += 1;
                    continue;
                }

                try {
                    await systemJobService.createSendEventReminderEmailJob({
                        email: user.email,
                        fullName: user.fullName,
                        event: {
                            title: event.title,
                            location: event.location,
                            startDate: event.startDate,
                        },
                    });

                    await prisma.eventReminderLog.create({
                        data: {
                            eventId: event.id,
                            userId: user.userId,
                        },
                    });

                    sentCount += 1;
                } catch (error) {
                    failedCount += 1;

                    console.error(
                        `[EVENT_REMINDER] Failed to send reminder email. eventId=${event.id}, userId=${user.userId}`,
                        error
                    );
                }
            }
        }

        return {
            checkedEventCount: events.length,
            sentCount,
            skippedCount,
            failedCount,
        };
    }

    private getReminderDeadline(now: Date) {
        return new Date(
            now.getTime() + this.reminderBeforeHours * 60 * 60 * 1000
        );
    }

    private async getPaidUsersByEventId(eventId: string) {
        const paidOrders = await prisma.order.findMany({
            where: {
                status: "PAID",
                userId: {
                    not: null,
                },
                tickets: {
                    some: {
                        eventSeat: {
                            eventId,
                        },
                    },
                },
            },
            select: {
                userId: true,
                customerEmail: true,
                customerName: true,
                user: {
                    select: {
                        id: true,
                        email: true,
                        fullName: true,
                    },
                },
            },
        });

        const users = new Map<string, ReminderUser>();

        for (const order of paidOrders) {
            if (!order.userId) continue;

            const email = order.user?.email || order.customerEmail;
            const fullName =
                order.user?.fullName || order.customerName || "bạn";

            if (!email) continue;

            users.set(order.userId, {
                userId: order.userId,
                email,
                fullName,
            });
        }

        return Array.from(users.values());
    }

    private async hasReminderLog({
        eventId,
        userId,
    }: {
        eventId: string;
        userId: string;
    }) {
        const reminderLog = await prisma.eventReminderLog.findUnique({
            where: {
                eventId_userId: {
                    eventId,
                    userId,
                },
            },
            select: {
                id: true,
            },
        });

        return Boolean(reminderLog);
    }
}

export default new EventReminderService();
