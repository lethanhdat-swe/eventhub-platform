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
        page: z.coerce.number().int().positive().default(1),
        limit: z.coerce.number().int().positive().max(100).default(20),

        // Guest cần truyền guestId để xem lại session của mình
        guestId: z.string().trim().min(1).optional(),
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

        // Guest cần truyền guestId để gửi message vào session của mình
        guestId: z.string().trim().min(1).optional(),
    }),
});

export const listChatSessionsSchema = z.object({
    query: z.object({
        page: z.coerce.number().int().positive().default(1),
        limit: z.coerce.number().int().positive().max(50).default(20),
        search: z.string().trim().optional(),
    }),
});

export type CreateChatSessionInput = z.infer<typeof createChatSessionSchema>;
export type GetChatMessagesInput = z.infer<typeof getChatMessagesSchema>;
export type SendChatMessageInput = z.infer<typeof sendChatMessageSchema>;
export type ListChatSessionsInput = z.infer<typeof listChatSessionsSchema>;