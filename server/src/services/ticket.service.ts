import { prisma } from "../utils/prisma";
import { AppError } from "../utils/AppError";
import { getPaginationMetadata } from "../utils/pagination";
import { CheckInTicketInput } from "../schema/ticket-type.schema";

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

    async myTickets(userId: string) {
        const tickets = await prisma.ticket.findMany({
            where: {
                order: {
                    userId,
                    status: "PAID",
                },
            },
            select: {
                id: true,
                orderId: true,
                eventSeatId: true,
                qrSecureToken: true,
                isCheckedIn: true,
                checkedInAt: true,
                order: {
                    select: {
                        id: true,
                        orderCode: true,
                        status: true,
                        totalAmount: true,
                        paymentMethod: true,
                        createdAt: true,
                    },
                },
                eventSeat: {
                    select: {
                        rowLabel: true,
                        seatNumber: true,
                        status: true,
                        ticketType: {
                            select: {
                                id: true,
                                name: true,
                                price: true,
                                color: true,
                            },
                        },
                        event: {
                            select: {
                                id: true,
                                title: true,
                                thumbnailUrl: true,
                                startDate: true,
                                endDate: true,
                                location: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                order: {
                    createdAt: "desc",
                },
            },
        });

        return tickets.map((ticket) => ({
            ...ticket,
            order: {
                ...ticket.order,
                finalAmount: ticket.order.totalAmount,
            },
            eventSeat: {
                ...ticket.eventSeat,
                event: {
                    ...ticket.eventSeat.event,
                    bannerUrl: ticket.eventSeat.event.thumbnailUrl,
                },
            },
        }));
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

    async checkIn(data: CheckInTicketInput) {
        const { token } = data;

        const ticket = await prisma.ticket.findUnique({
            where: {
                qrSecureToken: token,
            },
            select: {
                id: true,
                isCheckedIn: true,
                checkedInAt: true,
                order: {
                    select: {
                        id: true,
                        status: true,
                        orderCode: true,
                    },
                },
                eventSeat: {
                    select: {
                        id: true,
                        rowLabel: true,
                        seatNumber: true,
                        ticketType: {
                            select: {
                                name: true,
                            },
                        },
                        event: {
                            select: {
                                id: true,
                                title: true,
                                startDate: true,
                                endDate: true,
                                location: true,
                            },
                        },
                    },
                },
            },
        });

        if (!ticket) {
            throw new AppError("Ticket not found or invalid QR token", 404);
        }

        if (ticket.order.status !== "PAID") {
            throw new AppError("Ticket order is not paid", 400);
        }

        if (ticket.isCheckedIn) {
            throw new AppError("Ticket has already been checked in", 409);
        }

        const checkedInTicket = await prisma.ticket.update({
            where: {
                id: ticket.id,
            },
            data: {
                isCheckedIn: true,
                checkedInAt: new Date(),
            },
            select: {
                id: true,
                isCheckedIn: true,
                checkedInAt: true,
                eventSeat: {
                    select: {
                        rowLabel: true,
                        seatNumber: true,
                        ticketType: {
                            select: {
                                name: true,
                            },
                        },
                        event: {
                            select: {
                                title: true,
                                location: true,
                                startDate: true,
                            },
                        },
                    },
                },
            },
        });

        return {
            id: checkedInTicket.id,
            isCheckedIn: checkedInTicket.isCheckedIn,
            checkedInAt: checkedInTicket.checkedInAt,
            seatLabel: `${checkedInTicket.eventSeat.rowLabel}-${checkedInTicket.eventSeat.seatNumber}`,
            ticketType: checkedInTicket.eventSeat.ticketType.name,
            event: checkedInTicket.eventSeat.event,
        };
    }
}

export default new TicketService();
