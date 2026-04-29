import { Router } from "express";
import healthRouter from "./health.route";
import authRouter from "./auth.route";
import userRouter from "./user.route";

const router = Router();

router.use("/health", healthRouter);
router.use("/auth", authRouter);
router.use("/users", userRouter);

export default router;
