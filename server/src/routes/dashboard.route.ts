import { Router } from "express";
import { isAuth, restrictTo } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import dashboardController from "../controllers/dashboard.controller";
import { dashboardSummarySchema } from "../schema/dashboard.schema";

const router = Router();

router.use(isAuth, restrictTo("ADMIN"));

router.get(
    "/summary",
    validate(dashboardSummarySchema),
    dashboardController.summary
);

export default router;
