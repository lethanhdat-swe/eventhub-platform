import { Request, Response, NextFunction } from "express";
import PaymentService from "../services/payment.service";

class PaymentController {
    sepayWebhook = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { orderCode, transactionId } = req.body;
            const data = await PaymentService.handlePaymentSuccess(
                orderCode,
                transactionId
            );

            return res.success({
                message: "Payment processed successfully.",
                data,
            });
        } catch (error) {
            next(error);
        }
    };
}

export default new PaymentController();
