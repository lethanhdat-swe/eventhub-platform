import { prisma } from "../utils/prisma";
import { AppError } from "../utils/AppError";
import { getPaginationMetadata } from "../utils/pagination";
import { CouponStatus } from "@prisma/client";

class CouponService {
    async create(body: any) {
        return await prisma.coupon.create({
            data: body,
        });
    }

    async update(id: string, body: any) {
        // First check if exists
        await this.getDetail(id);

        return await prisma.coupon.update({
            where: { id },
            data: body,
        });
    }

    async list(query: { search?: string; page: number; limit: number }) {
        const { page = 1, limit = 10, search } = query;
        const skip = (page - 1) * limit;

        const where: any = {};
        if (search) {
            where.OR = [
                { code: { contains: search } },
                { description: { contains: search } },
            ];
        }

        const [coupons, total] = await Promise.all([
            prisma.coupon.findMany({
                where,
                skip,
                take: Number(limit),
                orderBy: { createdAt: "desc" },
            }),
            prisma.coupon.count({ where }),
        ]);

        return {
            data: coupons,
            meta: getPaginationMetadata(total, page, limit),
        };
    }

    async getDetail(id: string) {
        const coupon = await prisma.coupon.findUnique({
            where: { id },
        });

        if (!coupon) {
            throw new AppError("Coupon not found", 404);
        }

        return coupon;
    }

    async delete(id: string) {
        await this.getDetail(id);

        return await prisma.coupon.delete({
            where: { id },
        });
    }

    async verify(body: { code: string; orderAmount: number }) {
        const { code, orderAmount } = body;

        const coupon = await prisma.coupon.findUnique({
            where: { code: code.toUpperCase() },
        });

        if (!coupon) {
            throw new AppError("Coupon code not found.", 404);
        }

        if (coupon.status !== CouponStatus.ACTIVE) {
            throw new AppError("This coupon is currently inactive.", 400);
        }

        if (coupon.validUntil && new Date(coupon.validUntil) < new Date()) {
            throw new AppError("Coupon has expired.", 400);
        }

        if (coupon.usageLimit !== null) {
            const usageCount = await prisma.order.count({
                where: {
                    couponId: coupon.id,
                    status: { notIn: ["cancelled", "failed"] }, // Count only successful or pending orders
                },
            });

            if (usageCount >= coupon.usageLimit) {
                throw new AppError("Coupon has reached its usage limit.", 400);
            }
        }

        const discountAmount = (orderAmount * coupon.discountPercent) / 100;
        const finalAmount = orderAmount - discountAmount;

        return {
            couponId: coupon.id,
            code: coupon.code,
            discountPercent: coupon.discountPercent,
            discountAmount,
            finalAmount,
            isValid: true,
            message: `Coupon applied. You saved $${discountAmount.toFixed(2)}.`,
        };
    }
}

export default new CouponService();
