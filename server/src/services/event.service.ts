import { prisma } from "../utils/prisma";
import { AppError } from "../utils/AppError";
import { getPaginationMetadata } from "../utils/pagination";
import { EventSeatStatus } from "@prisma/client";

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
    updatedAt: true,
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
                        status: EventSeatStatus.AVAILABLE,
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
        categoryIds?: string[];
        fromDate?: Date;
        toDate?: Date;
        sort?: "featured" | "new" | "upcoming";
    }) {
        const {
            page = 1,
            limit = 10,
            search,
            status,
            categoryId,
            categoryIds,
            fromDate,
            toDate,
            sort = "featured",
        } = query;

        const normalizedCategoryIds = Array.isArray(categoryIds)
            ? categoryIds
            : typeof categoryIds === "string"
              ? categoryIds
                    .split(",")
                    .map((id) => id.trim())
                    .filter(Boolean)
              : [];

        const skip = (page - 1) * limit;

        const where: any = {};

        if (search) {
            where.OR = [{ title: { contains: search } }];
        }

        if (status) {
            where.status = status;
        }

        if (normalizedCategoryIds.length) {
            where.categoryId = {
                in: normalizedCategoryIds,
            };
        } else if (categoryId) {
            where.categoryId = categoryId;
        }

        if (fromDate || toDate) {
            where.startDate = {};

            if (fromDate) {
                where.startDate.gte = fromDate;
            }

            if (toDate) {
                where.startDate.lte = toDate;
            }
        }

        const orderBy =
            sort === "new"
                ? { createdAt: "desc" as const }
                : { startDate: "asc" as const };

        if (sort === "upcoming") {
            where.startDate = {
                ...(where.startDate || {}),
                gte: new Date(),
            };
        }

        const [events, total] = await Promise.all([
            prisma.event.findMany({
                where,
                skip,
                take: Number(limit),
                orderBy,
                select: eventSelect,
            }),
            prisma.event.count({ where }),
        ]);

        return {
            data: events,
            meta: getPaginationMetadata(total, page, limit),
        };
    }

    async getRelatedEvents(eventId: string) {
        const currentEvent = await prisma.event.findUnique({
            where: { id: eventId },
            select: {
                id: true,
                categoryId: true,
            },
        });

        if (!currentEvent) {
            throw new AppError("Event not found.", 404);
        }

        const relatedEvents = await prisma.event.findMany({
            where: {
                id: {
                    not: eventId,
                },
                status: "PUBLISHED",
                categoryId: currentEvent.categoryId,
            },
            take: 4,
            orderBy: {
                startDate: "asc",
            },
            select: eventSelect,
        });

        if (relatedEvents.length >= 4) {
            return relatedEvents;
        }

        const existingIds = relatedEvents.map((event) => event.id);

        const fallbackEvents = await prisma.event.findMany({
            where: {
                id: {
                    notIn: [eventId, ...existingIds],
                },
                status: "PUBLISHED",
            },
            take: 4 - relatedEvents.length,
            orderBy: {
                startDate: "asc",
            },
            select: eventSelect,
        });

        return [...relatedEvents, ...fallbackEvents];
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

    async getDetailBySlug(slug: string) {
        const event = await prisma.event.findUnique({
            where: { slug },
            select: eventSelect,
        });

        if (!event) {
            throw new AppError("Event not found", 404);
        }

        return event;
    }

    async getTrendingEvents() {
        const events = await prisma.event.findMany({
            where: {
                status: "PUBLISHED",
            },
            take: 30,
            orderBy: {
                createdAt: "desc",
            },
            select: {
                ...eventSelect,
                _count: {
                    select: {
                        likedByUsers: true,
                        savedByUsers: true,
                        comments: true,
                    },
                },
            },
        });

        const eventIds = events.map((event) => event.id);

        const tickets = await prisma.ticket.findMany({
            where: {
                order: {
                    status: "PAID",
                },
                eventSeat: {
                    eventId: {
                        in: eventIds,
                    },
                },
            },
            select: {
                id: true,
                eventSeat: {
                    select: {
                        eventId: true,
                    },
                },
            },
        });

        const paidTicketCountByEvent = new Map<string, number>();

        tickets.forEach((ticket) => {
            const eventId = ticket.eventSeat.eventId;

            paidTicketCountByEvent.set(
                eventId,
                (paidTicketCountByEvent.get(eventId) || 0) + 1
            );
        });

        return events
            .map((event) => {
                const paidTicketCount =
                    paidTicketCountByEvent.get(event.id) || 0;
                const likeCount = event._count.likedByUsers;
                const saveCount = event._count.savedByUsers;
                const commentCount = event._count.comments;

                const trendingScore =
                    paidTicketCount * 5 +
                    likeCount * 3 +
                    saveCount * 2 +
                    commentCount;

                return {
                    ...event,
                    paidTicketCount,
                    likeCount,
                    saveCount,
                    commentCount,
                    trendingScore,
                };
            })
            .sort((a, b) => b.trendingScore - a.trendingScore)
            .slice(0, 6);
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
