import { prisma } from "../utils/prisma";
import bcrypt from "bcryptjs";
import MailService from "./mail.service";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import ms from "ms";
import { AppError } from "../utils/AppError";
import firebaseApp from "../config/firebase";
import notificationService from "./notification.service";
import { NotificationType } from "@prisma/client";
import systemJobService from "./system-job.service";

class AuthService {
    async googleLogin(idToken: string) {
        try {
            // 1. Verify ID Token from Firebase
            const decodedToken = await firebaseApp
                .auth()
                .verifyIdToken(idToken);
            const { email, name, picture, uid } = decodedToken;

            if (!email) {
                throw new AppError("Email not found in Google account", 400);
            }

            // 2. Find or Create User
            let user = await prisma.user.findUnique({
                where: { email },
            });

            if (!user) {
                user = await prisma.user.create({
                    data: {
                        email,
                        fullName: name || "Google User",
                        avatarUrl: picture,
                        provider: "google",
                        providerId: uid,
                        isEmailVerified: true,
                    },
                });

                await notificationService.createNotification({
                    type: NotificationType.USER_REGISTERED,
                    title: "Người dùng mới đăng ký",
                    message: `${user.fullName} vừa tạo tài khoản mới bằng Google.`,
                });
            } else {
                if (user.providerId && user.providerId !== uid) {
                    throw new AppError("Google account mismatch", 400);
                }

                if (!user.providerId) {
                    user = await prisma.user.update({
                        where: { id: user.id },
                        data: {
                            providerId: uid,
                            isEmailVerified: true,
                        },
                    });
                }
            }

            // 3. Update last login
            user = await prisma.user.update({
                where: { id: user.id },
                data: { lastLoginAt: new Date() },
            });

            // 4. Generate tokens
            const accessToken = this.generateAccessToken(user);
            const refreshToken = this.generateRefreshToken(user);

            // 5. Save refresh token to DB
            await this.saveRefreshToken(user.id, refreshToken);

            return {
                user: {
                    id: user.id,
                    email: user.email,
                    fullName: user.fullName,
                    avatarUrl: user.avatarUrl,
                    phoneNumber: user.phoneNumber,
                    role: user.role,
                },
                accessToken,
                refreshToken,
                accessTokenExpiresIn:
                    process.env.ACCESS_TOKEN_EXPIRES_IN || "15m",
            };
        } catch (error: any) {
            throw new AppError(
                error.message || "Google login failed",
                error.status || 401
            );
        }
    }

    async register(data: any) {
        const { email, password, fullName, phoneNumber } = data;

        const normalizedEmail = email.trim().toLowerCase();
        const normalizedPhoneNumber = phoneNumber.trim();

        // 1. Check if email already exists
        const existingUserByEmail = await prisma.user.findUnique({
            where: {
                email: normalizedEmail,
            },
        });

        if (existingUserByEmail) {
            throw new AppError("Email already exists", 400);
        }

        // 2. Check if phone number already exists
        const existingUserByPhoneNumber = await prisma.user.findFirst({
            where: {
                phoneNumber: normalizedPhoneNumber,
            },
        });

        if (existingUserByPhoneNumber) {
            throw new AppError("Phone number already exists", 400);
        }

        // 3. Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 4. Insert into DB
        const newUser = await prisma.user.create({
            data: {
                email: normalizedEmail,
                password: hashedPassword,
                fullName: fullName.trim(),
                phoneNumber: normalizedPhoneNumber,
                provider: "local",
                isEmailVerified: false,
            },
        });

        // 5. Generate verification token
        const token = crypto.randomBytes(32).toString("hex");

        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 24);

        await prisma.userToken.create({
            data: {
                userId: newUser.id,
                token,
                type: "VERIFY_EMAIL",
                expiresAt,
            },
        });

        await notificationService.createNotification({
            type: NotificationType.USER_REGISTERED,
            title: "Người dùng mới đăng ký",
            message: `${newUser.fullName} vừa tạo tài khoản mới.`,
        });

