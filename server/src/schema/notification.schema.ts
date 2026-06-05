import { z } from "zod";

export const getNotificationsSchema = z.object({
    query: z.object({
        page: z
            .string()
            .optional()
            .default("1")
            .transform(Number)
            .refine((value) => Number.isInteger(value) && value > 0, {
                message: "Page must be a positive integer.",
            }),

        limit: z
            .string()
            .optional()
            .default("10")
            .transform(Number)
            .refine(
                (value) => Number.isInteger(value) && value > 0 && value <= 100,
                {
                    message:
                        "Limit must be a positive integer and less than or equal to 100.",
                }
            ),

        isRead: z
            .enum(["true", "false"])
            .optional()
            .transform((value) => {
                if (value === undefined) return undefined;
                return value === "true";
            }),

        type: z
            .enum([
                "USER_REGISTERED",
                "ORDER_CREATED",
                "ORDER_PAID",
                "CONTACT_CREATED",
                "CHECKIN_CREATED",
            ])
            .optional(),
    }),
});

export const notificationIdSchema = z.object({
    params: z.object({
        id: z.string().uuid("Invalid notification id."),
    }),
});

export type GetNotificationsQuery = z.infer<
    typeof getNotificationsSchema
>["query"];

export type NotificationIdParams = z.infer<
    typeof notificationIdSchema
>["params"];
