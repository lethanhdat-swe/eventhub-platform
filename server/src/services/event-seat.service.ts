import { prisma } from "../utils/prisma";
import { AppError } from "../utils/AppError";
import { getPaginationMetadata } from "../utils/pagination";

class EventSeatService {
    async listByEvent(
        eventId: string,
        query: {
            page: number;
            limit: number;
            status?: string;
            ticketTypeId?: string;
        }
    ) {
        const { page = 1, limit = 100, status, ticketTypeId } = query;
        const skip = (page - 1) * limit;

        const where: any = { eventId };

        if (status) {
            where.status = status;
        }

        if (ticketTypeId) {
            where.ticketTypeId = ticketTypeId;
        }

        const [eventSeats, total] = await Promise.all([
            prisma.eventSeat.findMany({
                where,
                skip,
                take: Number(limit),
                include: {
                    ticketType: true,
                },
                orderBy: [{ rowLabel: "asc" }, { seatNumber: "asc" }],
            }),
            prisma.eventSeat.count({ where }),
        ]);

        return {
            data: eventSeats,
            meta: getPaginationMetadata(total, page, limit),
        };
    }

    async updateOne(
        eventId: string,
        seatId: string,
        body: {
            status?: string;
            ticketTypeId?: string;
        }
    ) {
        const { status, ticketTypeId } = body;

        const updateData: any = {};
        if (status) updateData.status = status;
        if (ticketTypeId) updateData.ticketTypeId = ticketTypeId;

        const existingSeat = await prisma.eventSeat.findFirst({
            where: {
                id: seatId,
                eventId,
            },
        });

        if (!existingSeat) {
            throw new AppError("Event seat not found.", 404);
        }

        return prisma.eventSeat.update({
            where: {
                id: seatId,
            },
            data: updateData,
            include: {
                ticketType: true,
            },
        });
    }

    async addRow(
        eventId: string,
        body: {
            rowLabel: string;
            seatCount: number;
            ticketTypeId: string;
        }
    ) {
        const { rowLabel, seatCount, ticketTypeId } = body;

        const existing = await prisma.eventSeat.count({
            where: { eventId, rowLabel },
        });

        if (existing > 0) {
            throw new AppError("Seat row already exists.", 400);
        }

        const seats = Array.from({ length: seatCount }, (_, index) => ({
            eventId,
            rowLabel,
            seatNumber: index + 1,
            ticketTypeId,
            status: "AVAILABLE" as const,
        }));

        await prisma.eventSeat.createMany({ data: seats });

        return seats;
    }

    async addSeat(
        eventId: string,
        body: {
            rowLabel: string;
            seatNumber: number;
            ticketTypeId: string;
            status?: string;
        }
    ) {
        const {
            rowLabel,
            seatNumber,
            ticketTypeId,
            status = "AVAILABLE",
        } = body;

        const existing = await prisma.eventSeat.findFirst({
            where: { eventId, rowLabel, seatNumber },
        });

        if (existing) {
            throw new AppError("Event seat already exists.", 400);
        }

        return prisma.eventSeat.create({
            data: {
                eventId,
                rowLabel,
                seatNumber,
                ticketTypeId,
                status: status as any,
            },
            include: {
                ticketType: true,
            },
        });
    }

    async deleteBulk(eventId: string, ids: string[]) {
        const seats = await prisma.eventSeat.findMany({
            where: {
                id: { in: ids },
                eventId,
            },
            include: {
                ticket: true,
                orderSeats: true,
            },
        });

        if (seats.length === 0) {
            throw new AppError("No event seats found to delete.", 404);
        }

        const cannotDelete = seats.some(
            (seat) => seat.ticket || seat.orderSeats.length > 0
        );

        if (cannotDelete) {
            throw new AppError(
                "Some seats already have orders or tickets and cannot be deleted.",
                409
            );
        }

        return prisma.eventSeat.deleteMany({
            where: {
                id: { in: ids },
                eventId,
            },
        });
    }
}

export default new EventSeatService();
