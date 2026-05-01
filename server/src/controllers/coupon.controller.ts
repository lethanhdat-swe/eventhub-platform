import { Request, Response, NextFunction } from "express";
import couponService from "../services/coupon.service";

class CouponController {
    create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await couponService.create(req.body);

            return res.success({
                message: "Coupon created successfully.",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };

    update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await couponService.update(
                req.params.id as string,
                req.body
            );

            return res.success({
                message: "Coupon updated successfully.",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };

    list = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await couponService.list(req.query as any);

            return res.success({
                message: "Coupons fetched successfully.",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };

    getDetail = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await couponService.getDetail(
                req.params.id as string
            );

            return res.success({
                message: "Coupon fetched successfully.",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };

    delete = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await couponService.delete(req.params.id as string);

            return res.success({
                message: "Coupon deleted successfully.",
            });
        } catch (error) {
            next(error);
        }
    };

    verify = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await couponService.verify(req.body);

            return res.success({
                message: "Coupon verified successfully.",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };
}

export default new CouponController();
