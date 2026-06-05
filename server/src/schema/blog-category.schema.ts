import { z } from "zod";
import { listSortQueryFields } from "../utils/listSort";

export const createBlogCategorySchema = z.object({
    body: z.object({
        name: z.string().min(1, "Name is required"),
        slug: z.string().min(1, "Slug is required"),
    }),
});

export const updateBlogCategorySchema = z.object({
    params: z.object({
        id: z.string().uuid("Invalid ID format"),
    }),
    body: z.object({
        name: z.string().optional(),
        slug: z.string().optional(),
    }),
});

export const getBlogCategorySchema = z.object({
    params: z.object({
        id: z.string().uuid("Invalid ID format"),
    }),
});

export const listBlogCategorySchema = z.object({
    query: z.object({
        page: z
            .string()
            .optional()
            .transform((val) => Number(val) || 1),
        limit: z
            .string()
            .optional()
            .transform((val) => Number(val) || 10),
        search: z.string().optional(),
        ...listSortQueryFields(["name", "slug", "createdAt"] as const),
    }),
});

export const deleteBlogCategoriesSchema = z.object({
    body: z.object({
        ids: z
            .array(z.string().uuid("Invalid ID format"))
            .min(1, "At least one ID is required"),
    }),
});
