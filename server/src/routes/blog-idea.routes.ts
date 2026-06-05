import { Router } from "express";
import blogIdeaController from "../controllers/blog-idea.controller";
import { isAuth, restrictTo } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import {
    generateBlogIdeasSchema,
    listBlogIdeasSchema,
} from "../schema/generate-blog-ideas.schema";

const router = Router();

router.get(
    "/",
    isAuth,
    restrictTo("ADMIN"),
    validate(listBlogIdeasSchema),
    blogIdeaController.list
);

router.post(
    "/generate",
    isAuth,
    restrictTo("ADMIN"),
    validate(generateBlogIdeasSchema),
    blogIdeaController.generateIdeas
);

export default router;
