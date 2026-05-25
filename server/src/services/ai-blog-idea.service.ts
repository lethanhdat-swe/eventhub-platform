import { AppError } from "../utils/AppError";
import { prisma } from "../utils/prisma";
import aiProviderService from "./ai-provider.service";
import { z } from "zod";

const blogIdeasSchema = z.array(
    z.object({
        title: z.string(),
        description: z.string(),
    })
);

class AIBlogIdeaService {
    async generateIdeas(quantity: number) {
        const config = await prisma.aIContentConfig.findFirst({
            where: {
                isActive: true,
            },
            select: {
                ideaModel: true,
                ideaPrompt: true,
            },
        });

        if (!config) {
            throw new AppError("AI content config not found.", 404);
        }

        const finalPrompt = `
            ${config.ideaPrompt}

            Generate EXACTLY ${quantity} blog ideas.

            Return ONLY valid JSON array.

            Format:
            [
                {
                    "title": "...",
                    "description": "..."
                }
            ]
        `;

        const response = await aiProviderService.generateText({
            model: config.ideaModel,
            prompt: finalPrompt,
        });

        const cleaned = response
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        const parsed = JSON.parse(cleaned);

        const validated = blogIdeasSchema.parse(parsed);

        await prisma.blogIdea.createMany({
            data: validated.map((item) => ({
                title: item.title,
                description: item.description,
                status: "PENDING",
            })),
        });

        return validated;
    }

    async list({
        page,
        limit,
        search,
        status,
    }: {
        page: number;
        limit: number;
        search?: string;
        status?: "PENDING" | "USED" | "FAILED";
    }) {
        const skip = (page - 1) * limit;

        const where: any = {};

        if (search) {
            where.OR = [
                {
                    title: {
                        contains: search,
                    },
                },
                {
                    description: {
                        contains: search,
                    },
                },
            ];
        }

        if (status) {
            where.status = status;
        }

        const [items, totalItems] = await Promise.all([
            prisma.blogIdea.findMany({
                where,
                skip,
                take: Number(limit),
                orderBy: {
                    createdAt: "desc",
                },
                select: {
                    id: true,
                    title: true,
                    description: true,
                    status: true,
                    createdAt: true,
                },
            }),

            prisma.blogIdea.count({
                where,
            }),
        ]);

        return {
            items,
            meta: {
                totalItems,
                itemCount: items.length,
                itemsPerPage: limit,
                totalPages: Math.ceil(totalItems / limit),
                currentPage: page,
            },
        };
    }
}

export default new AIBlogIdeaService();
