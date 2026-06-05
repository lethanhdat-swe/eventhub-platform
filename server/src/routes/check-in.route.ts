import { Router } from "express";
import checkInController from "../controllers/check-in.controller";
import { isAuth, restrictTo } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import {
    listCheckInHistorySchema,
    scanCheckInSchema,
} from "../schema/check-in.schema";

const router = Router();

router.use(isAuth, restrictTo("ADMIN"));

router.post("/scan", validate(scanCheckInSchema), checkInController.scan);

router.get(
    "/history",
    validate(listCheckInHistorySchema),
    checkInController.history
);

export default router;
