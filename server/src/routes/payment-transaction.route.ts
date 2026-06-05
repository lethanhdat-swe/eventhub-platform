import { Router } from "express";
import { isAuth, restrictTo } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import paymentTransactionController from "../controllers/payment-transaction.controller";
import {
    listPaymentTransactionSchema,
    getPaymentTransactionSchema,
    manualConfirmPaymentTransactionSchema,
} from "../schema/payment-transaction.schema";

const router = Router();

router.use(isAuth, restrictTo("ADMIN"));

router.get(
    "/",
    validate(listPaymentTransactionSchema),
    paymentTransactionController.list
);

router.get(
    "/:id",
    validate(getPaymentTransactionSchema),
    paymentTransactionController.getDetail
);

router.post(
    "/:id/manual-confirm",
    validate(manualConfirmPaymentTransactionSchema),
    paymentTransactionController.manualConfirm
);

export default router;
