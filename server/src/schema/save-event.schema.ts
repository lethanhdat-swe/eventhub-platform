import { z } from "zod";

export const toggleSaveEventSchema = z.object({
    params: z.object({
        eventId: z.string().uuid("Invalid Event ID format"),
    }),
});

export const listSavedEventsSchema = z.object({
    query: z.object({
        page: z.string().optional().transform((val) => Number(val) || 1),
        limit: z.string().optional().transform((val) => Number(val) || 10),
    }),
});