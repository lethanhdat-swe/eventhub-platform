import { z } from "zod";

export const registerSchema = z.object({
    body: z.object({
        email: z.string().email("Invalid email address"),
        password: z.string().min(6, "Password must be at least 6 characters"),
        fullName: z.string().min(2, "Full name must be at least 2 characters"),
        phoneNumber: z.string().min(10, "Invalid phone number").max(15, "Invalid phone number"),
    }),
});

export const verifyEmailSchema = z.object({
    body: z.object({
        token: z.string().min(1, "Token is required"),
    }),
});

export const loginSchema = z.object({
    body: z.object({
        email: z.string().email("Invalid email address"),
        password: z.string().min(1, "Password is required"),
    }),
});

export const forgotPasswordSchema = z.object({
    body: z.object({
        email: z.string().email("Invalid email address"),
    }),
});

export const verifyResetTokenSchema = z.object({
    body: z.object({
        token: z.string().min(1, "Token is required"),
    }),
});

export const resetPasswordSchema = z.object({
    body: z.object({
        token: z.string().min(1, "Token is required"),
        password: z.string().min(6, "Password must be at least 6 characters"),
    }),
});

export const refreshTokenSchema = z.object({
    body: z.object({
        refreshToken: z.string().min(1, "Refresh token is required"),
    }),
});

export const logoutSchema = z.object({
    body: z.object({
        refreshToken: z.string().optional(),
    }),
});

export const googleLoginSchema = z.object({
    body: z.object({
        idToken: z.string().min(1, "ID Token is required"),
    }),
});
