import { prisma } from "../utils/prisma";
import { AppError } from "../utils/AppError";
import { getPaginationMetadata } from "../utils/pagination";
import { buildDirectOrderBy } from "../utils/listSort";
import { DEFAULT_TICKET_COLOR, normalizeHexColor } from "../utils/hexColor";

const ticketTypeSelect = {
    id: true,
    name: true,
    price: true,
    color: true,
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
        color: normalizeHexColor((rest as { color?: string }).color),
        defaultSeatCount: _count?.defaultSeats ?? 0,
        eventSeatCount: _count?.eventSeats ?? 0,
    };
}

type CreateTicketTypeBody = {
    name: string;
    price: number;
    color?: string;
};

type UpdateTicketTypeBody = {
    name?: string;
    price?: number;
    color?: string;
};

class TicketTypeService {
    async create(body: CreateTicketTypeBody) {
        const ticketType = await prisma.ticketType.create({
            data: {
                name: body.name,
                price: body.price,
                color: normalizeHexColor(body.color ?? DEFAULT_TICKET_COLOR),
            },
            select: ticketTypeSelectWithCount,
        });

        return mapTicketTypeRow(ticketType);
    }

    async update(id: string, body: UpdateTicketTypeBody) {
        await this.getDetail(id);

        const data: UpdateTicketTypeBody = { ...body };
        if (body.color !== undefined) {
            data.color = normalizeHexColor(body.color);
        }

        const ticketType = await prisma.ticketType.update({
            where: { id },
            data,
            select: ticketTypeSelectWithCount,
        });

        return mapTicketTypeRow(ticketType);
    }

    async list(query: {
        search?: string;
        page: number;
        limit: number;
        sortBy?: string;
        sortOrder?: "asc" | "desc";
    }) {
        const { page = 1, limit = 10, search, sortBy, sortOrder } = query;
        const skip = (page - 1) * limit;

        const where: Record<string, unknown> = {};
        if (search) {
            where.OR = [{ name: { contains: search } }];
        }

        const orderBy = buildDirectOrderBy(
            sortBy,
            sortOrder,
            {
                name: "name",
                price: "price",
            },
            { name: "asc" }
        );

        const [rows, total] = await Promise.all([
            prisma.ticketType.findMany({
                where,
                skip,
                take: Number(limit),
                orderBy,
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
