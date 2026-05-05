import { Router } from "express";
import { isAuth, restrictTo } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import eventController from "../controllers/event.controller";
import {
    listEventSchema,
    getEventSchema,
    createEventSchema,
    updateEventSchema,
    deleteEventSchema,
} from "../schema/event.schema";
import {
    listEventSeatSchema,
    updateBulkEventSeatSchema,
} from "../schema/event-seat.schema";

const router = Router();

// Public routes
router.get("/", validate(listEventSchema), eventController.list);
router.get("/:id", validate(getEventSchema), eventController.getDetail);

// Admin routes
router.use(isAuth, restrictTo("admin"));

router.post("/", validate(createEventSchema), eventController.create);
router.patch("/:id", validate(updateEventSchema), eventController.update);
router.delete("/", validate(deleteEventSchema), eventController.delete);

// EventSeats management
router.get(
    "/:id/seats",
    validate(listEventSeatSchema),
    eventController.getEventSeats
);
router.patch(
    "/:id/seats",
    validate(updateBulkEventSeatSchema),
    eventController.updateEventSeats
);

export default router;
