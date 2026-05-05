import { Router } from "express";
import { isAuth, restrictTo } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import ticketTypeController from "../controllers/ticket-type.controller";
import {
    listTicketTypeSchema,
    getTicketTypeSchema,
    createTicketTypeSchema,
    updateTicketTypeSchema,
    deleteTicketTypeSchema,
} from "../schema/ticket-type.schema";

const router = Router();

// Toàn bộ route ticket type yêu cầu admin quản lý
router.use(isAuth, restrictTo("admin"));

router.get("/", validate(listTicketTypeSchema), ticketTypeController.list);
router.get("/:id", validate(getTicketTypeSchema), ticketTypeController.getDetail);
router.post("/", validate(createTicketTypeSchema), ticketTypeController.create);
router.patch("/:id", validate(updateTicketTypeSchema), ticketTypeController.update);
router.delete("/", validate(deleteTicketTypeSchema), ticketTypeController.delete);

export default router;
