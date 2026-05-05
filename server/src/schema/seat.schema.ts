import { z } from "zod";

const paramsIdSchema = z.object({
    id: z.string().uuid("Invalid seat ID format"),
});

export const createSeatSchema = z.object({
    body: z.object({
        rowLabel: z.string().min(1, "Row label is required"),
        seatNumber: z.number().int().positive("Seat number must be a positive integer"),
        defaultTicketTypeId: z.string().uuid("Invalid ticket type ID format"),
    }),
});

export const updateSeatSchema = z.object({
    params: paramsIdSchema,
    body: z.object({
        rowLabel: z.string().min(1).optional(),
        seatNumber: z.number().int().positive().optional(),
        defaultTicketTypeId: z.string().uuid().optional(),
    }).partial(),
});

export const getSeatSchema = z.object({
    params: paramsIdSchema,
});

export const deleteSeatSchema = z.object({
    body: z.object({
        ids: z.array(z.string().uuid("Invalid ID format")).min(1, "At least one ID is required"),
    }),
});

export const listSeatSchema = z.object({
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
