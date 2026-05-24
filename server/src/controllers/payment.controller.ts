import { Request, Response, NextFunction } from "express";
import PaymentService from "../services/payment.service";

class PaymentController {
    sepayWebhook = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await PaymentService.handleSepayWebhook(req.body);

            return res.status(200).json({
                success: true,
                data,
            });
        } catch (error) {
            next(error);
        }
    };

    paymentFailed = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await PaymentService.handlePaymentFailed(
                req.body.orderCode
            );

            return res.success({
                message: "Payment failed and order was cancelled successfully.",
                data,
            });
        } catch (error) {
            next(error);
        }
    };
}

export default new PaymentController();
