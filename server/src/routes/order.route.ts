import { Router } from "express";
import { isAuth, restrictTo } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import orderController from "../controllers/order.controller";
import {
    createOrderSchema,
    listOrderSchema,
    deleteOrderSchema,
    getOrderSchema,
} from "../schema/order.schema";

const router = Router();

// Toàn bộ route order yêu cầu đăng nhập
router.use(isAuth);

// User có thể tạo order
router.post("/", validate(createOrderSchema), orderController.create);

// Get detail - Owner hoặc Admin (Controller có thể check thêm nếu cần, 
// nhưng thường admin mới xem được danh sách orders)
router.get("/:id", validate(getOrderSchema), orderController.getDetail);

// Admin routes
router.get("/", restrictTo("ADMIN"), validate(listOrderSchema), orderController.list);
router.delete("/", restrictTo("ADMIN"), validate(deleteOrderSchema), orderController.delete);

export default router;
