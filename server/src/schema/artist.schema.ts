import { z } from "zod";

export const createArtistSchema = z.object({
    body: z.object({
        name: z.string().min(1),
        avatarUrl: z.string().url().optional(),
        description: z.string().optional(),
    }),
});

export const updateArtistSchema = z.object({
    params: z.object({
        id: z.string().uuid(),
    }),
    body: z.object({
        name: z.string().min(1).optional(),
        avatarUrl: z.string().url().optional(),
        description: z.string().optional(),
    }),
});

export const getArtistSchema = z.object({
    params: z.object({
        id: z.string().uuid(),
    }),
});

export const listArtistSchema = z.object({
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

export const deleteArtistSchema = z.object({
    body: z.object({
        ids: z.array(z.string().uuid()),
    }),
});
