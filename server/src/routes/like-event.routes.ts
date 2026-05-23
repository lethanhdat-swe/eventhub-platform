import { Router } from "express";
import { isAuth } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import likeEventController from "../controllers/like-event.controller";
import { getLikeEventSchema, listLikedEventsSchema, toggleLikeEventSchema } from "../schema/like-event.schema";

const router = Router();

router.use(isAuth);

router.get("/:eventId", validate(getLikeEventSchema), likeEventController.getLikeInfo);
router.post("/:eventId/toggle", validate(toggleLikeEventSchema), likeEventController.toggleLike);
router.get("/", validate(listLikedEventsSchema), likeEventController.listLiked);

export default router;