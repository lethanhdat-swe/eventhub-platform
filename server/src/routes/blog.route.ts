import { Router } from "express";
import blogController from "../controllers/blog.controller";
import { validate } from "../middlewares/validate.middleware";
import { isAuth, restrictTo } from "../middlewares/auth.middleware";
import {
    createBlogSchema,
    deleteBlogSchema,
    getBlogSchema,
    listBlogSchema,
    updateBlogSchema,
} from "../schema/blog.schema";

const router = Router();

router.get("/", validate(listBlogSchema), blogController.getAll);
router.get("/category/:categoryId", blogController.getByCategoryId);

router.get("/slug/:slug", blogController.getBySlug);
router.get("/:id", validate(getBlogSchema), blogController.getOne);

// Admin only routes
router.use(isAuth, restrictTo("ADMIN"));

router.post("/", validate(createBlogSchema), blogController.create);
router.patch("/:id", validate(updateBlogSchema), blogController.update);
router.delete("/", validate(deleteBlogSchema), blogController.delete);

export default router;
