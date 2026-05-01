import { z } from "zod";
import { CouponStatus } from "@prisma/client";

// Dùng chung cho các route cần validate UUID ở params
const paramsIdSchema = z.object({
    id: z.string().uuid("Invalid coupon ID format"),
});

export const createCouponSchema = z.object({
    body: z.object({
        code: z
            .string()
            .min(3, "Code must be at least 3 characters")
            .max(20, "Code must be at most 20 characters")
            .transform((val) => val.toUpperCase()),
        description: z.string().optional(),
        discountPercent: z
            .number()
            .min(1, "Discount must be at least 1%")
            .max(100, "Discount cannot exceed 100%"),
        validUntil: z
            .string()
            .datetime("Invalid date format (ISO 8601 required)")
            .optional(),
        usageLimit: z
            .number()
            .int()
            .positive("Usage limit must be a positive integer")
            .optional(),
        status: z.nativeEnum(CouponStatus).optional().default(CouponStatus.ACTIVE),
    }),
});

export const updateCouponSchema = z.object({
    params: paramsIdSchema,
    body: z
        .object({
            code: z.string().min(3).max(20).transform((val) => val.toUpperCase()).optional(),
            description: z.string().optional(),
            discountPercent: z.number().min(1).max(100).optional(),
            validUntil: z.string().datetime().optional(),
            usageLimit: z.number().int().positive().optional(),
            status: z.nativeEnum(CouponStatus).optional(),
        })
        .partial(), // Cho phép cập nhật từng trường lẻ
});

export const getCouponSchema = z.object({
    params: paramsIdSchema,
});

export const verifyCouponSchema = z.object({
    body: z.object({
        code: z.string().min(1, "Coupon code is required"),
        orderAmount: z.number().positive("Order amount must be greater than 0"),
    }),
});

export const listCouponSchema = z.object({
    query: z.object({
        page: z
            .string()
            .optional()
            .default("1")
            .transform((val) => Math.max(1, parseInt(val))),
        limit: z
            .string()
            .optional()
            .default("10")
            .transform((val) => Math.max(1, parseInt(val))),
        search: z.string().optional(),
    }),
});
