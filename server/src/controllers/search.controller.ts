import { Request, Response, NextFunction } from "express";
import searchService from "../services/search.service";

class SearchController {
    search = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { q, eventLimit, artistLimit } = req.query as any;

            const result = await searchService.search(q, {
                eventLimit,
                artistLimit,
            });

            return res.success({
                message: "Search results fetched successfully.",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };
}

export default new SearchController();
