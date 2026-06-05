import { z } from "zod";
import { listSortQueryFields } from "../utils/listSort";

export const scanCheckInSchema = z.object({
    body: z.object({
        token: z.string().min(1, "Token is required"),
    }),
});

export const listCheckInHistorySchema = z.object({
    query: z.object({
        page: z.coerce.number().int().positive().default(1),
        limit: z.coerce.number().int().positive().default(10),
        search: z.string().optional(),
        status: z.enum(["VALID", "DUPLICATE", "INVALID"]).optional(),
        eventId: z.string().optional(),
        ...listSortQueryFields(["scannedAt", "status"] as const),
    }),
});

export type ScanCheckInInput = z.infer<typeof scanCheckInSchema>["body"];
export type ListCheckInHistoryInput = z.infer<
    typeof listCheckInHistorySchema
>["query"];
