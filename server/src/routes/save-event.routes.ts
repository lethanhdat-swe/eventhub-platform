import { Router } from "express";
import { optionalAuth } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import saveEventController from "../controllers/save-event.controller";
import {
    toggleSaveEventSchema,
    listSavedEventsSchema,
} from "../schema/save-event.schema";

const router = Router();

router.post(
    "/:eventId/toggle",
    optionalAuth,
    validate(toggleSaveEventSchema),
    saveEventController.toggleSave
);

router.get(
    "/",
    optionalAuth,
    validate(listSavedEventsSchema),
    saveEventController.listSaved
);

export default router;
