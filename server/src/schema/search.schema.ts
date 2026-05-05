import { z } from "zod";

export const searchSchema = z.object({
    query: z.object({
        q: z.string().min(1, "Search query is required"),

        eventLimit: z
            .string()
            .optional()
            .default("5")
            .transform((val) => Math.max(1, parseInt(val))),

        artistLimit: z
            .string()
            .optional()
            .default("5")
            .transform((val) => Math.max(1, parseInt(val))),
    }),
});
