import { Router } from "express";
import { isAuth, restrictTo } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import eventController from "../controllers/event.controller";
import eventArtistController from "../controllers/event-artist.controller"; // Import mới
import {
    listEventSchema,
    getEventSchema,
    createEventSchema,
    updateEventSchema,
    getEventBySlugSchema,
    deleteEventSchema,
} from "../schema/event.schema";
import {
    addEventSeatSchema,
    addSeatRowSchema,
    deleteEventSeatSchema,
    listEventSeatSchema,
    updateEventSeatSchema,
} from "../schema/event-seat.schema";
import { deleteBulkEventArtistSchema } from "../schema/event-artist.schema"; // Schema mới

const router = Router();

// Public routes
router.get("/", validate(listEventSchema), eventController.list);
router.get("/trending", eventController.getTrendingEvents);
router.get(
    "/:id/related",
    validate(getEventSchema),
    eventController.getRelatedEvents
);
router.get("/:id", validate(getEventSchema), eventController.getDetail);
router.get(
    "/:id/seats",
    validate(listEventSeatSchema),
    eventController.getEventSeats
);
router.get(
    "/slug/:slug",
    validate(getEventBySlugSchema),
    eventController.getDetailBySlug
);

// Admin routes
router.use(isAuth, restrictTo("ADMIN"));

router.post("/", validate(createEventSchema), eventController.create);
router.patch("/:id", validate(updateEventSchema), eventController.update);
router.delete("/", validate(deleteEventSchema), eventController.delete);

router.delete(
    "/:eventId/artists",
    isAuth,
    restrictTo("ADMIN"),
    validate(deleteBulkEventArtistSchema),
    eventArtistController.removeArtists
);

// EventSeats management
router.post(
    "/:id/seats/rows",
    validate(addSeatRowSchema),
    eventController.addSeatRow
);

router.post(
    "/:id/seats",
    validate(addEventSeatSchema),
    eventController.addEventSeat
);

router.delete(
    "/:id/seats",
    validate(deleteEventSeatSchema),
    eventController.deleteEventSeats
);
router.patch(
    "/:id/seats/:seatId",
    validate(updateEventSeatSchema),
    eventController.updateEventSeat
);

export default router;
