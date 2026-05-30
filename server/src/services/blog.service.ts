import { AppError } from "../utils/AppError";
import { prisma } from "../utils/prisma";

type BlogCreateData = {
    title: string;
    slug: string;
    excerpt?: string;
    contentHtml: string;
    thumbnailUrl?: string;
    status?: "draft" | "published";
    categoryId?: string | null;
};

type BlogUpdateData = {
    title?: string;
    slug?: string;
    excerpt?: string;
    contentHtml?: string;
    thumbnailUrl?: string;
    status?: "draft" | "published";
    categoryId?: string | null;
};

class BlogService {
    async createBlog(data: BlogCreateData, authorId: string) {
        const existing = await prisma.blog.findUnique({
            where: { slug: data.slug },
        });

        if (existing) {
            throw new AppError("Blog slug already exists", 400);
        }

        const normalizedData = {
            ...data,
            status: data.status ? data.status.toUpperCase() : "DRAFT",
            publishedAt: data.status === "published" ? new Date() : null,
            authorId,
        } as any;

        return prisma.blog.create({
            data: normalizedData,
            select: {
                id: true,
                title: true,
                slug: true,
                excerpt: true,
                contentHtml: true,
                thumbnailUrl: true,
                status: true,
                publishedAt: true,
                createdAt: true,
                updatedAt: true,
                author: { select: { id: true, email: true } },
                category: { select: { id: true, name: true, slug: true } },
            },
        });
    }

    async getBlogs(page: number, limit: number, search?: string) {
        const skip = (page - 1) * limit;
        const where = search
            ? {
                  OR: [
                      { title: { contains: search } },
                      { slug: { contains: search } },
                      { excerpt: { contains: search } },
                  ],
              }
            : {};

        const [items, totalItems] = await Promise.all([
            prisma.blog.findMany({
                where,
                skip,
                take: Number(limit),
                orderBy: { createdAt: "desc" },
                select: {
                    id: true,
                    title: true,
                    slug: true,
                    excerpt: true,
                    thumbnailUrl: true,
                    status: true,
                    publishedAt: true,
                    createdAt: true,
                    updatedAt: true,
                    author: {
                        select: { id: true, email: true, fullName: true },
                    },
                    category: { select: { id: true, name: true, slug: true } },
                },
            }),
            prisma.blog.count({ where }),
        ]);

        const totalPages = Math.ceil(totalItems / limit);

        return {
            items,
            meta: {
                totalItems,
                itemCount: items.length,
                itemsPerPage: limit,
                totalPages,
                currentPage: page,
            },
        };
    }

    async getBlogById(id: string) {
        const blog = await prisma.blog.findUnique({
            where: { id },
            select: {
                id: true,
                title: true,
                slug: true,
                excerpt: true,
                contentHtml: true,
                thumbnailUrl: true,
                status: true,
                publishedAt: true,
                createdAt: true,
                updatedAt: true,
                author: { select: { id: true, email: true } },
                category: { select: { id: true, name: true, slug: true } },
            },
        });

        if (!blog) {
            throw new AppError("Blog not found", 404);
        }

        return blog;
    }

    async updateBlog(id: string, data: BlogUpdateData) {
        await this.getBlogById(id);

        if (data.slug) {
            const existing = await prisma.blog.findFirst({
                where: { slug: data.slug, id: { not: id } },
            });
            if (existing) {
                throw new AppError("Blog slug already exists", 400);
            }
        }

        const normalizedData: any = { ...data };
        if (data.status) {
            normalizedData.status = data.status.toUpperCase();
            if (data.status === "published") {
                normalizedData.publishedAt = new Date();
            }
        }

        const blog = await prisma.blog.update({
            where: { id },
            data: normalizedData,
            select: {
                id: true,
                title: true,
                slug: true,
                excerpt: true,
                contentHtml: true,
                thumbnailUrl: true,
                status: true,
                publishedAt: true,
                createdAt: true,
                updatedAt: true,
                author: { select: { id: true, email: true } },
                category: { select: { id: true, name: true, slug: true } },
            },
        });

        return blog;
    }

    async deleteBlogs(ids: string[]) {
        const deleteResult = await prisma.blog.deleteMany({
            where: { id: { in: ids } },
        });

        if (deleteResult.count === 0) {
            throw new AppError("No blogs found to delete", 404);
        }

        return deleteResult;
    }
    async getBlogsByCategoryId(
        categoryId: string,
        page: number = 1,
        limit: number = 10,
        search?: string
    ) {
        const currentPage = Number(page) || 1;
        const currentLimit = Number(limit) || 10;
        const skip = (currentPage - 1) * currentLimit;

        const where: any = {
            categoryId,
            status: "PUBLISHED",
        };

        if (search) {
            where.OR = [
                { title: { contains: search } },
                { excerpt: { contains: search } },
            ];
        }

        const [items, totalItems] = await Promise.all([
            prisma.blog.findMany({
                where,
                skip,
                take: currentLimit,
                orderBy: { publishedAt: "desc" },
                include: {
                    category: true,
                    author: {
                        select: {
                            id: true,
                            fullName: true,
                            avatarUrl: true,
                        },
                    },
                },
            }),
            prisma.blog.count({ where }),
        ]);

        return {
            items,
            meta: {
                totalItems,
                itemCount: items.length,
                itemsPerPage: currentLimit,
                totalPages: Math.ceil(totalItems / currentLimit),
                currentPage,
            },
        };
    }

    async getBlogBySlug(slug: string) {
        const blog = await prisma.blog.findUnique({
            where: { slug },
            include: {
                category: true,
                author: {
                    select: {
                        id: true,
                        fullName: true,
                        avatarUrl: true,
                    },
                },
            },
        });

        if (!blog) {
            throw new AppError("Blog not found", 404);
        }

        if (blog.status !== "PUBLISHED") {
            throw new AppError("Blog not found", 404);
        }

        return blog;
    }
}

export default new BlogService();
