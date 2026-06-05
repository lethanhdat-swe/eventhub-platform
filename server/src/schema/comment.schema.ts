import { z } from "zod";

const parentIdSchema = z
    .union([
        z.string().uuid("Invalid Parent Comment ID"),
        z.literal(""),
        z.null(),
        z.undefined(),
    ])
    .transform((value) => {
        if (!value) return null;
        return value;
    });

const ratingSchema = z
    .union([z.number(), z.string(), z.literal(""), z.null(), z.undefined()])
    .transform((value) => {
        if (value === "" || value === null || value === undefined) {
            return null;
        }

        return Number(value);
    })
    .refine((value) => value === null || Number.isInteger(value), {
        message: "Rating must be an integer",
    })
    .refine((value) => value === null || (value >= 1 && value <= 5), {
        message: "Rating must be between 1 and 5",
    });

const imageUrlsSchema = z
    .array(z.string().min(1, "Image URL is required"))
    .max(5, "Maximum 5 images are allowed")
    .optional()
    .default([]);

export const createCommentSchema = z.object({
    params: z.object({
        eventId: z.string().uuid("Invalid Event ID"),
    }),
    body: z.object({
        content: z.string().min(1, "Content is required"),
        parentId: parentIdSchema,
        rating: ratingSchema,
        imageUrls: imageUrlsSchema,
    }),
});

export const listCommentSchema = z.object({
    params: z.object({
        eventId: z.string().uuid("Invalid Event ID"),
    }),
    query: z.object({
        page: z
            .string()
            .optional()
            .transform((value) => Number(value) || 1),
        limit: z
            .string()
            .optional()
            .transform((value) => Number(value) || 10),
    }),
});

export const updateCommentSchema = z.object({
    params: z.object({
        commentId: z.string().uuid("Invalid Comment ID"),
    }),
    body: z.object({
        content: z.string().min(1, "Content is required").optional(),
        rating: ratingSchema.optional(),
        imageUrls: imageUrlsSchema,
    }),
});

export const deleteCommentSchema = z.object({
    params: z.object({
        commentId: z.string().uuid("Invalid Comment ID"),
    }),
});
