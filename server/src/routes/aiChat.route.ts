import { Router } from "express";
import {
    createChatSessionSchema,
    getChatMessagesSchema,
    listChatSessionsSchema,
    sendChatMessageSchema,
} from "../schema/aiChat.schema";
import { isAuth, optionalAuth, restrictTo } from "../middlewares/auth.middleware";
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

router.get(
    "/sessions/me/latest",
    isAuth,
    aiChatController.getLatestMySession
);

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