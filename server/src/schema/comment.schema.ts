
import { z } from "zod";

export const createCommentSchema = z.object({
    params: z.object({
        eventId: z.string().uuid("Invalid Event ID"),
    }),
    body: z.object({
        content: z.string().min(1, "Content is required"),
        parentId: z.string().uuid().optional().nullable(),
    }),
});

export const listCommentSchema = z.object({
    params: z.object({
        eventId: z.string().uuid("Invalid Event ID"),
    }),
    query: z.object({
        page: z.string().optional().transform((val) => Number(val) || 1),
        limit: z.string().optional().transform((val) => Number(val) || 10),
    }),
});

export const updateCommentSchema = z.object({
    params: z.object({
        commentId: z.string().uuid("Invalid Comment ID"),
    }),
    body: z.object({
        content: z.string().min(1, "Content is required"),
    }),
});

export const deleteCommentSchema = z.object({
    params: z.object({
        commentId: z.string().uuid("Invalid Comment ID"),
    }),
});