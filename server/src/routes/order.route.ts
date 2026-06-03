import { Router } from "express";
import {
    isAuth,
    optionalAuth,
    restrictTo,
} from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import orderController from "../controllers/order.controller";
import {
    createOrderSchema,
    listOrderSchema,
    listMyOrderSchema,
    deleteOrderSchema,
    getOrderSchema,
    exportMyOrderTicketPdfSchema,
    lookupOrderByCodeSchema,
} from "../schema/order.schema";

const router = Router();

// User có thể tạo order
router.post(
    "/",
    optionalAuth,
    validate(createOrderSchema),
    orderController.create
);

router.get(
    "/my/:id/ticket-pdf",
    validate(exportMyOrderTicketPdfSchema),
    isAuth,
    orderController.exportMyOrderTicketPdf
);

router.get(
    "/my",
    isAuth,
    validate(listMyOrderSchema),
    orderController.myOrders
);

router.get(
    "/my/:id",
    isAuth,
    validate(getOrderSchema),
    orderController.myOrderDetail
);

router.get(
    "/by-code/:orderCode",
    validate(lookupOrderByCodeSchema),
    orderController.lookupByOrderCode
);

router.get(
    "/:id",
    optionalAuth,
    validate(getOrderSchema),
    orderController.getDetail
);

// Admin routes
router.use(isAuth, restrictTo("ADMIN"));

router.get("/", validate(listOrderSchema), orderController.list);
router.delete("/", validate(deleteOrderSchema), orderController.delete);

export default router;
