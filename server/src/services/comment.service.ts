import { Comment } from "@prisma/client";
import { prisma } from "../utils/prisma";
import { AppError } from "../utils/AppError";

type CommentUser = {
    id: string;
    fullName: string;
    avatarUrl: string | null;
};

type CommentWithRelations = Comment & {
    user: CommentUser;
    replies?: CommentWithRelations[];
};

type FormattedComment = Omit<Comment, "imageUrls"> & {
    imageUrls: string[];
    user: CommentUser;
    replies: FormattedComment[];
};

type CreateCommentData = {
    content: string;
    parentId?: string | null;
    rating?: number | null;
    imageUrls?: string[];
};

type UpdateCommentData = {
    content?: string;
    rating?: number | null;
    imageUrls?: string[];
};

class CommentService {
    private parseImageUrls(imageUrls?: string | null): string[] {
        if (!imageUrls) return [];

        try {
            const parsed = JSON.parse(imageUrls);
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    }

    private stringifyImageUrls(imageUrls?: string[]): string | null {
        if (!imageUrls || imageUrls.length === 0) return null;
        return JSON.stringify(imageUrls);
    }

    private formatComment(comment: CommentWithRelations): FormattedComment {
        return {
            ...comment,
            imageUrls: this.parseImageUrls(comment.imageUrls),
            replies:
                comment.replies?.map((reply) => this.formatComment(reply)) ??
                [],
        };
    }

    create = async (
        userId: string,
        eventId: string,
        data: CreateCommentData
    ) => {
        const event = await prisma.event.findUnique({
            where: { id: eventId },
            select: { id: true },
        });

        if (!event) {
            throw new AppError("Event not found", 404);
        }

        const imageUrls = data.imageUrls ?? [];
        let rootId: string | null = null;

        if (data.parentId) {
            const parentComment = await prisma.comment.findUnique({
                where: { id: data.parentId },
                select: {
                    id: true,
                    eventId: true,
                    rootId: true,
                },
            });

            if (!parentComment) {
                throw new AppError("Parent comment not found", 404);
            }

            if (parentComment.eventId !== eventId) {
                throw new AppError(
                    "Invalid parent comment for this event",
                    400
                );
            }

            if (data.rating !== null && data.rating !== undefined) {
                throw new AppError("Replies cannot have rating", 400);
            }

            if (imageUrls.length > 0) {
                throw new AppError("Replies cannot have images", 400);
            }

            rootId = parentComment.rootId || parentComment.id;
        }

        const comment = await prisma.comment.create({
            data: {
                content: data.content,
                userId,
                eventId,
                parentId: data.parentId ?? null,
                rootId,
                rating: data.parentId ? null : (data.rating ?? null),
                imageUrls: data.parentId
                    ? null
                    : this.stringifyImageUrls(imageUrls),
            },
            include: {
                user: {
                    select: {
                        id: true,
                        fullName: true,
                        avatarUrl: true,
                    },
                },
                replies: true,
            },
        });

        return this.formatComment(comment as CommentWithRelations);
    };

    listByEvent = async (eventId: string, page: number, limit: number) => {
        const event = await prisma.event.findUnique({
            where: { id: eventId },
            select: { id: true },
        });

        if (!event) {
            throw new AppError("Event not found", 404);
        }

        const skip = (page - 1) * limit;

        const [items, totalItems] = await Promise.all([
            prisma.comment.findMany({
                where: {
                    eventId,
                    parentId: null,
                },
                skip,
                take: Number(limit),
                orderBy: {
                    createdAt: "desc",
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            fullName: true,
                            avatarUrl: true,
                        },
                    },
                    replies: {
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    fullName: true,
                                    avatarUrl: true,
                                },
                            },
                            replies: {
                                include: {
                                    user: {
                                        select: {
                                            id: true,
                                            fullName: true,
                                            avatarUrl: true,
                                        },
                                    },
                                    replies: {
                                        include: {
                                            user: {
                                                select: {
                                                    id: true,
                                                    fullName: true,
                                                    avatarUrl: true,
                                                },
                                            },
                                        },
                                        orderBy: {
                                            createdAt: "asc",
                                        },
                                    },
                                },
                                orderBy: {
                                    createdAt: "asc",
                                },
                            },
                        },
                        orderBy: {
                            createdAt: "asc",
                        },
                    },
                },
            }),
            prisma.comment.count({
                where: {
                    eventId,
                    parentId: null,
                },
            }),
        ]);

        const formattedItems = items.map((item) =>
            this.formatComment(item as CommentWithRelations)
        );

        return {
            items: formattedItems,
            meta: {
                totalItems,
                itemCount: formattedItems.length,
                itemsPerPage: limit,
                totalPages: Math.ceil(totalItems / limit),
                currentPage: page,
            },
        };
    };

    update = async (
        userId: string,
        commentId: string,
        data: UpdateCommentData
    ) => {
        const comment = await prisma.comment.findUnique({
            where: { id: commentId },
            select: {
                id: true,
                userId: true,
                parentId: true,
            },
        });

        if (!comment) {
            throw new AppError("Comment not found", 404);
        }

        if (comment.userId !== userId) {
            throw new AppError(
                "You do not have permission to edit this comment",
                403
            );
        }

        const imageUrls = data.imageUrls ?? [];

        if (comment.parentId) {
            if (data.rating !== null && data.rating !== undefined) {
                throw new AppError("Replies cannot have rating", 400);
            }

            if (imageUrls.length > 0) {
                throw new AppError("Replies cannot have images", 400);
            }
        }

        const updatedComment = await prisma.comment.update({
            where: { id: commentId },
            data: {
                ...(data.content !== undefined && {
                    content: data.content,
                }),
                ...(!comment.parentId &&
                    data.rating !== undefined && {
                        rating: data.rating,
                    }),
                ...(!comment.parentId &&
                    data.imageUrls !== undefined && {
                        imageUrls: this.stringifyImageUrls(imageUrls),
                    }),
                isEdited: true,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        fullName: true,
                        avatarUrl: true,
                    },
                },
                replies: true,
            },
        });

        return this.formatComment(updatedComment as CommentWithRelations);
    };

    delete = async (userId: string, commentId: string) => {
        const comment = await prisma.comment.findUnique({
            where: { id: commentId },
            select: {
                id: true,
                userId: true,
            },
        });

        if (!comment) {
            throw new AppError("Comment not found", 404);
        }

        if (comment.userId !== userId) {
            throw new AppError(
                "You do not have permission to delete this comment",
                403
            );
        }

        await prisma.comment.delete({
            where: { id: commentId },
        });

        return true;
    };
}

export default new CommentService();
