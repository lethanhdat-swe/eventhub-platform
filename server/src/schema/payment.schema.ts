import { z } from "zod";

export const sepayWebhookSchema = z.object({
    body: z.object({
        orderCode: z.string().min(1, "orderCode is required"),
        transactionId: z.string().min(1, "transactionId is required"),
    }),
});
