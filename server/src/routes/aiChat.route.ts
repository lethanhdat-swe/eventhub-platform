import { Router } from "express";
import {
    createChatSessionSchema,
    getChatMessagesSchema,
    sendChatMessageSchema,
} from "../schema/aiChat.schema";
import { optionalAuth } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import aiChatController from "../controllers/aiChat.controller";

const router = Router();


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