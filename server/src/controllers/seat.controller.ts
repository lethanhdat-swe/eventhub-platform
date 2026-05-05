import { Request, Response, NextFunction } from "express";
import seatService from "../services/seat.service";

class SeatController {
    create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await seatService.create(req.body);

            return res.success({
                message: "Seat created successfully.",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };

    update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await seatService.update(
                req.params.id as string,
                req.body
            );

            return res.success({
                message: "Seat updated successfully.",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };

    list = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await seatService.list(req.query as any);

            return res.success({
                message: "Seats fetched successfully.",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };

    getDetail = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await seatService.getDetail(
                req.params.id as string
            );

            return res.success({
                message: "Seat fetched successfully.",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };

    delete = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await seatService.delete(req.body.ids);

            return res.success({
                message: "Seats deleted successfully.",
            });
        } catch (error) {
            next(error);
        }
    };
}

export default new SeatController();
