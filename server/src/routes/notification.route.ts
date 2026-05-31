import { Router } from "express";

import {
    getNotificationsSchema,
    notificationIdSchema,
} from "../schema/notification.schema";
import { isAuth, restrictTo } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import notificationController from "../controllers/notification.controller";

const router = Router();

router.use(isAuth);
router.use(restrictTo("ADMIN"));

router.get(
    "/",
    validate(getNotificationsSchema),
    notificationController.getNotifications
);

router.get("/unread-count", notificationController.getUnreadCount);

router.patch(
    "/:id/read",
    validate(notificationIdSchema),
    notificationController.markAsRead
);

router.patch("/read-all", notificationController.markAllAsRead);

router.delete(
    "/:id",
    validate(notificationIdSchema),
    notificationController.deleteNotification
);

export default router;
