import { Request, Response, NextFunction } from "express";
import commentService from "../services/comment.service";
import { AppError } from "../utils/AppError";

class CommentController {
    create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.user) throw new AppError("User not authenticated", 401);

            const result = await commentService.create(
                req.user.id,
                req.params.eventId as string,
                req.body
            );
            return res.success({ message: "Comment posted successfully", data: result });
        } catch (error) {
            next(error);
        }
    };

    list = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { page, limit } = req.query as any;
            const result = await commentService.listByEvent(req.params.eventId as string, Number(page) || 1, Number(limit) || 10);
            return res.success({
                message: "Comments fetched successfully",
                data: result.items,
                meta: result.meta
            });
        } catch (error) {
            next(error);
        }
    };

    update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.user) throw new AppError("User not authenticated", 401);

            const { commentId } = req.params;
            const { content } = req.body;
            const userId = req.user.id;

            const result = await commentService.update(userId, commentId as string, content);

            return res.success({
                message: "Comment updated successfully",
                data: result
            });
        } catch (error) {
            next(error);
        }
    };

    delete = async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.user) throw new AppError("User not authenticated", 401);

            const { commentId } = req.params;
            const userId = req.user.id;

            await commentService.delete(userId, commentId as string);

            return res.success({
                message: "Comment deleted successfully"
            });
        } catch (error) {
            next(error);
        }
    };
}

export default new CommentController();