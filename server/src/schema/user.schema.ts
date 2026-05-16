import { z } from "zod";
import { UserRole } from "@prisma/client";

export const updateMeSchema = z.object({
    body: z
        .object({
            phoneNumber: z
                .string()
                .min(10, "Phone number must be at least 10 characters")
                .max(15)
                .optional(),
            fullName: z
                .string()
                .min(2, "Full name must be at least 2 characters")
                .optional(),
            avatarUrl: z
                .string()
                .url("Invalid avatar URL")
                .or(z.string().length(0))
                .optional(),
        })
        .strict(),
});

export const changePasswordSchema = z.object({
    body: z
        .object({
            oldPassword: z.string().min(1, "Old password is required"),
            newPassword: z
                .string()
                .min(6, "New password must be at least 6 characters"),
            confirmPassword: z
                .string()
                .min(1, "Please confirm your new password"),
        })
        .refine((data) => data.newPassword === data.confirmPassword, {
            message: "Confirm password does not match",
            path: ["confirmPassword"],
        }),
});
export const changeRoleSchema = z.object({
    body: z
        .object({
            userId: z.string().uuid("Invalid user ID"),
            role: z.nativeEnum(UserRole),
        })
        .strict(),
});

/** Query for GET /users (admin list) */
export const listUsersQuerySchema = z.object({
    query: z.object({
        page: z
            .string()
            .optional()
            .transform((val) => Math.max(Number(val) || 1, 1)),
        limit: z
            .string()
            .optional()
            .transform((val) => Math.max(Number(val) || 10, 1)),
        search: z.string().optional(),
        role: z.union([z.nativeEnum(UserRole), z.literal("all")]).optional(),
        emailVerified: z
            .enum(["verified", "unverified", "all"])
            .optional(),
    }),
});

export const deleteUsersSchema = z.object({
    body: z
        .object({
            userIds: z.array(z.string().uuid("Invalid user ID")).min(1),
        })
        .strict(),
});
