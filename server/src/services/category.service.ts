import { prisma } from "../utils/prisma";
import { AppError } from "../utils/AppError";
import { getPaginationMetadata } from "../utils/pagination";

class CategoryService {
    async create(body: any) {
        return await prisma.category.create({
            data: body,
        });
    }

    async update(id: string, body: any) {
        await this.getDetail(id);

        return await prisma.category.update({
            where: { id },
            data: body,
        });
    }

    async list(query: { search?: string; page: number; limit: number }) {
        const { page = 1, limit = 10, search } = query;
        const skip = (page - 1) * limit;

        const where: any = {};
        if (search) {
            where.OR = [
                { name: { contains: search } },
                { slug: { contains: search } },
            ];
        }

        const [categories, total] = await Promise.all([
            prisma.category.findMany({
                where,
                skip,
                take: Number(limit),
                orderBy: { name: "asc" },
            }),
            prisma.category.count({ where }),
        ]);

        return {
            data: categories,
            meta: getPaginationMetadata(total, page, limit),
        };
    }

    async getDetail(id: string) {
        const category = await prisma.category.findUnique({
            where: { id },
        });

        if (!category) {
            throw new AppError("Category not found", 404);
        }

        return category;
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
