import { AppError } from "../utils/AppError";
import { prisma } from "../utils/prisma";
import { buildDirectOrderBy } from "../utils/listSort";

class BlogCategoryService {
    async createCategory(data: { name: string; slug: string }) {
        const existing = await prisma.blogCategory.findUnique({
            where: { slug: data.slug },
        });

        if (existing) {
            throw new AppError("Category slug already exists", 400);
        }

        return await prisma.blogCategory.create({
            data,
            select: { id: true, name: true, slug: true, createdAt: true },
        });
    }

    async getCategories(query: {
        page: number;
        limit: number;
        search?: string;
        sortBy?: string;
        sortOrder?: "asc" | "desc";
    }) {
        const { page, limit, search, sortBy, sortOrder } = query;
        const skip = (page - 1) * limit;
        const where = search
            ? {
                  OR: [
                      { name: { contains: search } },
                      { slug: { contains: search } },
                  ],
              }
            : {};

        const orderBy = buildDirectOrderBy(
            sortBy,
            sortOrder,
            {
                name: "name",
                slug: "slug",
                createdAt: "createdAt",
            },
            { createdAt: "desc" }
        );

        const [items, totalItems] = await Promise.all([
            prisma.blogCategory.findMany({
                where,
                skip,
                take: Number(limit),
                orderBy,
                select: { id: true, name: true, slug: true, createdAt: true },
            }),
            prisma.blogCategory.count({ where }),
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

    async getCategoryById(id: string) {
        const category = await prisma.blogCategory.findUnique({
            where: { id },
            select: { id: true, name: true, slug: true, createdAt: true },
        });

        if (!category) {
            throw new AppError("Category not found", 404);
        }

        return category;
    }

    async updateCategory(id: string, data: { name?: string; slug?: string }) {
        await this.getCategoryById(id); // Check existence

        if (data.slug) {
            const existing = await prisma.blogCategory.findFirst({
                where: { slug: data.slug, id: { not: id } },
            });
            if (existing) throw new AppError("Slug already in use", 400);
        }

        return await prisma.blogCategory.update({
            where: { id },
            data,
            select: { id: true, name: true, slug: true },
        });
    }

    async deleteCategories(ids: string[]) {
        const categoriesWithBlogs = await prisma.blogCategory.findMany({
            where: {
                id: { in: ids },
                blogs: { some: {} },
            },
            select: { name: true },
        });

        if (categoriesWithBlogs.length > 0) {
            const names = categoriesWithBlogs.map((c) => c.name).join(", ");
            throw new AppError(
                `Cannot delete categories with associated blogs: ${names}`,
                400
            );
        }

        const deleteResult = await prisma.blogCategory.deleteMany({
            where: {
                id: { in: ids },
            },
        });

        if (deleteResult.count === 0) {
            throw new AppError("No categories found to delete", 404);
        }

        return deleteResult;
    }
}

export default new BlogCategoryService();
