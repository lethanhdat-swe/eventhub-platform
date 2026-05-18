import { z } from "zod";

import { normalizeHexColor } from "../utils/hexColor";

const paramsIdSchema = z.object({
    id: z.string().uuid("Invalid ticket type ID format"),
});

const hexColorSchema = z
    .string()
    .trim()
    .regex(
        /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/,
        "Color must be a valid hex value (#RGB or #RRGGBB)"
    )
    .transform(normalizeHexColor);

export const createTicketTypeSchema = z.object({
    body: z.object({
        name: z.string().min(1, "Name is required"),
        price: z.number().min(0, "Price must be a non-negative number"),
        color: hexColorSchema.optional(),
    }),
});

export const updateTicketTypeSchema = z.object({
    params: paramsIdSchema,
    body: z
        .object({
            name: z.string().min(1).optional(),
            price: z.number().min(0).optional(),
            color: hexColorSchema.optional(),
        })
        .partial(),
});

export const getTicketTypeSchema = z.object({
    params: paramsIdSchema,
});

export const deleteTicketTypeSchema = z.object({
    body: z.object({
        ids: z
            .array(z.string().uuid("Invalid ID format"))
            .min(1, "At least one ID is required"),
    }),
});

export const listTicketTypeSchema = z.object({
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
    }),
});

export const checkInTicketSchema = z.object({
    body: z.object({
        token: z.string().min(1, "token is required"),
    }),
});

export type CheckInTicketInput = z.infer<typeof checkInTicketSchema>["body"];
