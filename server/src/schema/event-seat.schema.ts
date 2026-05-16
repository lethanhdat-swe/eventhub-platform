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

export const updateBulkEventSeatSchema = z.object({
    params: paramsEventIdSchema,
    body: z.object({
        ids: z.array(z.string().uuid("Invalid EventSeat ID format")).min(1, "At least one ID is required"),
        status: z.nativeEnum(EventSeatStatus).optional(),
        ticketTypeId: z.string().uuid().optional(),
    }).refine(data => data.status || data.ticketTypeId, {
        message: "At least one field (status or ticketTypeId) must be provided for update",
    }),
});
