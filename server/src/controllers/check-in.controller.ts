import { NextFunction, Request, Response } from "express";
import checkInService from "../services/check-in.service";

class CheckInController {
    scan = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await checkInService.scan(req.body);

            return res.success({
                message: "Check-in completed successfully.",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };

    history = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await checkInService.history(req.query as any);

            return res.success({
                message: "Check-in history fetched successfully.",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };
}

export default new CheckInController();
