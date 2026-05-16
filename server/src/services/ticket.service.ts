import { prisma } from "../utils/prisma";
import { AppError } from "../utils/AppError";
import { getPaginationMetadata } from "../utils/pagination";

class TicketService {
    async create(body: any) {
        return await prisma.ticket.create({
            data: body,
        });
    }

    async update(id: string, body: any) {
        await this.getDetail(id);

        return await prisma.ticket.update({
            where: { id },
            data: body,
        });
    }

    async list(query: {
        search?: string;
        page: number;
        limit: number;
        isCheckedIn?: boolean;
        eventId?: string;
    }) {
        const { page = 1, limit = 10, search, isCheckedIn, eventId } = query;
        const skip = (page - 1) * limit;

        const where: Record<string, unknown> = {};

        if (isCheckedIn !== undefined) {
            where.isCheckedIn = isCheckedIn;
        }

        if (eventId) {
            where.eventSeat = { eventId };
        }

        if (search) {
            where.OR = [
                { qrSecureToken: { contains: search } },
                {
                    order: {
                        OR: [
                            { customerEmail: { contains: search } },
                            { customerName: { contains: search } },
                            { customerPhone: { contains: search } },
                            { orderCode: { contains: search } },
                        ],
                    },
                },
                {
                    eventSeat: {
                        event: {
                            title: { contains: search },
                        },
                    },
                },
            ];
        }

        const [tickets, total] = await Promise.all([
            prisma.ticket.findMany({
                where,
                skip,
                take: Number(limit),
                include: {
                    order: true,
                    eventSeat: {
                        include: {
                            event: true,
                            seat: true,
                            ticketType: true,
                        },
                    },
                },
                orderBy: { id: "desc" },
            }),
            prisma.ticket.count({ where }),
        ]);

        return {
            data: tickets,
            meta: getPaginationMetadata(total, page, limit),
        };
    }

    async getDetail(id: string) {
        const ticket = await prisma.ticket.findUnique({
            where: { id },
            include: {
                order: true,
                eventSeat: {
                    include: {
                        event: true,
                        seat: true,
                        ticketType: true,
                    },
                },
            },
        });

        if (!ticket) {
            throw new AppError("Ticket not found", 404);
        }

        return ticket;
    }

    async delete(id: string) {
        await this.getDetail(id);

        return await prisma.ticket.delete({
            where: { id },
        });
    }

    async deleteMany(ids: string[]) {
        const result = await prisma.ticket.deleteMany({
            where: { id: { in: ids } },
        });

        if (result.count === 0) {
            throw new AppError("No tickets found to delete", 404);
        }

        return result;
    }
}

export default new TicketService();
