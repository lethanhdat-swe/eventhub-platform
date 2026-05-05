import { Request, Response, NextFunction } from "express";
import orderService from "../services/order.service";

class OrderController {
    create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            // userId comes from isAuth middleware
            const result = await orderService.create(req.user!.id, req.body);

            return res.success({
                message: "Order created successfully. Seats are reserved.",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };

    list = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await orderService.list(req.query as any);

            return res.success({
                message: "Orders fetched successfully.",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };

    getDetail = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await orderService.getDetail(
                req.params.id as string
            );

            return res.success({
                message: "Order fetched successfully.",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };

    delete = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await orderService.delete(req.body.ids);

            return res.success({
                message: "Orders deleted successfully.",
            });
        } catch (error) {
            next(error);
        }
    };
}

export default new OrderController();
