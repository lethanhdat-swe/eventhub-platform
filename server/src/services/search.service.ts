import { prisma } from "../utils/prisma";
import { AppError } from "../utils/AppError";

class SearchService {
    async search(
        query: string,
        options: { eventLimit: number; artistLimit: number }
    ) {
        if (!query || query.trim() === "") {
            throw new AppError("Search query is required", 400);
        }

        const { eventLimit, artistLimit } = options;

        const [events, artists] = await Promise.all([
            prisma.event.findMany({
                where: {
                    OR: [
                        { title: { contains: query } },
                        { slug: { contains: query } },
                    ],
                    status: "published", // chỉ lấy event public
                },
                take: eventLimit,
                orderBy: { createdAt: "desc" },
                select: {
                    id: true,
                    title: true,
                    slug: true,
                    thumbnailUrl: true,
                    startDate: true,
                    location: true,
                },
            }),

            prisma.artist.findMany({
                where: {
                    OR: [
                        { name: { contains: query } },
                        { slug: { contains: query } },
                    ],
                },
                take: artistLimit,
                orderBy: { createdAt: "desc" },
                select: {
                    id: true,
                    name: true,
                    slug: true,
                    avatarUrl: true,
                },
            }),
        ]);

        return {
            events,
            artists,
        };
    }
}

export default new SearchService();
