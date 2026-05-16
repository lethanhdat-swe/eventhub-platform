import { z } from "zod";

/** Cho phép URL đầy đủ hoặc path upload `/uploads/...` */
const optionalAvatarUrlSchema = z.preprocess(
    (val) => (val === "" || val === undefined ? undefined : val),
    z
        .union([z.string().url(), z.string().regex(/^\/uploads\/.+/)])
        .optional()
);

const optionalSlugSchema = z.preprocess(
    (val) =>
        typeof val === "string" && val.trim() === "" ? undefined : val,
    z.string().min(1).optional()
);

export const createArtistSchema = z.object({
    body: z.object({
        name: z.string().min(1),
        slug: optionalSlugSchema,
        avatarUrl: optionalAvatarUrlSchema,
        description: z.string().optional(),
    }),
});

/** PATCH: cho phép null để xóa avatar */
const optionalAvatarUrlUpdateSchema = z.preprocess(
    (val) => {
        if (val === "" || val === undefined) return undefined;
        if (val === null) return null;
        return val;
    },
    z
        .union([
            z.string().url(),
            z.string().regex(/^\/uploads\/.+/),
            z.null(),
        ])
        .optional()
);

export const updateArtistSchema = z.object({
    params: z.object({
        id: z.string().uuid(),
    }),
    body: z.object({
        name: z.string().min(1).optional(),
        slug: optionalSlugSchema,
        avatarUrl: optionalAvatarUrlUpdateSchema,
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
