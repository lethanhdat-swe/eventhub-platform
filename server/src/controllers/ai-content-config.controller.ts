import { NextFunction, Request, Response } from "express";
import aiContentConfigService from "../services/ai-content-config.service";

class AIContentConfigController {
    getActive = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await aiContentConfigService.getActiveConfig();

            return res.success({
                message: "AI content config fetched successfully.",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };

    update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await aiContentConfigService.update(
                req.params.id as string,
                req.body
            );

            return res.success({
                message: "AI content config updated successfully.",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };
}

export default new AIContentConfigController();
