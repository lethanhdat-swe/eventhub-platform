import { z } from "zod";
import { listSortQueryFields } from "../utils/listSort";

const paramsIdSchema = z.object({
    id: z.string().uuid("Invalid category ID format"),
});

export const createCategorySchema = z.object({
    body: z.object({
        name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name must be at most 50 characters"),
        slug: z.string().min(2, "Slug must be at least 2 characters").max(50, "Slug must be at most 50 characters"),
    }),
});

export const updateCategorySchema = z.object({
    params: paramsIdSchema,
    body: z.object({
        name: z.string().min(2).max(50).optional(),
        slug: z.string().min(2).max(50).optional(),
    }).partial(),
});

export const getCategorySchema = z.object({
    params: paramsIdSchema,
});

export const deleteCategorySchema = z.object({
    body: z.object({
        ids: z.array(z.string().uuid("Invalid category ID format")).min(1, "At least one ID is required"),
    }),
});

export const listCategorySchema = z.object({
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
        ...listSortQueryFields(["name", "slug", "eventCount"] as const),
    }),
});
