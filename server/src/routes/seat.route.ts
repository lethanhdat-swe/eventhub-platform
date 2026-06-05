import { Router } from "express";
import { isAuth, restrictTo } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import seatController from "../controllers/seat.controller";
import {
    listSeatSchema,
    getSeatSchema,
    createSeatSchema,
    createSeatRowSchema,
    updateSeatSchema,
    deleteSeatSchema,
} from "../schema/seat.schema";

const router = Router();

// Toàn bộ route seat yêu cầu admin quản lý
router.use(isAuth, restrictTo("ADMIN"));

router.get("/", validate(listSeatSchema), seatController.list);
router.post("/rows", validate(createSeatRowSchema), seatController.createRow);
router.delete("/", validate(deleteSeatSchema), seatController.delete);
router.get("/:id", validate(getSeatSchema), seatController.getDetail);
router.post("/", validate(createSeatSchema), seatController.create);
router.patch("/:id", validate(updateSeatSchema), seatController.update);

export default router;
