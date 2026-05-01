import { Router } from "express";
import healthRouter from "./health.route";
import authRouter from "./auth.route";
import userRouter from "./user.route";
import couponRouter from "./coupon.route";
import categoryRouter from "./category.route";
import eventRouter from "./event.route";

const router = Router();

router.use("/health", healthRouter);
router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/coupons", couponRouter);
router.use("/categories", categoryRouter);
router.use("/events", eventRouter);

export default router;
