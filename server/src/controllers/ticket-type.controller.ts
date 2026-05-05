import { Request, Response, NextFunction } from "express";
import ticketTypeService from "../services/ticket-type.service";

class TicketTypeController {
    create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await ticketTypeService.create(req.body);

            return res.success({
                message: "Ticket type created successfully.",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };

    update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await ticketTypeService.update(
                req.params.id as string,
                req.body
            );

            return res.success({
                message: "Ticket type updated successfully.",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };

    list = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await ticketTypeService.list(req.query as any);

            return res.success({
                message: "Ticket types fetched successfully.",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };

    getDetail = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await ticketTypeService.getDetail(
                req.params.id as string
            );

            return res.success({
                message: "Ticket type fetched successfully.",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };

    delete = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await ticketTypeService.delete(req.body.ids);

            return res.success({
                message: "Ticket types deleted successfully.",
            });
        } catch (error) {
            next(error);
        }
    };
}

export default new TicketTypeController();
