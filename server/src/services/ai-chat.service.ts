import { prisma } from "../utils/prisma";
import { AppError } from "../utils/AppError";
import { ChatMessageRole, ChatSessionStatus } from "@prisma/client";

type CreateSessionInput = {
    userId?: string;
    guestId?: string;
};

type GetMessagesInput = {
    sessionId: string;
    userId?: string;
    page: number;
    limit: number;
};

type SendMessageInput = {
    sessionId: string;
    userId?: string;
    message: string;
};

type ChatAction = {
    type:
        | "OPEN_REFUND_FORM"
        | "VIEW_MY_ORDERS"
        | "LOGIN"
        | "VIEW_HOT_EVENTS"
        | "VIEW_EVENT";
    label: string;
    variant?: "primary" | "secondary" | "outline";
    payload?: Record<string, unknown>;
};

type AssistantReply = {
    content: string;
    actions: ChatAction[];
};

class AIChatService {
    async createSession(input: CreateSessionInput) {
        const { userId, guestId } = input;

        if (!userId && !guestId) {
            throw new AppError("Guest ID is required for anonymous chat.", 400);
        }

        const session = await prisma.chatSession.create({
            data: {
                userId,
                guestId,
                status: ChatSessionStatus.ACTIVE,
            },
            select: {
                id: true,
                userId: true,
                guestId: true,
                status: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        return session;
    }

    async getMessages(input: GetMessagesInput) {
        const { sessionId, userId, page, limit } = input;

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
            throw new AppError("You do not have permission to view this chat session.", 403);
        }

        const skip = (page - 1) * limit;

        const [messages, totalItems] = await Promise.all([
            prisma.chatMessage.findMany({
                where: {
                    sessionId,
                },
                orderBy: {
                    createdAt: "asc",
                },
                skip,
                take: Number(limit),
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

        const totalPages = Math.ceil(totalItems / limit);

        return {
            items: messages,
            meta: {
                totalItems,
                itemCount: messages.length,
                itemsPerPage: limit,
                totalPages,
                currentPage: page,
            },
        };
    }

    async sendMessage(input: SendMessageInput) {
        const { sessionId, userId, message } = input;

        const session = await prisma.chatSession.findUnique({
            where: {
                id: sessionId,
            },
            select: {
                id: true,
                userId: true,
                guestId: true,
                status: true,
            },
        });

        if (!session) {
            throw new AppError("Chat session not found.", 404);
        }

        if (session.status === ChatSessionStatus.CLOSED) {
            throw new AppError("Chat session is closed.", 400);
        }

        if (session.userId && session.userId !== userId) {
            throw new AppError("You do not have permission to send messages in this chat session.", 403);
        }

        const assistantReply = await this.generateAssistantReply({
            message,
            userId,
        });

        const [userMessage, assistantMessage] = await prisma.$transaction([
            prisma.chatMessage.create({
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
            }),
            prisma.chatMessage.create({
                data: {
                    sessionId,
                    role: ChatMessageRole.ASSISTANT,
                    content: assistantReply.content,
                    actions: assistantReply.actions,
                },
                select: {
                    id: true,
                    role: true,
                    content: true,
                    actions: true,
                    createdAt: true,
                },
            }),
        ]);

        return {
            userMessage,
            assistantMessage,
        };
    }

    private async generateAssistantReply(input: {
        message: string;
        userId?: string;
    }): Promise<AssistantReply> {
        const normalizedMessage = input.message.toLowerCase();

        if (this.isRefundIntent(normalizedMessage)) {
            return this.generateRefundReply(input.userId);
        }

        if (this.isHotEventIntent(normalizedMessage)) {
            return this.generateHotEventReply();
        }

        return {
            content:
                "Mình có thể hỗ trợ bạn về cách đặt vé, thanh toán, nhận vé QR, chính sách hoàn tiền hoặc gợi ý sự kiện đang hot.",
            actions: [
                {
                    type: "VIEW_HOT_EVENTS",
                    label: "Xem sự kiện hot",
                    variant: "primary",
                    payload: {
                        path: "/events",
                    },
                },
                {
                    type: input.userId ? "VIEW_MY_ORDERS" : "LOGIN",
                    label: input.userId ? "Xem đơn hàng của tôi" : "Đăng nhập để xem đơn hàng",
                    variant: "secondary",
                    payload: {
                        path: input.userId ? "/my-orders" : "/login",
                    },
                },
            ],
        };
    }

    private generateRefundReply(userId?: string): AssistantReply {
        const actions: ChatAction[] = [
            {
                type: "OPEN_REFUND_FORM",
                label: "Gửi yêu cầu hoàn tiền",
                variant: "primary",
                payload: {},
            },
        ];

        if (userId) {
            actions.push({
                type: "VIEW_MY_ORDERS",
                label: "Xem đơn hàng của tôi",
                variant: "secondary",
                payload: {
                    path: "/my-orders",
                },
            });
        } else {
            actions.push({
                type: "LOGIN",
                label: "Đăng nhập để xem đơn hàng",
                variant: "secondary",
                payload: {
                    path: "/login",
                },
            });
        }

        return {
            content:
                "Bạn có thể gửi yêu cầu hoàn tiền nếu đơn hàng đủ điều kiện. Với EventHub, yêu cầu hoàn tiền sẽ được đưa vào hàng chờ để admin kiểm tra và xử lý thủ công.",
            actions,
        };
    }

    private async generateHotEventReply(): Promise<AssistantReply> {
        const events = await prisma.event.findMany({
            where: {
                status: EventStatus.PUBLISHED,
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
                thumbnailUrl: true,
                startDate: true,
                location: true,
            },
        });

        if (events.length === 0) {
            return {
                content:
                    "Hiện tại mình chưa tìm thấy sự kiện sắp diễn ra. Bạn có thể quay lại sau để xem các sự kiện mới nhất.",
                actions: [
                    {
                        type: "VIEW_HOT_EVENTS",
                        label: "Xem danh sách sự kiện",
                        variant: "primary",
                        payload: {
                            path: "/events",
                        },
                    },
                ],
            };
        }

        return {
            content:
                "Mình tìm thấy một vài sự kiện sắp diễn ra. Bạn có thể bấm vào từng sự kiện để xem chi tiết.",
            actions: events.map((event) => ({
                type: "VIEW_EVENT",
                label: event.title,
                variant: "primary",
                payload: {
                    eventId: event.id,
                    title: event.title,
                    slug: event.slug,
                    thumbnailUrl: event.thumbnailUrl,
                    startDate: event.startDate,
                    location: event.location,
                    path: `/events/${event.slug}`,
                },
            })),
        };
    }

    private isRefundIntent(message: string) {
        const keywords = [
            "hoàn tiền",
            "hoàn vé",
            "refund",
            "hủy vé",
            "huỷ vé",
            "trả tiền",
            "hủy đơn",
            "huỷ đơn",
        ];

        return keywords.some((keyword) => message.includes(keyword));
    }

    private isHotEventIntent(message: string) {
        const keywords = [
            "event hot",
            "sự kiện hot",
            "su kien hot",
            "sự kiện nổi bật",
            "event nổi bật",
            "gợi ý sự kiện",
            "co gi hay",
            "có gì hay",
            "concert hot",
            "show hot",
        ];

        return keywords.some((keyword) => message.includes(keyword));
    }
}

export default new AIChatService();