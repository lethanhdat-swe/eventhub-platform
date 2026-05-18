import { z } from "zod";

export const sepayWebhookSchema = z.object({
    body: z.object({
        orderCode: z.string().min(1, "orderCode is required"),

        transactionId: z.string().min(1, "transactionId is required"),

        amount: z.coerce.number().positive("amount must be greater than 0"),
    }),
});

export const paymentFailedSchema = z.object({
    body: z.object({
        orderCode: z.string().min(1, "orderCode is required"),
    }),
});

export type SepayWebhookInput = z.infer<typeof sepayWebhookSchema>["body"];
