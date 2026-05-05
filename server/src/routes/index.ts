import { Router } from "express";
import healthRouter from "./health.route";
import authRouter from "./auth.route";
import userRouter from "./user.route";
import couponRouter from "./coupon.route";
import categoryRouter from "./category.route";
import eventRouter from "./event.route";
import ticketRouter from "./ticket.route";
import ticketTypeRouter from "./ticket-type.route";
import seatRouter from "./seat.route";
import orderRouter from "./order.route";
import artistRouter from "./artist.route";
import searchRouter from "./search.route";

const router = Router();

router.use("/health", healthRouter);
router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/coupons", couponRouter);
router.use("/categories", categoryRouter);
router.use("/events", eventRouter);
router.use("/tickets", ticketRouter);
router.use("/ticket-types", ticketTypeRouter);
router.use("/seats", seatRouter);
router.use("/orders", orderRouter);
router.use("/artists", artistRouter);
router.use("/search", searchRouter);

export default router;
