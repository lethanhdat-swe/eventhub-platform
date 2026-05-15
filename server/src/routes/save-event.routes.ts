import { Router } from "express";
import { isAuth } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import saveEventController from "../controllers/save-event.controller";
import { toggleSaveEventSchema, listSavedEventsSchema } from "../schema/save-event.schema";

const router = Router();


router.use(isAuth);


router.post("/:eventId/toggle", validate(toggleSaveEventSchema), saveEventController.toggleSave);


router.get("/", validate(listSavedEventsSchema), saveEventController.listSaved);

export default router;