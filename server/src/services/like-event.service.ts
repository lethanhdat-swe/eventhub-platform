import { prisma } from "../utils/prisma";
import { AppError } from "../utils/AppError";

class LikeEventService {
    toggleLike = async (userId: string, eventId: string) => {
        
        const event = await prisma.event.findUnique({ where: { id: eventId } });
        if (!event) throw new AppError("Event not found", 404);

        
        const existingLike = await prisma.likeEvent.findFirst({
            where: { userId, eventId },
        });

        if (existingLike) {
            
            await prisma.likeEvent.delete({ where: { id: existingLike.id } });
            return { isLiked: false };
        } else {
         
            await prisma.likeEvent.create({
                data: { userId, eventId },
            });
            return { isLiked: true };
        }
    };

    getLikedEvents = async (userId: string, page: number, limit: number) => {
        const skip = (page - 1) * limit;

       
        const [items, totalItems] = await Promise.all([
            prisma.likeEvent.findMany({
                where: { userId },
                skip,
                take: limit,
                orderBy: { createdAt: "desc" },
                select: {
                    id: true,
                    createdAt: true,
                    event: {
                        select: {
                            id: true,
                            title: true,
                            thumbnailUrl: true,
                            startDate: true,
                            location: true,
                        },
                    },
                },
            }),
            prisma.likeEvent.count({ where: { userId } }),
        ]);

        const totalPages = Math.ceil(totalItems / limit);

        return {
            items,
            meta: {
                totalItems,
                itemCount: items.length,
                itemsPerPage: limit,
                totalPages,
                currentPage: page,
            },
        };
    };
}

export default new LikeEventService();