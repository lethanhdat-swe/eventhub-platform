import { Router } from "express";

import refundController from "../controllers/refund.controller";
import { validate } from "../middlewares/validate.middleware";
import { isAuth, restrictTo } from "../middlewares/auth.middleware";
import {
    adminRefundRequestQuerySchema,
    createRefundRequestSchema,
    refundRequestIdParamSchema,
} from "../schema/refund.schema";

const router = Router();

router.post(
    "/",
    validate(createRefundRequestSchema),
    refundController.createRefundRequest
);

router.get(
    "/admin",
    isAuth,
    restrictTo("ADMIN"),
    validate(adminRefundRequestQuerySchema),
    refundController.getRefundRequestsForAdmin
);

router.patch(
    "/admin/:id/complete",
    isAuth,
    restrictTo("ADMIN"),
    validate(refundRequestIdParamSchema),
    refundController.completeRefundRequest
);

router.patch(
    "/admin/:id/reject",
    isAuth,
    restrictTo("ADMIN"),
    validate(refundRequestIdParamSchema),
    refundController.rejectRefundRequest
);

export default router;
