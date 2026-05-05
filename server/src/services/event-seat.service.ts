import { prisma } from "../utils/prisma";
import { AppError } from "../utils/AppError";
import { getPaginationMetadata } from "../utils/pagination";

class EventSeatService {
    async listByEvent(eventId: string, query: {
        page: number;
        limit: number;
        status?: string;
        ticketTypeId?: string;
    }) {
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
                    seat: true,
                    ticketType: true,
                },
                orderBy: [
                    { seat: { rowLabel: "asc" } },
                    { seat: { seatNumber: "asc" } },
                ],
            }),
            prisma.eventSeat.count({ where }),
        ]);

        return {
            data: eventSeats,
            meta: getPaginationMetadata(total, page, limit),
        };
    }

    async updateBulk(eventId: string, body: {
        ids: string[];
        status?: string;
        ticketTypeId?: string;
    }) {
        const { ids, status, ticketTypeId } = body;

        const updateData: any = {};
        if (status) updateData.status = status;
        if (ticketTypeId) updateData.ticketTypeId = ticketTypeId;

        const result = await prisma.eventSeat.updateMany({
            where: {
                id: { in: ids },
                eventId,
            },
            data: updateData,
        });

        if (result.count === 0) {
            throw new AppError("No event seats found to update", 404);
        }

        return result;
    }
}

export default new EventSeatService();
