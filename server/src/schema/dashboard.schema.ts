import { z } from "zod";

const dateStringSchema = z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format");

export const dashboardSummarySchema = z.object({
    query: z.object({
        from: dateStringSchema.optional(),
        to: dateStringSchema.optional(),
    }),
});
