import { Router } from "express";
import { isAuth, isAdmin } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import contactController from "../controllers/contact.controller";
import { createContactSchema, deleteContactSchema } from "../schema/contact.schema";

const router = Router();

// Public: Gửi liên hệ
router.post("/", validate(createContactSchema), contactController.create);

// Admin only: Xem danh sách và Xóa
router.get("/", isAuth, isAdmin, contactController.list);
router.delete("/:id", isAuth, isAdmin, validate(deleteContactSchema), contactController.delete);

export default router;