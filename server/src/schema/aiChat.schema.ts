import { z } from "zod";

export const createChatSessionSchema = z.object({
    body: z
        .object({
            guestId: z.string().trim().min(1).optional(),
        })
        .optional(),
});

export const getChatMessagesSchema = z.object({
    params: z.object({
        sessionId: z.string().uuid("Invalid chat session ID"),
    }),
    query: z.object({
        page: z.coerce.number().int().min(1).default(1),
        limit: z.coerce.number().int().min(1).max(100).default(20),
    }),
});

export const sendChatMessageSchema = z.object({
    params: z.object({
        sessionId: z.string().uuid("Invalid chat session ID"),
    }),
    body: z.object({
        message: z
            .string()
            .trim()
            .min(1, "Message is required")
            .max(2000, "Message is too long"),
    }),
});

export type CreateChatSessionInput = z.infer<typeof createChatSessionSchema>;
export type GetChatMessagesInput = z.infer<typeof getChatMessagesSchema>;
export type SendChatMessageInput = z.infer<typeof sendChatMessageSchema>;