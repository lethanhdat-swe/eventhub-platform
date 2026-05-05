import { prisma } from "../utils/prisma";
import { AppError } from "../utils/AppError";
import { getPaginationMetadata } from "../utils/pagination";

const eventSelect = {
    id: true,
    title: true,
    slug: true,
    description: true,
    contentHtml: true,
    location: true,
    startDate: true,
    endDate: true,
    thumbnailUrl: true,
    status: true,
    createdAt: true,
    category: {
        select: {
            id: true,
            name: true,
        },
    },
    eventArtists: {
        select: {
            role: true,
            artist: {
                select: {
                    id: true,
                    name: true,
                    slug: true,
                    avatarUrl: true,
                },
            },
        },
    },
};

class EventService {
    async create(body: any) {
        const { artists = [], ...eventData } = body;

        return await prisma.$transaction(async (tx) => {
            // ✅ validate artist tồn tại
            if (artists.length > 0) {
                const ids = artists.map((a: any) => a.artistId);

                const found = await tx.artist.findMany({
                    where: { id: { in: ids } },
                    select: { id: true },
                });

                if (found.length !== ids.length) {
                    throw new AppError("Some artists not found", 404);
                }
            }

            // ✅ create event + artists
            const event = await tx.event.create({
                data: {
                    ...eventData,
                    eventArtists: {
                        create: artists.map((a: any) => ({
                            artistId: a.artistId,
                            role: a.role,
                        })),
                    },
                },
                select: eventSelect,
            });

            // ✅ create seats
            const masterSeats = await tx.seat.findMany({
                select: {
                    id: true,
                    defaultTicketTypeId: true,
                },
            });

            if (masterSeats.length > 0) {
                await tx.eventSeat.createMany({
                    data: masterSeats.map((seat) => ({
                        eventId: event.id,
                        seatId: seat.id,
                        ticketTypeId: seat.defaultTicketTypeId,
                        status: "AVAILABLE",
                    })),
                });
            }

            return event;
        });
    }

    async update(id: string, body: any) {
        const existing = await prisma.event.findUnique({
            where: { id },
            select: { id: true },
        });

        if (!existing) {
            throw new AppError("Event not found", 404);
        }

        const { artists, ...eventData } = body;

        return await prisma.$transaction(async (tx) => {
            // ✅ update event
            await tx.event.update({
                where: { id },
                data: eventData,
            });

            // ✅ replace artists nếu có
            if (artists) {
                const ids = artists.map((a: any) => a.artistId);

                const found = await tx.artist.findMany({
                    where: { id: { in: ids } },
                    select: { id: true },
                });

                if (found.length !== ids.length) {
                    throw new AppError("Some artists not found", 404);
                }

                // delete old
                await tx.eventArtist.deleteMany({
                    where: { eventId: id },
                });

                // insert new
                await tx.eventArtist.createMany({
                    data: artists.map((a: any) => ({
                        eventId: id,
                        artistId: a.artistId,
                        role: a.role,
                    })),
                });
            }

            // return full data
            return await tx.event.findUnique({
                where: { id },
                select: eventSelect,
            });
        });
    }

    async list(query: {
        search?: string;
        page: number;
        limit: number;
        status?: string;
        categoryId?: string;
    }) {
        const { page = 1, limit = 10, search, status, categoryId } = query;
        const skip = (page - 1) * limit;

        const where: any = {};

        if (search) {
            where.OR = [
                { title: { contains: search } },
                { slug: { contains: search } },
            ];
        }

        if (status) {
            where.status = status;
        }

        if (categoryId) {
            where.categoryId = categoryId;
        }

        const [events, total] = await Promise.all([
            prisma.event.findMany({
                where,
                skip,
                take: Number(limit),
                orderBy: { createdAt: "desc" },
                select: eventSelect,
            }),
            prisma.event.count({ where }),
        ]);

        return {
            data: events,
            meta: getPaginationMetadata(total, page, limit),
        };
    }

    async getDetail(id: string) {
        const event = await prisma.event.findUnique({
            where: { id },
            select: eventSelect,
        });

        if (!event) {
            throw new AppError("Event not found", 404);
        }

        return event;
    }

    async delete(ids: string[]) {
        const result = await prisma.event.deleteMany({
            where: {
                id: { in: ids },
            },
        });

        if (result.count === 0) {
            throw new AppError("No events found to delete", 404);
        }

        return result;
    }
}

export default new EventService();
