import { z } from "zod";

export const generateBlogIdeasSchema = z.object({
    body: z.object({
        quantity: z.coerce.number().min(1).max(50),
    }),
});

export const listBlogIdeasSchema = z.object({
    query: z.object({
        page: z.coerce.number().min(1).default(1),
        limit: z.coerce.number().min(1).max(100).default(10),

        search: z.string().optional(),

        status: z.enum(["PENDING", "USED", "FAILED"]).optional(),
    }),
});