        await systemJobService.createSendVerifyEmailJob(
            newUser.email,
            newUser.fullName,
            token
        );

        return {
            id: newUser.id,
            email: newUser.email,
            fullName: newUser.fullName,
        };
    }

    async login(data: any) {
        const { email, password } = data;

        // 1. Find user
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            throw new AppError("Invalid email or password", 401);
        }

        // 2. Check provider (prevent social login users from using password login)
        if (!user.password) {
            throw new AppError(
                "This account does not support password login",
                400
            );
        }

        // 3. Check password
        const isPasswordMatch = await bcrypt.compare(
            password,
            user.password || ""
        );
        if (!isPasswordMatch) {
            throw new AppError("Invalid email or password", 401);
        }

        // 3. Check email verification
        if (!user.isEmailVerified) {
            throw new AppError(
                "Please verify your email before logging in",
                403
            );
        }

        // 4. Update last login
        await prisma.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() },
        });

        // 5. Generate tokens
        const accessToken = this.generateAccessToken(user);
        const refreshToken = this.generateRefreshToken(user);

        // 6. Save refresh token to DB
        await this.saveRefreshToken(user.id, refreshToken);

        return {
            user: {
                id: user.id,
                email: user.email,
                fullName: user.fullName,
                phoneNumber: user.phoneNumber,
                role: user.role,
            },
            accessToken,
            refreshToken,
            accessTokenExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || "15m",
        };
    }

    async verifyEmail(token: string) {
        // 1. Find valid token
        const userToken = await prisma.userToken.findFirst({
            where: {
                token,
                type: "VERIFY_EMAIL",
                isRevoked: false,
                expiresAt: { gt: new Date() },
                usedAt: null,
            },
            include: { user: true },
        });

        if (!userToken) {
            throw new AppError("Invalid or expired verification token", 400);
        }

        // 2. Update user and token
        await prisma.$transaction([
            prisma.user.update({
                where: { id: userToken.userId },
                data: { isEmailVerified: true },
            }),
            prisma.userToken.update({
                where: { id: userToken.id },
                data: { usedAt: new Date() },
            }),
        ]);

        // 3. Generate tokens
        const accessToken = this.generateAccessToken(userToken.user);
        const refreshToken = this.generateRefreshToken(userToken.user);

        // 4. Save refresh token to DB
        await this.saveRefreshToken(userToken.userId, refreshToken);

        return {
            user: {
                id: userToken.user.id,
                email: userToken.user.email,
                fullName: userToken.user.fullName,
                phoneNumber: userToken.user.phoneNumber,
                role: userToken.user.role,
            },
            accessToken,
            refreshToken,
            accessTokenExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || "15m",
        };
    }

    async refreshToken(token: string) {
        try {
            // 1. Verify JWT
            const decoded: any = jwt.verify(
                token,
                process.env.REFRESH_TOKEN_SECRET!,
                { ignoreExpiration: true }
            );

            // 2. Check token in DB
            const userToken = await prisma.userToken.findFirst({
                where: {
                    token,
                    type: "REFRESH_TOKEN",
                    userId: decoded.id,
                },
                include: { user: true },
            });

            if (!userToken || userToken.isRevoked) {
                throw new AppError("Invalid refresh token", 401);
            }

            // 3. Check expiry and revoke if expired
            if (new Date() > userToken.expiresAt) {
                await prisma.userToken.update({
                    where: { id: userToken.id },
                    data: { isRevoked: true },
                });
                throw new AppError("Refresh token expired", 401);
            }

            // 4. Revoke old token and generate new ones (Token Rotation)
            const accessToken = this.generateAccessToken(userToken.user);
            const newRefreshToken = this.generateRefreshToken(userToken.user);

            await prisma.$transaction([
                prisma.userToken.update({
                    where: { id: userToken.id },
                    data: { isRevoked: true, usedAt: new Date() },
                }),
                this.saveRefreshTokenTransaction(
                    userToken.userId,
                    newRefreshToken
                ),
            ]);

            return {
                accessToken,
                refreshToken: newRefreshToken,
                accessTokenExpiresIn:
                    process.env.ACCESS_TOKEN_EXPIRES_IN || "15m",
            };
        } catch (error: any) {
            throw new AppError(
                error.message || "Invalid refresh token",
                error.status || 401
            );
        }
    }

    private saveRefreshTokenTransaction(userId: string, token: string) {
        const expiresIn = process.env.REFRESH_TOKEN_EXPIRES_IN || "7d";
        const expiresAt = new Date(Date.now() + ms(expiresIn as any));

        return prisma.userToken.create({
            data: {
                userId,
                token,
                type: "REFRESH_TOKEN",
                expiresAt,
            },
        });
    }

    async logout(refreshToken?: string) {
        if (refreshToken) {
            await prisma.userToken.updateMany({
                where: {
                    token: refreshToken,
                    type: "REFRESH_TOKEN",
                },
                data: {
                    isRevoked: true,
                    usedAt: new Date(),
                },
            });
        }
        return { message: "Logged out successfully" };
    }

    private async saveRefreshToken(userId: string, token: string) {
        await this.saveRefreshTokenTransaction(userId, token);
    }

    async forgotPassword(email: string) {
        // 1. Find user
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            throw new AppError("Email not found", 404);
        }

        // 2. Generate token
        const token = crypto.randomBytes(32).toString("hex");
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 1);

        await prisma.userToken.create({
            data: {
                userId: user.id,
                token,
                type: "FORGOT_PASSWORD",
                expiresAt,
            },
        });

        await systemJobService.createSendForgotPasswordEmailJob(
            email,
            user.fullName,
            token
        );

        return { message: "Reset password email sent" };
    }

    async verifyResetToken(token: string) {
        const userToken = await prisma.userToken.findFirst({
            where: {
                token,
                type: "FORGOT_PASSWORD",
                isRevoked: false,
                expiresAt: { gt: new Date() },
                usedAt: null,
            },
        });

        if (!userToken) {
            throw new AppError("Invalid or expired reset token", 400);
        }

        return { message: "Token is valid" };
    }

    async resetPassword(data: any) {
        const { token, password } = data;

        // 1. Find valid token
        const userToken = await prisma.userToken.findFirst({
            where: {
                token,
                type: "FORGOT_PASSWORD",
                isRevoked: false,
                expiresAt: { gt: new Date() },
                usedAt: null,
            },
        });

        if (!userToken) {
            throw new AppError("Invalid or expired reset token", 400);
        }

        // 2. Hash new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3. Update user and token
        await prisma.$transaction([
            prisma.user.update({
                where: { id: userToken.userId },
                data: { password: hashedPassword },
            }),
            prisma.userToken.update({
                where: { id: userToken.id },
                data: { usedAt: new Date() },
            }),
        ]);

        return { message: "Password reset successful" };
    }

    async getMe(userId: string) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new AppError("User not found", 404);
        }

        // Filter out sensitive information
        const {
            password,
            role,
            provider,
            providerId,
            isEmailVerified,
            lastLoginAt,
            ...userWithoutPassword
        } = user;
        return userWithoutPassword;
    }

    private generateAccessToken(user: any) {
        return jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.ACCESS_TOKEN_SECRET!,
            { expiresIn: (process.env.ACCESS_TOKEN_EXPIRES_IN as any) || "15m" }
        );
    }

    private generateRefreshToken(user: any) {
        return jwt.sign({ id: user.id }, process.env.REFRESH_TOKEN_SECRET!, {
            expiresIn: (process.env.REFRESH_TOKEN_EXPIRES_IN as any) || "7d",
        });
    }
}

export default new AuthService();
