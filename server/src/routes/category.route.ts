import { Router } from "express";
import { isAuth, restrictTo } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import categoryController from "../controllers/category.controller";
import {
    listCategorySchema,
    getCategorySchema,
    createCategorySchema,
    updateCategorySchema,
    deleteCategorySchema,
} from "../schema/category.schema";

const router = Router();

// Public routes
router.get("/", validate(listCategorySchema), categoryController.list);
router.get("/:id", validate(getCategorySchema), categoryController.getDetail);

// Admin routes
router.use(isAuth, restrictTo("admin"));

router.post("/", validate(createCategorySchema), categoryController.create);
router.patch("/:id", validate(updateCategorySchema), categoryController.update);
router.delete("/", validate(deleteCategorySchema), categoryController.delete);

export default router;
