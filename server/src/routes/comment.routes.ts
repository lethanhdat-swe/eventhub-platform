import { Router } from "express";
import { isAuth } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import commentController from "../controllers/comment.controller";
import {
    createCommentSchema,
    listCommentSchema,
    updateCommentSchema,
    deleteCommentSchema,
} from "../schema/comment.schema";

const router = Router();

router.get(
    "/event/:eventId",
    validate(listCommentSchema),
    commentController.list
);

router.post(
    "/event/:eventId",
    isAuth,
    validate(createCommentSchema),
    commentController.create
);

router.patch(
    "/:commentId",
    isAuth,
    validate(updateCommentSchema),
    commentController.update
);

router.delete(
    "/:commentId",
    isAuth,
    validate(deleteCommentSchema),
    commentController.delete
);

export default router;
