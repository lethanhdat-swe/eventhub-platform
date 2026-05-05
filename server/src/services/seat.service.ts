import { prisma } from "../utils/prisma";
import { AppError } from "../utils/AppError";
import { getPaginationMetadata } from "../utils/pagination";

class SeatService {
    async create(body: any) {
        return await prisma.seat.create({
            data: body,
        });
    }

    async update(id: string, body: any) {
        await this.getDetail(id);

        return await prisma.seat.update({
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
                { rowLabel: { contains: search } },
            ];
        }

        const [seats, total] = await Promise.all([
            prisma.seat.findMany({
                where,
                skip,
                take: Number(limit),
                include: {
                    defaultTicketType: true,
                },
                orderBy: [
                    { rowLabel: "asc" },
                    { seatNumber: "asc" },
                ],
            }),
            prisma.seat.count({ where }),
        ]);

        return {
            data: seats,
            meta: getPaginationMetadata(total, page, limit),
        };
    }

    async getDetail(id: string) {
        const seat = await prisma.seat.findUnique({
            where: { id },
            include: {
                defaultTicketType: true,
            },
        });

        if (!seat) {
            throw new AppError("Seat not found", 404);
        }

        return seat;
    }

    async delete(ids: string[]) {
        const result = await prisma.seat.deleteMany({
            where: {
                id: { in: ids },
            },
        });

        if (result.count === 0) {
            throw new AppError("No seats found to delete", 404);
        }

        return result;
    }
}

export default new SeatService();
