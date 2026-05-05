import { z } from "zod";

const paramsIdSchema = z.object({
    id: z.string().uuid("Invalid ticket ID format"),
});

export const createTicketSchema = z.object({
    body: z.object({
        orderId: z.string().uuid("Invalid order ID format"),
        eventSeatId: z.string().uuid("Invalid event seat ID format"),
        qrSecureToken: z.string().min(10, "QR Secure Token must be at least 10 characters"),
        isCheckedIn: z.boolean().optional().default(false),
        checkedInAt: z.string().datetime().optional(),
    }),
});

export const updateTicketSchema = z.object({
    params: paramsIdSchema,
    body: z.object({
        isCheckedIn: z.boolean().optional(),
        checkedInAt: z.string().datetime().nullable().optional(),
    }).partial(),
});

export const getTicketSchema = z.object({
    params: paramsIdSchema,
});

export const listTicketSchema = z.object({
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
        isCheckedIn: z
            .enum(["true", "false"])
            .optional()
            .transform((val) => val === "true"),
    }),
});
