import { prisma } from "../utils/prisma";
import { AppError } from "../utils/AppError";
import { getPaginationMetadata } from "../utils/pagination";

class TicketTypeService {
    async create(body: any) {
        return await prisma.ticketType.create({
            data: body,
        });
    }

    async update(id: string, body: any) {
        await this.getDetail(id);

        return await prisma.ticketType.update({
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
            ];
        }

        const [ticketTypes, total] = await Promise.all([
            prisma.ticketType.findMany({
                where,
                skip,
                take: Number(limit),
                orderBy: { name: "asc" },
            }),
            prisma.ticketType.count({ where }),
        ]);

        return {
            data: ticketTypes,
            meta: getPaginationMetadata(total, page, limit),
        };
    }

    async getDetail(id: string) {
        const ticketType = await prisma.ticketType.findUnique({
            where: { id },
        });

        if (!ticketType) {
            throw new AppError("Ticket type not found", 404);
        }

        return ticketType;
    }

    async delete(ids: string[]) {
        const result = await prisma.ticketType.deleteMany({
            where: {
                id: { in: ids },
            },
        });

        if (result.count === 0) {
            throw new AppError("No ticket types found to delete", 404);
        }

        return result;
    }
}

export default new TicketTypeService();
