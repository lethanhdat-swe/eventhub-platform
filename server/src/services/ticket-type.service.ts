import { prisma } from "../utils/prisma";
import { AppError } from "../utils/AppError";
import { getPaginationMetadata } from "../utils/pagination";

const ticketTypeSelect = {
    id: true,
    name: true,
    price: true,
};

const ticketTypeSelectWithCount = {
    ...ticketTypeSelect,
    _count: {
        select: {
            defaultSeats: true,
            eventSeats: true,
        },
    },
};

function mapTicketTypeRow<
    T extends { _count?: { defaultSeats: number; eventSeats: number } }
>(row: T) {
    const { _count, ...rest } = row;
    return {
        ...rest,
        defaultSeatCount: _count?.defaultSeats ?? 0,
        eventSeatCount: _count?.eventSeats ?? 0,
    };
}

class TicketTypeService {
    async create(body: { name: string; price: number }) {
        const ticketType = await prisma.ticketType.create({
            data: body,
            select: ticketTypeSelectWithCount,
        });

        return mapTicketTypeRow(ticketType);
    }

    async update(id: string, body: { name?: string; price?: number }) {
        await this.getDetail(id);

        const ticketType = await prisma.ticketType.update({
            where: { id },
            data: body,
            select: ticketTypeSelectWithCount,
        });

        return mapTicketTypeRow(ticketType);
    }

    async list(query: { search?: string; page: number; limit: number }) {
        const { page = 1, limit = 10, search } = query;
        const skip = (page - 1) * limit;

        const where: Record<string, unknown> = {};
        if (search) {
            where.OR = [{ name: { contains: search } }];
        }

        const [rows, total] = await Promise.all([
            prisma.ticketType.findMany({
                where,
                skip,
                take: Number(limit),
                orderBy: { name: "asc" },
                select: ticketTypeSelectWithCount,
            }),
            prisma.ticketType.count({ where }),
        ]);

        return {
            data: rows.map(mapTicketTypeRow),
            meta: getPaginationMetadata(total, page, limit),
        };
    }

    async getDetail(id: string) {
        const ticketType = await prisma.ticketType.findUnique({
            where: { id },
            select: ticketTypeSelectWithCount,
        });

        if (!ticketType) {
            throw new AppError("Ticket type not found", 404);
        }

        return mapTicketTypeRow(ticketType);
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
