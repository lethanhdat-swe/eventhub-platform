import { prisma } from "../utils/prisma";
import { AppError } from "../utils/AppError";

class CommentService {
    create = async (userId: string, eventId: string, data: { content: string, parentId?: string | null }) => {

        const event = await prisma.event.findUnique({ where: { id: eventId } });
        if (!event) throw new AppError("Event not found", 404);


        let rootId = null;
        if (data.parentId) {
            const parentComment = await prisma.comment.findUnique({
                where: { id: data.parentId }
            });

            if (!parentComment) throw new AppError("Parent comment not found", 404);


            if (parentComment.eventId !== eventId) {
                throw new AppError("Invalid parent comment for this event", 400);
            }


            rootId = parentComment.rootId || parentComment.id;
        }

        return await prisma.comment.create({
            data: {
                content: data.content,
                userId,
                eventId,
                parentId: data.parentId,
                rootId,
            },
            include: {
                user: { select: { id: true, fullName: true, avatarUrl: true } }
            }
        });
    };

    listByEvent = async (eventId: string, page: number, limit: number) => {
        const skip = (page - 1) * limit;

        const items = await prisma.comment.findMany({
            where: {
                eventId,
                parentId: null
            },
            skip,
            take: limit,
            orderBy: { createdAt: "desc" },
            include: {
                user: { select: { id: true, fullName: true, avatarUrl: true } },
                replies: {
                    include: {
                        user: { select: { id: true, fullName: true, avatarUrl: true } },
                        replies: {
                            include: {
                                user: { select: { id: true, fullName: true, avatarUrl: true } },
                                replies: true
                            },
                            orderBy: { createdAt: "asc" }
                        }
                    },
                    orderBy: { createdAt: "asc" }
                }
            }
        });

        const totalItems = await prisma.comment.count({ where: { eventId, parentId: null } });

        return {
            items,
            meta: {
                totalItems,
                totalPages: Math.ceil(totalItems / limit),
                currentPage: page,
                itemsPerPage: limit
            }
        };
    };

    update = async (userId: string, commentId: string, content: string) => {

        const comment = await prisma.comment.findUnique({ where: { id: commentId } });

        if (!comment) throw new AppError("Comment not found", 404);
        if (comment.userId !== userId) throw new AppError("You do not have permission to edit this comment", 403);


        return await prisma.comment.update({
            where: { id: commentId },
            data: {
                content,
                isEdited: true
            },
            include: {
                user: { select: { id: true, fullName: true, avatarUrl: true } }
            }
        });
    };

    delete = async (userId: string, commentId: string) => {

        const comment = await prisma.comment.findUnique({ where: { id: commentId } });

        if (!comment) throw new AppError("Comment not found", 404);

        if (comment.userId !== userId) {
            throw new AppError("You do not have permission to delete this comment", 403);
        }


        await prisma.comment.delete({ where: { id: commentId } });
        return true;
    };
}

export default new CommentService();