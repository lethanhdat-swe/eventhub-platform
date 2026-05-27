import { z } from "zod";

export const updateAIContentConfigSchema = z.object({
    params: z.object({
        id: z.string(),
    }),

    body: z.object({
        ideaModel: z.string().min(1),

        ideaPrompt: z.string().min(1),

        blogModel: z.string().min(1),

        blogPrompt: z.string().min(1),

        isActive: z.boolean(),

        thumbnailModel: z.string().optional(),
    }),
});
