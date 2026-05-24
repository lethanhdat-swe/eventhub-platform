import { Router } from "express";
import { isAuth, restrictTo } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import ticketController from "../controllers/ticket.controller";
import {
    listTicketSchema,
    getTicketSchema,
    createTicketSchema,
    updateTicketSchema,
    deleteBulkTicketSchema,
} from "../schema/ticket.schema";
import { checkInTicketSchema } from "../schema/ticket-type.schema";

const router = Router();

router.get("/my", isAuth, ticketController.myTickets);

// Toàn bộ route ticket yêu cầu admin quản lý
router.use(isAuth, restrictTo("ADMIN"));

router.get("/", validate(listTicketSchema), ticketController.list);
router.get("/:id", validate(getTicketSchema), ticketController.getDetail);
router.post("/", validate(createTicketSchema), ticketController.create);
router.post(
    "/check-in",
    validate(checkInTicketSchema),
    ticketController.checkIn
);
router.patch("/:id", validate(updateTicketSchema), ticketController.update);
router.delete(
    "/",
    validate(deleteBulkTicketSchema),
    ticketController.deleteMany
);
router.delete("/:id", ticketController.delete);

export default router;
