import { z } from "zod";
import { EventSeatStatus } from "@prisma/client";

const paramsEventIdSchema = z.object({
    id: z.string().uuid("Invalid event ID format"),
});

export const listEventSeatSchema = z.object({
    params: paramsEventIdSchema,
    query: z.object({
        page: z
            .string()
            .optional()
            .default("1")
            .transform((val) => Math.max(1, parseInt(val))),
        limit: z
            .string()
            .optional()
            .default("100") // Larger default for seats
            .transform((val) => Math.max(1, parseInt(val))),
        status: z.string().optional(),
        ticketTypeId: z.string().uuid().optional(),
    }),
});

export const updateEventSeatSchema = z.object({
    params: paramsEventIdSchema.extend({
        seatId: z.string().uuid("Invalid EventSeat ID format"),
    }),
    body: z
        .object({
            status: z.nativeEnum(EventSeatStatus).optional(),
            ticketTypeId: z.string().uuid().optional(),
        })
        .refine((data) => data.status || data.ticketTypeId, {
            message:
                "At least one field (status or ticketTypeId) must be provided for update",
        }),
});

export const addSeatRowSchema = z.object({
    body: z.object({
        rowLabel: z.string().min(1),
        seatCount: z.coerce.number().int().positive(),
        ticketTypeId: z.string().uuid(),
    }),
});

export const addEventSeatSchema = z.object({
    body: z.object({
        rowLabel: z.string().min(1),
        seatNumber: z.coerce.number().int().positive(),
        ticketTypeId: z.string().uuid(),
        status: z
            .enum(["AVAILABLE", "RESERVING", "BOOKED", "DISABLED"])
            .optional(),
    }),
});

export const deleteEventSeatSchema = z.object({
    body: z.object({
        ids: z.array(z.string().uuid()).min(1),
    }),
});
