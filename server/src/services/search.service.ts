import { EventStatus } from "@prisma/client";
import { AppError } from "../utils/AppError";
import { prisma } from "../utils/prisma";

class SearchService {
    async search(query: string) {
        const keyword = query.trim();

        if (!keyword) {
            throw new AppError("Search query is required", 400);
        }

        const events = await prisma.event.findMany({
            where: {
                status: EventStatus.PUBLISHED,
                OR: [
                    {
                        title: {
                            contains: keyword,
                        },
                    },
                    {
                        location: {
                            contains: keyword,
                        },
                    },
                    {
                        description: {
                            contains: keyword,
                        },
                    },
                    {
                        category: {
                            name: {
                                contains: keyword,
                            },
                        },
                    },
                    {
                        eventArtists: {
                            some: {
                                artist: {
                                    name: {
                                        contains: keyword,
                                    },
                                },
                            },
                        },
                    },
                ],
            },
            orderBy: {
                createdAt: "desc",
            },
            select: {
                id: true,
                title: true,
                slug: true,
                description: true,
                thumbnailUrl: true,
                startDate: true,
                endDate: true,
                location: true,
                category: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                    },
                },
                eventArtists: {
                    select: {
                        artist: {
                            select: {
                                id: true,
                                name: true,
                                slug: true,
                                avatarUrl: true,
                            },
                        },
                        role: true,
                    },
                },
            },
        });

        return {
            events,
        };
    }
}

export default new SearchService();
