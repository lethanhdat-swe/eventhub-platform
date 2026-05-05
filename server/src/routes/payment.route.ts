import { Router } from "express";
import { isAuth } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import paymentController from "../controllers/payment.controller";
import {
    createPaymentSchema,
    sepayCallbackSchema,
} from "../schema/payment.schema";

const router = Router();

// User tạo payment (lấy thông tin SEPAY)
router.post(
    "/create",
    isAuth,
    validate(createPaymentSchema),
    paymentController.create
);

// Callback từ SEPAY (không cần auth)
router.post(
    "/sepay-callback",
    validate(sepayCallbackSchema),
    paymentController.handleCallback
);

export default router;
