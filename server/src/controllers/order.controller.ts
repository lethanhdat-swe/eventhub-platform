import { Request, Response, NextFunction } from "express";
import orderService from "../services/order.service";

class OrderController {
    create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.id || null;
            const result = await orderService.create(userId, req.body);

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

    myOrders = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await orderService.myOrders(
                req.user!.id,
                req.query as any
            );

            return res.success({
                message: "My orders fetched successfully.",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };

    myOrderDetail = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await orderService.myOrderDetail(
                req.user!.id,
                req.params.id as string
            );

            return res.success({
                message: "My order fetched successfully.",
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

    exportMyOrderTicketPdf = async (req: any, res: any) => {
        const { id } = req.params;
        const userId = req.user.id;

        const { buffer, fileName } = await orderService.exportMyOrderTicketPdf(
            userId,
            id
        );

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
            "Content-Disposition",
            `attachment; filename="${fileName}"`
        );
        res.setHeader("Content-Length", buffer.length);

        return res.send(buffer);
    };
}

export default new OrderController();
