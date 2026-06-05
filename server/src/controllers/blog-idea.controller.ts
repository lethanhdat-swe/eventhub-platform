import { NextFunction, Request, Response } from "express";
import aiBlogIdeaService from "../services/ai-blog-idea.service";

class BlogIdeaController {
    generateIdeas = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { quantity } = req.body;

            const result = await aiBlogIdeaService.generateIdeas(quantity);

            return res.success({
                message: "Blog ideas generated successfully.",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };

    list = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await aiBlogIdeaService.list(req.query as any);

            return res.success({
                message: "Blog ideas fetched successfully.",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };
}

export default new BlogIdeaController();
