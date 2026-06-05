import { EventSeatStatus } from "@prisma/client";
import { prisma } from "../utils/prisma";
import { AppError } from "../utils/AppError";
import { getPaginationMetadata } from "../utils/pagination";

const MAX_ROW_SIZE = 200;

const seatInclude = {
    defaultTicketType: true,
} as const;

type CreateSeatBody = {
    rowLabel: string;
    seatNumber: number;
    defaultTicketTypeId: string;
};

type CreateSeatRowBody = {
    rowLabel: string;
    fromSeatNumber: number;
    toSeatNumber: number;
    defaultTicketTypeId: string;
};

class SeatService {
    private normalizeRowLabel(rowLabel: string) {
        return rowLabel.trim().toUpperCase();
    }

    private async assertTicketTypeExists(id: string) {
        const ticketType = await prisma.ticketType.findUnique({
            where: { id },
        });

        if (!ticketType) {
            throw new AppError("Ticket type not found", 404);
        }

        return ticketType;
    }

    async create(body: CreateSeatBody) {
        const rowLabel = this.normalizeRowLabel(body.rowLabel);
        await this.assertTicketTypeExists(body.defaultTicketTypeId);

        const duplicate = await prisma.seat.findFirst({
            where: { rowLabel, seatNumber: body.seatNumber },
        });

        if (duplicate) {
            throw new AppError(
                `Seat ${rowLabel}${body.seatNumber} already exists`,
                409
            );
        }

        return await prisma.seat.create({
            data: {
                rowLabel,
                seatNumber: body.seatNumber,
                defaultTicketTypeId: body.defaultTicketTypeId,
            },
            include: seatInclude,
        });
    }

    async createRow(body: CreateSeatRowBody) {
        const rowLabel = this.normalizeRowLabel(body.rowLabel);
        const { fromSeatNumber, toSeatNumber, defaultTicketTypeId } = body;
        const seatCount = toSeatNumber - fromSeatNumber + 1;

        if (seatCount > MAX_ROW_SIZE) {
            throw new AppError(
                `Cannot create more than ${MAX_ROW_SIZE} seats at once`,
                400
            );
        }

        await this.assertTicketTypeExists(defaultTicketTypeId);

        const existing = await prisma.seat.findMany({
            where: {
                rowLabel,
                seatNumber: { gte: fromSeatNumber, lte: toSeatNumber },
            },
            select: { seatNumber: true },
            orderBy: { seatNumber: "asc" },
        });

        if (existing.length > 0) {
            const numbers = existing.map((seat) => seat.seatNumber).join(", ");
            throw new AppError(
                `Seat(s) already exist in row ${rowLabel}: ${numbers}`,
                409
            );
        }

        const data = Array.from({ length: seatCount }, (_, index) => ({
            rowLabel,
            seatNumber: fromSeatNumber + index,
            defaultTicketTypeId,
        }));

        await prisma.seat.createMany({ data });

        return await prisma.seat.findMany({
            where: {
                rowLabel,
                seatNumber: { gte: fromSeatNumber, lte: toSeatNumber },
            },
            include: seatInclude,
            orderBy: { seatNumber: "asc" },
        });
    }

    async update(id: string, body: Partial<CreateSeatBody>) {
        await this.getDetail(id);

        const data: Partial<CreateSeatBody> = { ...body };

        if (body.rowLabel !== undefined) {
            data.rowLabel = this.normalizeRowLabel(body.rowLabel);
        }

        if (body.defaultTicketTypeId !== undefined) {
            await this.assertTicketTypeExists(body.defaultTicketTypeId);
        }

        if (data.rowLabel !== undefined || body.seatNumber !== undefined) {
            const current = await prisma.seat.findUnique({ where: { id } });
            if (!current) {
                throw new AppError("Seat not found", 404);
            }

            const rowLabel = data.rowLabel ?? current.rowLabel;
            const seatNumber = body.seatNumber ?? current.seatNumber;

            const duplicate = await prisma.seat.findFirst({
                where: {
                    rowLabel,
                    seatNumber,
                    NOT: { id },
                },
            });

            if (duplicate) {
                throw new AppError(
                    `Seat ${rowLabel}${seatNumber} already exists`,
                    409
                );
            }
        }

        return await prisma.seat.update({
            where: { id },
            data,
            include: seatInclude,
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
                include: seatInclude,
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
            include: seatInclude,
        });

        if (!seat) {
            throw new AppError("Seat not found", 404);
        }

        return seat;
    }

    async delete(ids: string[]) {
        const seats = await prisma.seat.findMany({
            where: { id: { in: ids } },
            select: { id: true },
        });

        if (seats.length === 0) {
            throw new AppError("No seats found to delete", 404);
        }

        const seatIds = seats.map((seat) => seat.id);

        const linkedEventSeats = await prisma.eventSeat.findMany({
            where: { seatId: { in: seatIds } },
            select: {
                id: true,
                status: true,
                _count: {
                    select: {
                        orderSeats: true,
                    },
                },
                ticket: {
                    select: { id: true },
                },
            },
        });

        const blockedStatuses: EventSeatStatus[] = [
            EventSeatStatus.RESERVING,
            EventSeatStatus.BOOKED,
        ];

        const inUse = linkedEventSeats.filter(
            (eventSeat) =>
                blockedStatuses.includes(eventSeat.status) ||
                eventSeat._count.orderSeats > 0 ||
                eventSeat.ticket !== null
        );

        if (inUse.length > 0) {
            throw new AppError(
                "Không thể xóa ghế đã được giữ chỗ, đặt vé hoặc liên kết với đơn hàng.",
                409
            );
        }

        await prisma.$transaction(async (tx) => {
            if (linkedEventSeats.length > 0) {
                await tx.eventSeat.deleteMany({
                    where: {
                        id: {
                            in: linkedEventSeats.map((eventSeat) => eventSeat.id),
                        },
                    },
                });
            }

            await tx.seat.deleteMany({
                where: { id: { in: seatIds } },
            });
        });

        return { count: seatIds.length };
    }
}

export default new SeatService();
