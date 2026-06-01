import { Request, Response } from "express";

import refundService from "../services/refund.service";

class RefundController {
    constructor(private readonly service = refundService) {}

    createRefundRequest = async (req: Request, res: Response) => {
        const refundRequest = await this.service.createRefundRequest(req.body);

        return res.success({
            message: "Refund request created successfully",
            data: refundRequest,
            status: 201,
        });
    };

    getRefundRequestsForAdmin = async (req: Request, res: Response) => {
        const result = await this.service.getRefundRequestsForAdmin(
            req.query as any
        );

        return res.success({
            message: "Refund requests fetched successfully",
            data: result,
        });
    };

    completeRefundRequest = async (req: Request, res: Response) => {
        const refundRequest = await this.service.completeRefundRequest(
            req.params.id as string
        );

        return res.success({
            message: "Refund request completed successfully",
            data: refundRequest,
        });
    };

    rejectRefundRequest = async (req: Request, res: Response) => {
        const refundRequest = await this.service.rejectRefundRequest(
            req.params.id as string
        );

        return res.success({
            message: "Refund request rejected successfully",
            data: refundRequest,
        });
    };
}

export default new RefundController();
