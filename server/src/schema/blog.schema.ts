import { z } from "zod";

export const listBlogSchema = z.object({
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
    }),
});

export const getBlogSchema = z.object({
    params: z.object({
        id: z.string().uuid("Invalid ID format"),
    }),
});

export const createBlogSchema = z.object({
    body: z.object({
        title: z.string().min(1, "Title is required"),
        slug: z.string().min(1, "Slug is required"),
        excerpt: z.string().optional(),
        contentHtml: z.string().min(1, "Content is required"),
        thumbnailUrl: z
            .string()
            .url("Invalid thumbnail URL")
            .optional()
            .or(z.literal("")),
        status: z.enum(["draft", "published"]).optional(),
        categoryId: z.string().uuid("Invalid category ID format").optional(),
    }),
});

export const updateBlogSchema = z.object({
    params: z.object({
        id: z.string().uuid("Invalid ID format"),
    }),
    body: z.object({
        title: z.string().optional(),
        slug: z.string().optional(),
        excerpt: z.string().optional(),
        contentHtml: z.string().optional(),
        thumbnailUrl: z
            .string()
            .url("Invalid thumbnail URL")
            .optional()
            .or(z.literal("")),
        status: z.enum(["draft", "published"]).optional(),
        categoryId: z
            .string()
            .uuid("Invalid category ID format")
            .optional()
            .nullable(),
    }),
});

export const deleteBlogSchema = z.object({
    body: z.object({
        ids: z
            .array(z.string().uuid("Invalid ID format"))
            .min(1, "At least one ID is required"),
    }),
});
