import { z } from "zod";

const paramsIdSchema = z.object({
    id: z.string().uuid("Invalid ID format"),
});

export const createSiteSettingsSchema = z.object({
    body: z.object({
        websiteName: z.string().optional().nullable(),
        logoUrl: z.string().optional().nullable(),
        address: z.string().optional().nullable(),
        hotline: z.string().optional().nullable(),
        supportEmail: z.string()
            .email("Invalid email format")
            .optional()
            .nullable()
            .or(z.literal("")),
        workingHours: z.string().optional().nullable(),
        mapUrl: z.string().optional().nullable(),
    }).strict(),
});

export const updateSiteSettingsSchema = z.object({
    body: z.object({
        websiteName: z.string().optional().nullable(),
        logoUrl: z.string().optional().nullable(),
        address: z.string().optional().nullable(),
        hotline: z.string().optional().nullable(),
        supportEmail: z.string()
            .email("Invalid email format")
            .optional()
            .nullable()
            .or(z.literal("")),
        workingHours: z.string().optional().nullable(),
        mapUrl: z.string().optional().nullable(),
    }).strict(),
});

export const createBannersSchema = z.object({
    body: z.object({
        imageUrls: z.array(z.string().min(1, "Image URL is required"))
            .min(1, "At least one image URL is required"),
    }).strict(),
});

export const updateBannerSchema = z.object({
    params: paramsIdSchema,
    body: z.object({
        imageUrl: z.string().min(1, "Image URL is required"),
    }).strict(),
});

export const deleteBannerSchema = z.object({
    params: paramsIdSchema,
});