
import { prisma } from "../utils/prisma";
import { AppError } from "../utils/AppError";

class SaveEventService {
    
    toggleSave = async (userId: string, eventId: string) => {
      
        const event = await prisma.event.findUnique({ 
            where: { id: eventId } 
        });
        
        if (!event) {
            throw new AppError("Event not found", 404);
        }

       
        const existingSave = await prisma.saveEvent.findFirst({
            where: { userId, eventId },
        });

        if (existingSave) {
           
            await prisma.saveEvent.delete({ 
                where: { id: existingSave.id } 
            });
            return { isSaved: false };
        } else {
           
            await prisma.saveEvent.create({
                data: { userId, eventId },
            });
            return { isSaved: true };
        }
    };

   
    getSavedEvents = async (userId: string | null, page: number, limit: number) => {
        if (!userId) {
            return {
                items: [],
                meta: {
                    totalItems: 0,
                    itemCount: 0,
                    itemsPerPage: limit,
                    totalPages: 0,
                    currentPage: page,
                },
            };
        }

        const skip = (page - 1) * limit;

    
        const [items, totalItems] = await Promise.all([
            prisma.saveEvent.findMany({
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
            prisma.saveEvent.count({ where: { userId } }),
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

export default new SaveEventService();