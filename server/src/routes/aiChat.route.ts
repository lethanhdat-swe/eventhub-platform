import { Router } from "express";
import {
    createChatSessionSchema,
    getChatMessagesSchema,
    listChatSessionsSchema,
    sendAdminChatMessageSchema,
    sendChatMessageSchema,
    updateChatSessionStatusSchema,
} from "../schema/aiChat.schema";
import {
    isAuth,
    optionalAuth,
    restrictTo,
} from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import aiChatController from "../controllers/aiChat.controller";

const router = Router();

router.get(
    "/admin/sessions",
    isAuth,
    restrictTo("ADMIN"),
    validate(listChatSessionsSchema),
    aiChatController.listSessions
);

router.post(
    "/admin/sessions/:sessionId/messages",
    isAuth,
    restrictTo("ADMIN"),
    validate(sendAdminChatMessageSchema),
    aiChatController.sendAdminMessage
);

router.patch(
    "/admin/sessions/:sessionId/status",
    isAuth,
    restrictTo("ADMIN"),
    validate(updateChatSessionStatusSchema),
    aiChatController.updateSessionStatus
);

router.get("/sessions/me/latest", isAuth, aiChatController.getLatestMySession);

router.post(
    "/sessions",
    optionalAuth,
    validate(createChatSessionSchema),
    aiChatController.createSession
);

router.get(
    "/sessions/:sessionId/messages",
    optionalAuth,
    validate(getChatMessagesSchema),
    aiChatController.getMessages
);

router.post(
    "/sessions/:sessionId/messages",
    optionalAuth,
    validate(sendChatMessageSchema),
    aiChatController.sendMessage
);

export default router;
