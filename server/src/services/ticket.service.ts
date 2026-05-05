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
    }) {
        const { page = 1, limit = 10, search, isCheckedIn } = query;
        const skip = (page - 1) * limit;

        const where: any = {};

        if (isCheckedIn !== undefined) {
            where.isCheckedIn = isCheckedIn;
        }

        if (search) {
            where.OR = [
                { qrSecureToken: { contains: search } },
                { orderId: { contains: search } },
                { eventSeatId: { contains: search } },
                {
                    order: {
                        OR: [
                            { customerEmail: { contains: search } },
                            { customerName: { contains: search } },
                            { orderCode: { contains: search } },
                        ],
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
                        },
                    },
                },
                orderBy: { id: "desc" }, // No createdAt in Ticket model, using id or could add createdAt
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
}

export default new TicketService();
