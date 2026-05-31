import { NextFunction, Request, Response } from "express";
import searchService from "../services/search.service";

class SearchController {
    search = async (req: Request, res: Response, next: NextFunction) => {
        const { q } = req.query as { q: string };

        const events = await searchService.search(q);

        return res.success({
            message: "Search results fetched successfully.",
            data: events,
        });
    };
}

export default new SearchController();
