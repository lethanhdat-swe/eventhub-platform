import { marked } from "marked";
import slugify from "slugify";

import aiProviderService from "./ai-provider.service";
import { prisma } from "../utils/prisma";
import { AppError } from "../utils/AppError";

class AIBlogWriterService {
    async generateNextPendingBlog() {
        const idea = await prisma.blogIdea.findFirst({
            where: {
                status: "PENDING",
            },
            orderBy: {
                createdAt: "asc",
            },
            select: {
                id: true,
                title: true,
                description: true,
            },
        });

        if (!idea) {
            return null;
        }

        const admin = await prisma.user.findFirst({
            where: {
                role: "ADMIN",
            },
            select: {
                id: true,
            },
        });

        if (!admin) {
            throw new AppError("Admin author not found.", 404);
        }

        const config = await prisma.aIContentConfig.findFirst({
            where: {
                isActive: true,
            },
            select: {
                blogModel: true,
                blogPrompt: true,
                thumbnailModel: true,
            },
        });

        if (!config) {
            throw new AppError("AI content config not found.", 404);
        }

        const categories = await prisma.blogCategory.findMany({
            select: {
                id: true,
                name: true,
                slug: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        if (categories.length === 0) {
            throw new AppError("Blog category not found.", 404);
        }

        try {
            const aiResult = await aiProviderService.generateText({
                model: config.blogModel,
                prompt: this.buildBlogPrompt({
                    blogPrompt: config.blogPrompt,
                    title: idea.title,
                    description: idea.description,
                    categories,
                }),
            });

            const cleaned = aiResult
                .replace(/```json/g, "")
                .replace(/```/g, "")
                .trim();

            const parsed = JSON.parse(cleaned) as {
                title: string;
                excerpt: string;
                categorySlug: string;
                markdown: string;
            };

            const selectedCategory =
                categories.find(
                    (category) => category.slug === parsed.categorySlug
                ) ?? categories[0];

            const thumbnailUrl = config.thumbnailModel
                ? await aiProviderService.generateImage({
                      model: config.thumbnailModel,
                      prompt: this.buildThumbnailPrompt({
                          title: parsed.title || idea.title,
                          description: parsed.excerpt || idea.description,
                      }),
                  })
                : null;

            const blogTitle = parsed.title || idea.title;

            const blog = await prisma.blog.create({
                data: {
                    title: blogTitle,
                    slug: await this.generateUniqueSlug(blogTitle),
                    excerpt: parsed.excerpt || idea.description,
                    contentHtml: marked(parsed.markdown) as string,
                    thumbnailUrl,
                    status: "PUBLISHED",
                    publishedAt: new Date(),
                    authorId: admin.id,
                    categoryId: selectedCategory.id,
                },
                select: {
                    id: true,
                    title: true,
                    slug: true,
                    excerpt: true,
                    thumbnailUrl: true,
                    status: true,
                    publishedAt: true,
                    createdAt: true,
                    category: {
                        select: {
                            id: true,
                            name: true,
                            slug: true,
                        },
                    },
                },
            });

            await prisma.blogIdea.update({
                where: {
                    id: idea.id,
                },
                data: {
                    status: "USED",
                },
            });

            return blog;
        } catch (error) {
            await prisma.blogIdea.update({
                where: {
                    id: idea.id,
                },
                data: {
                    status: "FAILED",
                },
            });

            throw error;
        }
    }

    private buildBlogPrompt({
        blogPrompt,
        title,
        description,
        categories,
    }: {
        blogPrompt: string;
        title: string;
        description: string;
        categories: {
            id: string;
            name: string;
            slug: string;
        }[];
    }) {
        const categoryList = categories
            .map((category) => `- ${category.name} (${category.slug})`)
            .join("\n");

        return `
            ${blogPrompt}

            Available blog categories:
            ${categoryList}

            Blog idea title:
            ${title}

            Blog idea description:
            ${description}

            Choose the most suitable category from the available categories.

            Return ONLY valid JSON.
            Do not return markdown fences.
            Do not return explanation.

            JSON format:
            {
            "title": "string",
            "excerpt": "string",
            "categorySlug": "string",
            "markdown": "string"
            }
            `;
    }

    private buildThumbnailPrompt({
        title,
        description,
    }: {
        title: string;
        description: string;
    }) {
        return `
            Create a modern cinematic blog thumbnail for an event booking platform.

            Blog title:
            ${title}

            Blog description:
            ${description}

            Style:
            - concert and festival atmosphere
            - modern entertainment culture
            - vibrant lighting
            - realistic photography style
            - professional blog banner
            - no text, no words, no logo
            `;
    }

    private async generateUniqueSlug(title: string) {
        const baseSlug =
            slugify(title, {
                lower: true,
                strict: true,
                trim: true,
            }) || "ai-blog";

        let slug = baseSlug;
        let count = 1;

        while (true) {
            const existing = await prisma.blog.findUnique({
                where: {
                    slug,
                },
                select: {
                    id: true,
                },
            });

            if (!existing) {
                return slug;
            }

            slug = `${baseSlug}-${count}`;
            count++;
        }
    }
}

export default new AIBlogWriterService();
