import { Router } from "express";
import { isAuth, optionalAuth } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import likeEventController from "../controllers/like-event.controller";
import {
    getLikeEventSchema,
    listLikedEventsSchema,
    toggleLikeEventSchema,
} from "../schema/like-event.schema";

const router = Router();

router.get(
    "/:eventId",
    optionalAuth,
    validate(getLikeEventSchema),
    likeEventController.getLikeInfo
);
router.get(
    "/",
    isAuth,
    validate(listLikedEventsSchema),
    likeEventController.listLiked
);

router.post(
    "/:eventId/toggle",
    optionalAuth,
    validate(toggleLikeEventSchema),
    likeEventController.toggleLike
);

export default router;
