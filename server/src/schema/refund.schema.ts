import { RefundRequestStatus } from "@prisma/client";
import { z } from "zod";

const requiredString = (field: string) =>
    z
        .string({
            message: `${field} is required`,
        })
        .trim()
        .min(1, `${field} is required`);

export const createRefundRequestSchema = z.object({
    body: z.object({
        orderCode: requiredString("Order code"),
        customerName: requiredString("Customer name"),
        customerEmail: requiredString("Customer email").email(
            "Invalid customer email"
        ),
        customerPhone: requiredString("Customer phone"),
        bankName: requiredString("Bank name"),
        bankAccountNumber: requiredString("Bank account number"),
        bankAccountHolder: requiredString("Bank account holder"),
        note: z.string().trim().optional(),
    }),
});

export const refundRequestIdParamSchema = z.object({
    params: z.object({
        id: z.string().uuid("Invalid refund request id"),
    }),
});

export const adminRefundRequestQuerySchema = z.object({
    query: z.object({
        page: z.coerce.number().int().positive().default(1),
        limit: z.coerce.number().int().positive().max(100).default(10),
        status: z.nativeEnum(RefundRequestStatus).optional(),
        search: z.string().trim().optional(),
    }),
});

export type CreateRefundRequestInput = z.infer<
    typeof createRefundRequestSchema
>["body"];

export type AdminRefundRequestQuery = z.infer<
    typeof adminRefundRequestQuerySchema
>["query"];
