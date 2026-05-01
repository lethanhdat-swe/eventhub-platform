import { Request, Response, NextFunction } from "express";
import eventService from "../services/event.service";

class EventController {
    create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await eventService.create(req.body);

            return res.success({
                message: "Event created successfully.",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };

    update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await eventService.update(
                req.params.id as string,
                req.body
            );

            return res.success({
                message: "Event updated successfully.",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };

    list = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await eventService.list(req.query as any);

            return res.success({
                message: "Events fetched successfully.",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };

    getDetail = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await eventService.getDetail(
                req.params.id as string
            );

            return res.success({
                message: "Event fetched successfully.",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };

    delete = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { ids } = req.body;
            await eventService.delete(ids);

            return res.success({
                message: "Events deleted successfully.",
            });
        } catch (error) {
            next(error);
        }
    };
}

export default new EventController();
