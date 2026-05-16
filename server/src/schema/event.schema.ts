import { z } from "zod";
import { EventStatus } from "@prisma/client";

const paramsIdSchema = z.object({
    id: z.string().uuid("Invalid event ID format"),
});

// 👇 thêm schema cho artist pivot
const artistItemSchema = z.object({
    artistId: z.string().uuid("Invalid artist ID format"),
    role: z.enum(["SINGER", "DJ", "GUEST", "HOST"]).optional(),
});

export const createEventSchema = z.object({
    body: z.object({
        title: z
            .string()
            .min(2, "Title must be at least 2 characters")
            .max(255, "Title must be at most 255 characters"),
        slug: z
            .string()
            .min(2, "Slug must be at least 2 characters")
            .max(255, "Slug must be at most 255 characters"),
        description: z.string().optional(),
        contentHtml: z.string().optional(),
        location: z.string().optional(),
        startDate: z.string().datetime("Invalid start date format").optional(),
        endDate: z.string().datetime("Invalid end date format").optional(),
        thumbnailUrl: z
            .string()
            .url("Invalid thumbnail URL format")
            .optional()
            .or(z.literal("")),
        categoryId: z.string().uuid("Invalid category ID format").optional(),
        status: z.nativeEnum(EventStatus).default(EventStatus.DRAFT),

        // 👇 NEW
        artists: z.array(artistItemSchema).optional(),
    }),
});

export const updateEventSchema = z.object({
    params: paramsIdSchema,
    body: z
        .object({
            title: z.string().min(2).max(255).optional(),
            slug: z.string().min(2).max(255).optional(),
            description: z.string().optional(),
            contentHtml: z.string().optional(),
            location: z.string().optional(),
            startDate: z.string().datetime().optional(),
            endDate: z.string().datetime().optional(),
            thumbnailUrl: z.string().url().optional().or(z.literal("")),
            categoryId: z.string().uuid().optional(),
            status: z.nativeEnum(EventStatus).optional(),

            // 👇 NEW (replace toàn bộ artists khi update)
            artists: z.array(artistItemSchema).optional(),
        })
        .partial(),
});

export const getEventSchema = z.object({
    params: paramsIdSchema,
});

export const deleteEventSchema = z.object({
    body: z.object({
        ids: z
            .array(z.string().uuid("Invalid event ID format"))
            .min(1, "At least one ID is required"),
    }),
});

export const listEventSchema = z.object({
    query: z.object({
        page: z
            .string()
            .optional()
            .default("1")
            .transform((val) => Math.max(1, parseInt(val))),
        limit: z
            .string()
            .optional()
            .default("10")
            .transform((val) => Math.max(1, parseInt(val))),
        search: z.string().optional(),
        status: z.string().optional(),
        categoryId: z.string().uuid().optional(),
    }),
});
