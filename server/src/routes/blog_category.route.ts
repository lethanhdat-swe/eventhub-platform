import { Router } from "express";
import blogCategoryController from "../controllers/blog-category.controller";
import { validate } from "../middlewares/validate.middleware";
import {
    createBlogCategorySchema,
    deleteBlogCategoriesSchema,
    getBlogCategorySchema,
    listBlogCategorySchema,
    updateBlogCategorySchema,
} from "../schema/blog-category.schema";
import { isAuth, restrictTo } from "../middlewares/auth.middleware";

const router = Router();

router.get(
    "/",
    validate(listBlogCategorySchema),
    blogCategoryController.getAll
);

router.get(
    "/:id",
    validate(getBlogCategorySchema),
    blogCategoryController.getOne
);

// Admin only routes
router.use(isAuth, restrictTo("ADMIN"));

router.post(
    "/",
    validate(createBlogCategorySchema),
    blogCategoryController.create
);

router.patch(
    "/:id",
    validate(updateBlogCategorySchema),
    blogCategoryController.update
);

router.delete(
    "/",
    isAuth,
    restrictTo("ADMIN"),
    validate(deleteBlogCategoriesSchema),
    blogCategoryController.delete
);

export default router;
