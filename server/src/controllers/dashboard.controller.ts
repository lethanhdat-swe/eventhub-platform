import { Request, Response, NextFunction } from "express";
import dashboardService from "../services/dashboard.service";

class DashboardController {
    summary = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { from, to } = req.query as { from?: string; to?: string };
            const result = await dashboardService.getSummary({ from, to });

            return res.success({
                message: "Dashboard summary retrieved successfully.",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };
}

export default new DashboardController();
