import { z } from "zod";

export const paginationQuerySchema = z.object({
    query: z.object({
        page: z
            .string()
            .optional()
            .transform((val) => Math.max(Number(val) || 1, 1)),
        limit: z
            .string()
            .optional()
            .transform((val) => Math.max(Number(val) || 10, 1)),
        search: z.string().optional(),
    }),
});
