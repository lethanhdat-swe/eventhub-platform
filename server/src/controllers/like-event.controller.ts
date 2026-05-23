import { Request, Response, NextFunction } from "express";
import likeEventService from "../services/like-event.service";

class LikeEventController {
    getLikeInfo = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { eventId } = req.params;
            const userId = req.user!.id;

            const result = await likeEventService.getLikeInfo(userId, eventId as string);

            return res.success({
                message: "Event like info fetched successfully.",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };

    toggleLike = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { eventId } = req.params;
            const userId = req.user!.id;

            const result = await likeEventService.toggleLike(userId, eventId as string);

            return res.success({
                message: result.isLiked ? "Event liked successfully." : "Event unliked successfully.",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };

    listLiked = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user!.id;
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;

            const result = await likeEventService.getLikedEvents(userId, page, limit);

            return res.success({
                message: "Liked events fetched successfully.",
                data: result.items,
                meta: result.meta,
            });
        } catch (error) {
            next(error);
        }
    };
}

export default new LikeEventController();