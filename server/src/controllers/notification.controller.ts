import type { NextFunction, Request, Response } from "express";
import type {
    GetNotificationsQuery,
    NotificationIdParams,
} from "../schema/notification.schema";
import notificationService from "../services/notification.service";

class NotificationController {
    getNotifications = async (req: any, res: any, next: NextFunction) => {
        try {
            const result = await notificationService.getNotifications(
                req.query
            );

            return res.success({
                message: "Notifications fetched successfully.",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };

    getUnreadCount = async (
        _req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const result = await notificationService.getUnreadCount();

            return res.success({
                message: "Unread notification count fetched successfully.",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };

    markAsRead = async (
        req: Request<NotificationIdParams>,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const notification = await notificationService.markAsRead(
                req.params.id
            );

            return res.success({
                message: "Notification marked as read successfully.",
                data: notification,
            });
        } catch (error) {
            next(error);
        }
    };

    markAllAsRead = async (
        _req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const result = await notificationService.markAllAsRead();

            return res.success({
                message: "All notifications marked as read successfully.",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };

    deleteNotification = async (
        req: Request<NotificationIdParams>,
        res: Response,
        next: NextFunction
    ) => {
        try {
            await notificationService.deleteNotification(req.params.id);

            return res.success({
                message: "Notification deleted successfully.",
            });
        } catch (error) {
            next(error);
        }
    };
}

export default new NotificationController();
