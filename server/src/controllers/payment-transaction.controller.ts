import { Request, Response, NextFunction } from "express";
import paymentTransactionService from "../services/payment-transaction.service";

class PaymentTransactionController {
    list = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await paymentTransactionService.list(
                req.query as any
            );

            return res.success({
                message: "Payment transactions fetched successfully.",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };

    getDetail = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await paymentTransactionService.getDetail(
                req.params.id as string
            );

            return res.success({
                message: "Payment transaction fetched successfully.",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };

    manualConfirm = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await paymentTransactionService.manualConfirm(
                req.params.id as string,
                req.body.orderCode
            );

            return res.success({
                message: "Payment transaction confirmed manually.",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };
}

export default new PaymentTransactionController();
