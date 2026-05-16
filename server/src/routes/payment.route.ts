import { Router } from "express";
import { validate } from "../middlewares/validate.middleware";
import paymentController from "../controllers/payment.controller";
import { sepayWebhookSchema } from "../schema/payment.schema";

const router = Router();

router.post(
    "/sepay/webhook",
    validate(sepayWebhookSchema),
    paymentController.sepayWebhook
);

export default router;
