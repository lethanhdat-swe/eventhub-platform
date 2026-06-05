import { NotificationType, Prisma } from "@prisma/client";
import { GetNotificationsQuery } from "../schema/notification.schema";
import { prisma } from "../utils/prisma";
import { AppError } from "../utils/AppError";

type CreateNotificationInput = {
    type: NotificationType;
    title: string;
    message: string;
};

class NotificationService {
    async createNotification(input: CreateNotificationInput) {
        const { type, title, message } = input;

        return prisma.notification.create({
            data: {
                type,
                title,
                message,
            },
            select: {
                id: true,
                type: true,
                title: true,
                message: true,
                isRead: true,
                createdAt: true,
            },
        });
    }

    async getNotifications(query: GetNotificationsQuery) {
        const { page, limit, isRead, type } = query;

        const skip = (page - 1) * limit;

        const where: any = {
            ...(typeof isRead === "boolean" && { isRead }),
            ...(type && { type }),
        };

        const [notifications, totalItems] = await Promise.all([
            prisma.notification.findMany({
                where,
                skip,
                take: Number(limit),
                orderBy: {
                    createdAt: "desc",
                },
                select: {
                    id: true,
                    type: true,
                    title: true,
                    message: true,
                    isRead: true,
                    createdAt: true,
                },
            }),

            prisma.notification.count({
                where,
            }),
        ]);

        return {
            items: notifications,
            meta: {
                totalItems,
                itemCount: notifications.length,
                itemsPerPage: limit,
                totalPages: Math.ceil(totalItems / limit),
                currentPage: page,
            },
        };
    }

    async getUnreadCount() {
        const unreadCount = await prisma.notification.count({
            where: {
                isRead: false,
            },
        });

        return {
            unreadCount,
        };
    }

    async markAsRead(id: string) {
        const notification = await prisma.notification.findUnique({
            where: { id },
            select: {
                id: true,
                isRead: true,
            },
        });

        if (!notification) {
            throw new AppError("Notification not found.", 404);
        }

        if (notification.isRead) {
            return prisma.notification.findUnique({
                where: { id },
                select: {
                    id: true,
                    type: true,
                    title: true,
                    message: true,
                    isRead: true,
                    createdAt: true,
                },
            });
        }

        return prisma.notification.update({
            where: { id },
            data: {
                isRead: true,
            },
            select: {
                id: true,
                type: true,
                title: true,
                message: true,
                isRead: true,
                createdAt: true,
            },
        });
    }

    async markAllAsRead() {
        const result = await prisma.notification.updateMany({
            where: {
                isRead: false,
            },
            data: {
                isRead: true,
            },
        });

        return {
            updatedCount: result.count,
        };
    }

    async deleteNotification(id: string) {
        const notification = await prisma.notification.findUnique({
            where: { id },
            select: {
                id: true,
            },
        });

        if (!notification) {
            throw new AppError("Notification not found.", 404);
        }

        await prisma.notification.delete({
            where: { id },
        });
    }
}

export default new NotificationService();
