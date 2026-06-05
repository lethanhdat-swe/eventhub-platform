import { Router } from "express";
import aiContentConfigController from "../controllers/ai-content-config.controller";
import { isAuth, restrictTo } from "../middlewares/auth.middleware";
import { updateAIChatConfigSchema, updateAIContentConfigSchema } from "../schema/update-ai-content-config.schema";
import { validate } from "../middlewares/validate.middleware";

const router = Router();

router.get(
    "/",
    isAuth,
    restrictTo("ADMIN"),
    aiContentConfigController.getActive
);

router.patch(
    "/:id",
    isAuth,
    restrictTo("ADMIN"),
    validate(updateAIContentConfigSchema),
    aiContentConfigController.update
);

router.get(
    "/chat",
    isAuth,
    restrictTo("ADMIN"),
    aiContentConfigController.getActiveChatConfig
);

router.patch(
    "/chat/:id",
    isAuth,
    restrictTo("ADMIN"),
    validate(updateAIChatConfigSchema),
    aiContentConfigController.updateChatConfig
);

export default router;