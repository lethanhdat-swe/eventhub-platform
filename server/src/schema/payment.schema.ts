import { z } from "zod";

export const createPaymentSchema = z.object({
    body: z.object({
        orderCode: z.string().min(1),
    }),
});

export const sepayCallbackSchema = z.object({
    body: z.object({
        orderCode: z.string(),
        status: z.enum(["SUCCESS", "FAILED"]),
        transactionId: z.string().optional(),
    }),
});
