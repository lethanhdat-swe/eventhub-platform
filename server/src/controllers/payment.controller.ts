import { Request, Response, NextFunction } from "express";
import PaymentService from "../services/payment.service";

class PaymentController {
    constructor(private paymentService: PaymentService) {}

    create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await this.paymentService.create(req.body);

            return res.success({
                message: "Payment information retrieved successfully.",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };

    handleCallback = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            await this.paymentService.handleCallback(req.body);

            return res.success({
                message: "Callback processed successfully.",
            });
        } catch (error) {
            next(error);
        }
    };
}

export default new PaymentController(new PaymentService());
