import { Request, Response, NextFunction } from "express";
import ticketService from "../services/ticket.service";

class TicketController {
    create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await ticketService.create(req.body);

            return res.success({
                message: "Ticket created successfully.",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };

    update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await ticketService.update(
                req.params.id as string,
                req.body
            );

            return res.success({
                message: "Ticket updated successfully.",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };

    list = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await ticketService.list(req.query as any);

            return res.success({
                message: "Tickets fetched successfully.",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };

    getDetail = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await ticketService.getDetail(
                req.params.id as string
            );

            return res.success({
                message: "Ticket fetched successfully.",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };

    delete = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await ticketService.delete(req.params.id as string);

            return res.success({
                message: "Ticket deleted successfully.",
            });
        } catch (error) {
            next(error);
        }
    };

    deleteMany = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await ticketService.deleteMany(req.body.ids);

            return res.success({
                message: "Tickets deleted successfully.",
            });
        } catch (error) {
            next(error);
        }
    };
}

export default new TicketController();
