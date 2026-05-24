import { z } from "zod";

export const sepayWebhookSchema = z.object({
    body: z.object({
        id: z.union([z.string(), z.number()]).optional(),
        gateway: z.string().optional(),
        transactionDate: z.string().optional(),
        accountNumber: z.string().optional(),

        content: z.string().min(1, "content is required"),
        transferType: z.string().min(1, "transferType is required"),
        transferAmount: z.coerce
            .number()
            .positive("transferAmount must be greater than 0"),

        referenceCode: z.string().optional(),
    }),
});

export const paymentFailedSchema = z.object({
    body: z.object({
        orderCode: z.string().min(1, "orderCode is required"),
    }),
});

export type SepayWebhookInput = z.infer<typeof sepayWebhookSchema>["body"];
