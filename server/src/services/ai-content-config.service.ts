import { AppError } from "../utils/AppError";
import { prisma } from "../utils/prisma";

class AIContentConfigService {
    async getActiveConfig() {
        const config = await prisma.aIContentConfig.findFirst({
            where: {
                isActive: true,
            },

            select: {
                id: true,
                ideaModel: true,
                ideaPrompt: true,
                blogModel: true,
                blogPrompt: true,
                thumbnailModel: true,
                isActive: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        if (!config) {
            throw new AppError("AI content config not found.", 404);
        }

        return config;
    }

    async getActiveChatConfig() {
        const config = await prisma.aIContentConfig.findFirst({
            where: {
                isActive: true,
            },

            select: {
                id: true,
                chatModel: true,
                chatSystemPrompt: true,
                isActive: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        if (!config) {
            throw new AppError("AI chat config not found.", 404);
        }

        return config;
    }

    async update(
        id: string,
        data: {
            ideaModel: string;
            ideaPrompt: string;
            blogModel: string;
            blogPrompt: string;
            isActive: boolean;
            thumbnailModel?: string;
        }
    ) {
        const existing = await prisma.aIContentConfig.findUnique({
            where: {
                id,
            },
        });

        if (!existing) {
            throw new AppError("AI content config not found.", 404);
        }

        if (data.isActive) {
            await prisma.aIContentConfig.updateMany({
                where: {
                    id: {
                        not: id,
                    },
                },

                data: {
                    isActive: false,
                },
            });
        }

        const updated = await prisma.aIContentConfig.update({
            where: {
                id,
            },

            data: {
                ideaModel: data.ideaModel,
                ideaPrompt: data.ideaPrompt,
                blogModel: data.blogModel,
                blogPrompt: data.blogPrompt,
                isActive: data.isActive,
                thumbnailModel: data.thumbnailModel,
            },

            select: {
                id: true,
                ideaModel: true,
                ideaPrompt: true,
                blogModel: true,
                blogPrompt: true,
                isActive: true,
                updatedAt: true,
                thumbnailModel: true,
            },
        });

        return updated;
    }

    async updateChatConfig(
        id: string,
        data: {
            chatModel: string;
            chatSystemPrompt: string;
        }
    ) {
        const existing = await prisma.aIContentConfig.findUnique({
            where: {
                id,
            },
        });

        if (!existing) {
            throw new AppError("AI chat config not found.", 404);
        }

        const updated = await prisma.aIContentConfig.update({
            where: {
                id,
            },

            data: {
                chatModel: data.chatModel,
                chatSystemPrompt: data.chatSystemPrompt,
            },

            select: {
                id: true,
                chatModel: true,
                chatSystemPrompt: true,
                isActive: true,
                updatedAt: true,
            },
        });

        return updated;
    }
}

export default new AIContentConfigService();