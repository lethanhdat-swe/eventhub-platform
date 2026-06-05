import { z } from "zod";
import { listSortQueryFields } from "../utils/listSort";

export const listPaymentTransactionSchema = z.object({
    query: z.object({
        page: z.coerce.number().int().positive().default(1),
        limit: z.coerce.number().int().positive().max(100).default(10),
        status: z.string().optional(),
        search: z.string().optional(),
        ...listSortQueryFields([
            "transactionId",
            "orderCode",
            "amount",
            "gateway",
            "status",
            "createdAt",
        ] as const),
    }),
});

export const getPaymentTransactionSchema = z.object({
    params: z.object({
        id: z.string().min(1),
    }),
});

export const manualConfirmPaymentTransactionSchema = z.object({
    params: z.object({
        id: z.string().min(1),
    }),
    body: z.object({
        orderCode: z.string().min(1),
    }),
});
