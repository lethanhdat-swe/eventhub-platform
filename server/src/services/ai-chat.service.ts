import { ChatMessageRole, Prisma } from "@prisma/client";
import { prisma } from "../utils/prisma";
import { AppError } from "../utils/AppError";

type ChatAction = {
    type: string;
    label: string;
    payload?: Prisma.InputJsonObject;
};

type AssistantReply = {
    content: string;
    actions?: ChatAction[];
};

class AIChatService {
    private buildActionsJson(
        actions?: ChatAction[]
    ): Prisma.InputJsonObject | undefined {
        if (!actions || actions.length === 0) {
            return undefined;
        }

        return {
            items: actions.map((action) => ({
                type: action.type,
                label: action.label,
                ...(action.payload ? { payload: action.payload } : {}),
            })),
        };
    }

    async createSession(data: { userId?: string; guestId?: string }) {
        const { userId, guestId } = data;

        if (!userId && !guestId) {
            throw new AppError("Guest ID is required.", 400);
        }

        const session = await prisma.chatSession.create({
            data: {
                userId: userId || null,
                guestId: userId ? null : guestId,
            },
            select: {
                id: true,
                userId: true,
                guestId: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        return session;
    }

    async listSessions(data: {
        page: number;
        limit: number;
        search?: string;
    }) {
        const { page, limit, search } = data;

        const skip = (page - 1) * limit;

        const where: Prisma.ChatSessionWhereInput = {
            ...(search && {
                OR: [
                    {
                        guestId: {
                            contains: search,
                        },
                    },
                    {
                        user: {
                            fullName: {
                                contains: search,
                            },
                        },
                    },
                    {
                        user: {
                            email: {
                                contains: search,
                            },
                        },
                    },
                ],
            }),
        };

        const [sessions, totalItems] = await Promise.all([
            prisma.chatSession.findMany({
                where,
                skip,
                take: Number(limit),
                orderBy: {
                    updatedAt: "desc",
                },
                select: {
                    id: true,
                    userId: true,
                    guestId: true,
                    createdAt: true,
                    updatedAt: true,

                    user: {
                        select: {
                            id: true,
                            fullName: true,
                            email: true,
                            avatarUrl: true,
                        },
                    },

                    messages: {
                        orderBy: {
                            createdAt: "desc",
                        },
                        take: 1,
                        select: {
                            id: true,
                            role: true,
                            content: true,
                            createdAt: true,
                        },
                    },

                    _count: {
                        select: {
                            messages: true,
                        },
                    },
                },
            }),

            prisma.chatSession.count({ where }),
        ]);

        const items = sessions.map((session) => ({
            id: session.id,
            userId: session.userId,
            guestId: session.guestId,
            user: session.user,
            lastMessage: session.messages[0] || null,
            messageCount: session._count.messages,
            createdAt: session.createdAt,
            updatedAt: session.updatedAt,
        }));

        return {
            items,
            meta: {
                totalItems,
                itemCount: items.length,
                itemsPerPage: limit,
                totalPages: Math.ceil(totalItems / limit),
                currentPage: page,
            },
        };
    }

    async getMessages(data: {
        sessionId: string;
        userId?: string;
        guestId?: string;
        page: number;
        limit: number;
        isAdmin?: boolean;
    }) {
        const { sessionId, userId, guestId, page, limit, isAdmin } = data;

        const session = await prisma.chatSession.findUnique({
            where: {
                id: sessionId,
            },
            select: {
                id: true,
                userId: true,
                guestId: true,
            },
        });

        if (!session) {
            throw new AppError("Chat session not found.", 404);
        }

        if (!isAdmin) {
            if (session.userId && session.userId !== userId) {
                throw new AppError(
                    "You do not have access to this chat session.",
                    403
                );
            }

            if (session.guestId && session.guestId !== guestId) {
                throw new AppError(
                    "You do not have access to this chat session.",
                    403
                );
            }
        }

        const skip = (page - 1) * limit;

        const [messages, totalItems] = await Promise.all([
            prisma.chatMessage.findMany({
                where: {
                    sessionId,
                },
                skip,
                take: Number(limit),
                orderBy: {
                    createdAt: "asc",
                },
                select: {
                    id: true,
                    role: true,
                    content: true,
                    actions: true,
                    createdAt: true,
                },
            }),

            prisma.chatMessage.count({
                where: {
                    sessionId,
                },
            }),
        ]);

        return {
            items: messages,
            meta: {
                totalItems,
                itemCount: messages.length,
                itemsPerPage: limit,
                totalPages: Math.ceil(totalItems / limit),
                currentPage: page,
            },
        };
    }

    async sendMessage(data: {
        sessionId: string;
        userId?: string;
        guestId?: string;
        message: string;
    }) {
        const { sessionId, userId, guestId, message } = data;

        const session = await prisma.chatSession.findUnique({
            where: {
                id: sessionId,
            },
            select: {
                id: true,
                userId: true,
                guestId: true,
            },
        });

        if (!session) {
            throw new AppError("Chat session not found.", 404);
        }

        if (session.userId && session.userId !== userId) {
            throw new AppError(
                "You do not have access to this chat session.",
                403
            );
        }

        if (session.guestId && session.guestId !== guestId) {
            throw new AppError(
                "You do not have access to this chat session.",
                403
            );
        }

        const assistantReply = await this.generateAssistantReply({
            message,
            userId,
        });

        const result = await prisma.$transaction(async (tx) => {
            const userMessage = await tx.chatMessage.create({
                data: {
                    sessionId,
                    role: ChatMessageRole.USER,
                    content: message,
                },
                select: {
                    id: true,
                    role: true,
                    content: true,
                    actions: true,
                    createdAt: true,
                },
            });

            const assistantMessage = await tx.chatMessage.create({
                data: {
                    sessionId,
                    role: ChatMessageRole.ASSISTANT,
                    content: assistantReply.content,
                    actions: this.buildActionsJson(assistantReply.actions),
                },
                select: {
                    id: true,
                    role: true,
                    content: true,
                    actions: true,
                    createdAt: true,
                },
            });

            await tx.chatSession.update({
                where: {
                    id: sessionId,
                },
                data: {
                    updatedAt: new Date(),
                },
            });

            return {
                userMessage,
                assistantMessage,
            };
        });

        return result;
    }

    private async generateAssistantReply(data: {
        message: string;
        userId?: string;
    }): Promise<AssistantReply> {
        const { message, userId } = data;

        const lowerMessage = message.toLowerCase();

        if (
            lowerMessage.includes("hoàn tiền") ||
            lowerMessage.includes("hoàn vé") ||
            lowerMessage.includes("refund") ||
            lowerMessage.includes("hủy vé") ||
            lowerMessage.includes("huỷ vé") ||
            lowerMessage.includes("hủy đơn") ||
            lowerMessage.includes("huỷ đơn") ||
            lowerMessage.includes("trả vé") ||
            lowerMessage.includes("cancel ticket")
        ) {
            return {
                content:
                    "EventHub hỗ trợ hoàn vé theo chính sách: nếu yêu cầu hoàn vé trước thời điểm diễn ra sự kiện từ 3 ngày trở lên, bạn có thể được hoàn 100%. Nếu yêu cầu trong vòng 3 ngày trước sự kiện, bạn có thể được hoàn 50%. Nếu sự kiện đã diễn ra, hệ thống không hỗ trợ hoàn vé.",
                actions: [
                    {
                        type: "OPEN_REFUND_FORM",
                        label: "Mở form hoàn vé",
                    },
                    userId
                        ? {
                              type: "VIEW_MY_ORDERS",
                              label: "Xem đơn hàng của tôi",
                          }
                        : {
                              type: "LOGIN",
                              label: "Đăng nhập để xem đơn hàng",
                          },
                ],
            };
        }

        if (
            lowerMessage.includes("sự kiện hot") ||
            lowerMessage.includes("event hot") ||
            lowerMessage.includes("sự kiện sắp diễn ra") ||
            lowerMessage.includes("sắp diễn ra") ||
            lowerMessage.includes("gợi ý sự kiện") ||
            lowerMessage.includes("concert hot") ||
            lowerMessage.includes("show hot") ||
            lowerMessage.includes("event") ||
            lowerMessage.includes("sự kiện")
        ) {
            const events = await prisma.event.findMany({
                where: {
                    status: "PUBLISHED",
                    startDate: {
                        gte: new Date(),
                    },
                },
                orderBy: {
                    startDate: "asc",
                },
                take: 3,
                select: {
                    id: true,
                    title: true,
                    slug: true,
                    location: true,
                    startDate: true,
                    thumbnailUrl: true,
                },
            });

            if (events.length === 0) {
                return {
                    content:
                        "Hiện tại EventHub chưa có sự kiện sắp diễn ra phù hợp. Bạn có thể quay lại sau để xem thêm các sự kiện mới.",
                    actions: [
                        {
                            type: "VIEW_EVENTS",
                            label: "Xem tất cả sự kiện",
                        },
                    ],
                };
            }

            return {
                content:
                    "Dưới đây là một vài sự kiện sắp diễn ra trên EventHub mà bạn có thể quan tâm.",
                actions: events.map((event) => ({
                    type: "VIEW_EVENT",
                    label: event.title,
                    payload: {
                        eventId: event.id,
                        slug: event.slug,
                        location: event.location,
                        startDate: event.startDate?.toISOString(),
                        ...(event.thumbnailUrl
                            ? { thumbnailUrl: event.thumbnailUrl }
                            : {}),
                    },
                })),
            };
        }

        if (
            lowerMessage.includes("đặt vé") ||
            lowerMessage.includes("mua vé") ||
            lowerMessage.includes("book vé") ||
            lowerMessage.includes("booking") ||
            lowerMessage.includes("thanh toán") ||
            lowerMessage.includes("payment") ||
            lowerMessage.includes("qr") ||
            lowerMessage.includes("chọn ghế")
        ) {
            return {
                content:
                    "Để đặt vé, bạn vào trang chi tiết sự kiện, chọn ghế còn trống, điền thông tin đặt vé và thanh toán bằng mã QR. Sau khi thanh toán thành công, vé QR sẽ xuất hiện trong mục vé của bạn và được gửi qua email.",
                actions: [
                    {
                        type: "VIEW_EVENTS",
                        label: "Xem sự kiện",
                    },
                    userId
                        ? {
                              type: "VIEW_MY_TICKETS",
                              label: "Xem vé của tôi",
                          }
                        : {
                              type: "LOGIN",
                              label: "Đăng nhập để xem vé",
                          }
                ],
            };
        }

        if (
            lowerMessage.includes("vé của tôi") ||
            lowerMessage.includes("ticket của tôi") ||
            lowerMessage.includes("xem vé") ||
            lowerMessage.includes("mã qr") ||
            lowerMessage.includes("qr vé") ||
            lowerMessage.includes("my ticket") ||
            lowerMessage.includes("my tickets")
        ) {
            return {
                content:
                    "Sau khi thanh toán thành công, vé QR của bạn sẽ được lưu trong mục vé của tôi. Bạn cũng có thể kiểm tra email đã dùng khi đặt vé để xem thông tin vé.",
                actions: [
                    userId
                        ? {
                              type: "VIEW_MY_TICKETS",
                              label: "Xem vé của tôi",
                          }
                        : {
                              type: "LOGIN",
                              label: "Đăng nhập để xem vé",
                          },
                ],
            };
        }

        return {
            content:
                "Mình có thể hỗ trợ bạn về cách đặt vé, thanh toán, xem vé QR, hoàn vé hoặc gợi ý các sự kiện sắp diễn ra trên EventHub.",
            actions: [
                {
                    type: "VIEW_EVENTS",
                    label: "Xem sự kiện",
                },
                {
                    type: "OPEN_REFUND_FORM",
                    label: "Hoàn vé",
                },
            ],
        };
    }
}

export default new AIChatService();