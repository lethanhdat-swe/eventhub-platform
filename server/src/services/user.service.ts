import { prisma } from "../utils/prisma";
import { AppError } from "../utils/AppError";
import bcrypt from "bcryptjs";
import { getPaginationMetadata, PaginatedResult } from "../utils/pagination";

class UserService {
    async updateMe(userId: string, data: any) {
        // 1. Check if email is already taken by another user
        if (data.email) {
            const existingUser = await prisma.user.findFirst({
                where: {
                    email: data.email,
                    NOT: { id: userId },
                },
            });
            if (existingUser) {
                throw new AppError("Email already in use", 400);
            }
        }

        // 2. Check if phone number is already taken
        if (data.phoneNumber) {
            const existingPhone = await prisma.user.findFirst({
                where: {
                    phoneNumber: data.phoneNumber,
                    NOT: { id: userId },
                },
            });
            if (existingPhone) {
                throw new AppError("Phone number already in use", 400);
            }
        }

        // 3. Update user
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                email: data.email,
                phoneNumber: data.phoneNumber,
                fullName: data.fullName,
                avatarUrl: data.avatarUrl,
            },
        });

        const {
            password,
            role,
            provider,
            providerId,
            isEmailVerified,
            lastLoginAt,
            ...userWithoutPassword
        } = updatedUser;

        return userWithoutPassword;
    }

    async changePassword(userId: string, data: any) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user || !user.password) {
            throw new AppError("User not found or using social login", 404);
        }

        const isPasswordMatch = await bcrypt.compare(
            data.oldPassword,
            user.password
        );
        if (!isPasswordMatch) {
            throw new AppError("Current password is incorrect", 400);
        }

        const hashedNewPassword = await bcrypt.hash(data.newPassword, 12);

        await prisma.user.update({
            where: { id: userId },
            data: { password: hashedNewPassword },
        });

        return true;
    }

    async getAllUsers(params: {
        page: number;
        limit: number;
        search?: string;
    }): Promise<PaginatedResult<any>> {
        const { page, limit, search } = params;
        const skip = (page - 1) * limit;

        const where: any = {
            ...(search && {
                OR: [
                    { fullName: { contains: search } },
                    { email: { contains: search } },
                    { phoneNumber: { contains: search } },
                ],
            }),
        };

        const [users, totalItems] = await Promise.all([
            prisma.user.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: "desc" },
                select: {
                    id: true,
                    email: true,
                    fullName: true,
                    phoneNumber: true,
                    role: true,
                    isEmailVerified: true,
                    createdAt: true,
                },
            }),
            prisma.user.count({ where }),
        ]);

        return {
            data: users,
            meta: getPaginationMetadata(totalItems, page, limit),
        };
    }

    async getUserById(userId: string) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                fullName: true,
                phoneNumber: true,
                avatarUrl: true,
                role: true,
                isEmailVerified: true,
                createdAt: true,
                lastLoginAt: true,
            },
        });

        if (!user) {
            throw new AppError("User not found", 404);
        }

        return user;
    }
    async changeRole(data: { userId: string; role: string }) {
        const user = await prisma.user.findUnique({
            where: { id: data.userId },
        });

        if (!user) {
            throw new AppError("User not found", 404);
        }

        await prisma.user.update({
            where: { id: data.userId },
            data: { role: data.role },
        });

        return true;
    }

    async deleteUsers(userIds: string[]) {
        await prisma.user.deleteMany({
            where: {
                id: { in: userIds },
            },
        });

        return true;
    }
}

export default new UserService();
