import { prisma } from "../utils/prisma";
import { AppError } from "../utils/AppError";
import { getPaginationMetadata } from "../utils/pagination";

const categorySelect = {
    id: true,
    name: true,
    slug: true,
};

const categorySelectWithCount = {
    ...categorySelect,
    _count: {
        select: { events: true },
    },
};

function mapCategoryRow<T extends { _count?: { events: number } }>(row: T) {
    const { _count, ...rest } = row;
    return {
        ...rest,
        eventCount: _count?.events ?? 0,
    };
}

class CategoryService {
    async create(body: { name: string; slug: string }) {
        const category = await prisma.category.create({
            data: body,
            select: categorySelectWithCount,
        });

        return mapCategoryRow(category);
    }

    async update(id: string, body: { name?: string; slug?: string }) {
        await this.getDetail(id);

        const category = await prisma.category.update({
            where: { id },
            data: body,
            select: categorySelectWithCount,
        });

        return mapCategoryRow(category);
    }

    async list(query: { search?: string; page: number; limit: number }) {
        const { page = 1, limit = 10, search } = query;
        const skip = (page - 1) * limit;

        const where: Record<string, unknown> = {};
        if (search) {
            where.OR = [
                { name: { contains: search } },
                { slug: { contains: search } },
            ];
        }

        const [rows, total] = await Promise.all([
            prisma.category.findMany({
                where,
                skip,
                take: Number(limit),
                orderBy: { name: "asc" },
                select: categorySelectWithCount,
            }),
            prisma.category.count({ where }),
        ]);

        return {
            data: rows.map(mapCategoryRow),
            meta: getPaginationMetadata(total, page, limit),
        };
    }

    async getDetail(id: string) {
        const category = await prisma.category.findUnique({
            where: { id },
            select: categorySelectWithCount,
        });

        if (!category) {
            throw new AppError("Category not found", 404);
        }

        return mapCategoryRow(category);
    }

    async delete(ids: string[]) {
        const result = await prisma.category.deleteMany({
            where: {
                id: { in: ids },
            },
        });

        if (result.count === 0) {
            throw new AppError("No categories found to delete", 404);
        }

        return result;
    }
}

export default new CategoryService();
