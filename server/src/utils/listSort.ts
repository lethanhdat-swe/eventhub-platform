import { z } from "zod";

type SortOrder = "asc" | "desc";

export function listSortQueryFields<const T extends readonly [string, ...string[]]>(
    sortByValues: T
) {
    return {
        sortBy: z.enum(sortByValues).optional(),
        sortOrder: z.enum(listSortOrderSchema).optional(),
    };
}

export function buildDirectOrderBy<T extends Record<string, string>>(
    sortBy: string | undefined,
    sortOrder: SortOrder | undefined,
    fieldMap: T,
    defaultOrderBy: Record<string, SortOrder>
) {
    if (!sortBy || !sortOrder) {
        return defaultOrderBy;
    }

    const field = fieldMap[sortBy as keyof T];
    if (!field) {
        return defaultOrderBy;
    }

    return {
        [field]: sortOrder,
    };
}

export const listSortOrderSchema = ["asc", "desc"] as const;
