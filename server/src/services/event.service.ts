import { prisma } from "../utils/prisma";
import { AppError } from "../utils/AppError";
import { getPaginationMetadata } from "../utils/pagination";

class EventService {
    async create(body: any) {
        return await prisma.event.create({
            data: body,
            include: {
                category: true,
            },
        });
    }

    async update(id: string, body: any) {
        await this.getDetail(id);

        return await prisma.event.update({
            where: { id },
            data: body,
            include: {
                category: true,
            },
        });
    }

    async list(query: { search?: string; page: number; limit: number; status?: string; categoryId?: string }) {
        const { page = 1, limit = 10, search, status, categoryId } = query;
        const skip = (page - 1) * limit;

        const where: any = {};
        
        if (search) {
            where.OR = [
                { title: { contains: search } },
                { slug: { contains: search } },
            ];
        }

        if (status) {
            where.status = status;
        }

        if (categoryId) {
            where.categoryId = categoryId;
        }

        const [events, total] = await Promise.all([
            prisma.event.findMany({
                where,
                skip,
                take: Number(limit),
                orderBy: { createdAt: "desc" },
                include: {
                    category: true,
                },
            }),
            prisma.event.count({ where }),
        ]);

        return {
            data: events,
            meta: getPaginationMetadata(total, page, limit),
        };
    }

    async getDetail(id: string) {
        const event = await prisma.event.findUnique({
            where: { id },
            include: {
                category: true,
                ticketTypes: true,
            },
        });

        if (!event) {
            throw new AppError("Event not found", 404);
        }

        return event;
    }

    async delete(ids: string[]) {
        const result = await prisma.event.deleteMany({
            where: {
                id: { in: ids },
            },
        });

        if (result.count === 0) {
            throw new AppError("No events found to delete", 404);
        }

        return result;
    }
}

export default new EventService();
