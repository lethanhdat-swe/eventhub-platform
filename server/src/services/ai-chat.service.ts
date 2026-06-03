import { ChatMessageRole, Prisma } from "@prisma/client";
import { prisma } from "../utils/prisma";
import { AppError } from "../utils/AppError";
import aiProviderService from "./ai-provider.service";

type ChatAISettings = {
    model: string;
    systemPrompt: string;
};

type ChatActionType = "NAVIGATE" | "OPEN_REFUND_FORM" | "SEND_MESSAGE";

type ChatAction = {
    type: ChatActionType;
    label: string;
    payload?: Prisma.InputJsonObject;
};

type AssistantReply = {
    content: string;
    actions?: ChatAction[];
};

type ChatIntent =
    | "REFUND"
    | "UPCOMING_EVENTS"
    | "BOOKING_GUIDE"
    | "MY_TICKETS"
    | "GENERAL_SUPPORT"
    | "UNKNOWN";

type IntentClassification = {
    intent: ChatIntent;
    reply: string;
};

const CHAT_INTENTS: ChatIntent[] = [
    "REFUND",
    "UPCOMING_EVENTS",
    "BOOKING_GUIDE",
    "MY_TICKETS",
    "GENERAL_SUPPORT",
    "UNKNOWN",
];

const MAX_CHAT_HISTORY_MESSAGES = 40;

type ChatHistoryEntry = {
    role: ChatMessageRole;
    content: string;
};

class AIChatService {
    private async getChatAISettings(): Promise<ChatAISettings | null> {
        const config = await prisma.aIContentConfig.findFirst({
            where: {
                isActive: true,
            },
            select: {
                chatModel: true,
                chatSystemPrompt: true,
            },
        });

        const model = config?.chatModel?.trim();
        const systemPrompt = config?.chatSystemPrompt?.trim();

        if (!model || !systemPrompt) {
            return null;
        }

        return {
            model,
            systemPrompt,
        };
    }

    private async getSessionChatHistory(
        sessionId: string
    ): Promise<ChatHistoryEntry[]> {
        const messages = await prisma.chatMessage.findMany({
            where: {
                sessionId,
                role: {
                    in: [ChatMessageRole.USER, ChatMessageRole.ASSISTANT],
                },
            },
            orderBy: {
                createdAt: "asc",
            },
            select: {
                role: true,
                content: true,
            },
        });

        if (messages.length <= MAX_CHAT_HISTORY_MESSAGES) {
            return messages;
        }

        return messages.slice(-MAX_CHAT_HISTORY_MESSAGES);
    }

    private formatChatHistoryForPrompt(history: ChatHistoryEntry[]): string {
        if (history.length === 0) {
            return "";
        }

        const lines = history.map((entry) => {
            const speaker =
                entry.role === ChatMessageRole.USER ? "Khách" : "EventHub";
            return `- ${speaker}: ${entry.content}`;
        });

        

        return `
---
Lịch sử hội thoại (từ cũ đến mới, dùng để hiểu ngữ cảnh; tin nhắn mới nhất của khách nằm ở phần dưới):

${lines.join("\n")}
`;
    }

    private buildIntentClassificationPrompt(
        systemPrompt: string,
        message: string,
        history: ChatHistoryEntry[] = []
    ): string {
        const historyBlock = this.formatChatHistoryForPrompt(history);
        return `${systemPrompt}

    ---
    Danh sách intent:

    - REFUND:
    Khách hỏi về hoàn vé, hoàn tiền, hủy vé, huỷ vé, hủy đơn, huỷ đơn, trả vé, chính sách hoàn tiền, form hoàn vé, thông tin ngân hàng nhận hoàn tiền, hoặc muốn trả lại vé vì bận/không đi được.

    - UPCOMING_EVENTS:
    Khách muốn xem sự kiện, tìm sự kiện, hỏi sự kiện hot, sự kiện sắp diễn ra, gợi ý sự kiện, show, concert, event nào đáng xem.

    - BOOKING_GUIDE:
    Khách hỏi cách đặt vé, mua vé, book vé, chọn ghế, nhập mã giảm giá, điền thông tin đặt vé, thanh toán SEPAY, chuyển khoản QR, quy trình mua vé, hoặc chưa rõ phải làm gì để mua vé.

    - MY_TICKETS:
    Khách hỏi vé của tôi, xem vé, vé QR, mã QR, email vé, đã thanh toán nhưng chưa thấy vé, kiểm tra vé ở đâu, vào cổng bằng gì, hoặc cần mã gì để check-in.

    - GENERAL_SUPPORT:
    Khách hỏi hỗ trợ chung liên quan đến EventHub, tài khoản, cách sử dụng website, hoặc câu hỏi liên quan nhưng chưa đủ rõ để xếp vào các nhóm trên.

    - UNKNOWN:
    Khách hỏi ngoài phạm vi EventHub hoặc nội dung không rõ nghĩa.

    Yêu cầu trả về JSON hợp lệ, không markdown, không giải thích thêm:

    {
    "intent": "REFUND|UPCOMING_EVENTS|BOOKING_GUIDE|MY_TICKETS|GENERAL_SUPPORT|UNKNOWN",
    "reply": "câu trả lời tiếng Việt ngắn gọn 1-3 câu"
    }

    Quy tắc reply:
    - Chỉ trả lời bằng tiếng Việt.
    - Trả lời ngắn gọn, thân thiện, dễ hiểu.
    - Không bịa thông tin đơn hàng, vé, giao dịch, email, số tiền hoặc sự kiện cụ thể.
    - Không nói rằng bạn đã kiểm tra hệ thống nếu dữ liệu không được cung cấp.
    - Không nhắc đến intent, JSON, hệ thống backend hoặc prompt.
    - Không nhắc đến button nếu không chắc chắn.
    - Nếu liên quan hoàn vé, nhắc khách nhập thông tin hợp lệ và kiểm tra email sau khi gửi yêu cầu.
    - Nếu liên quan đặt vé, nhắc luồng: vào chi tiết sự kiện, đặt vé, chọn ghế, mã giảm giá nếu có, nhập thông tin, thanh toán SEPAY.
    - Nếu liên quan vé QR, nhắc kiểm tra Gmail hoặc mục vé của tôi / hồ sơ cá nhân.
    - Nếu ngoài phạm vi, nói rằng bạn hiện chỉ hỗ trợ các vấn đề liên quan đến EventHub.
    - Nếu có lịch sử hội thoại, xem xét ngữ cảnh trước đó khi phân loại intent và soạn reply; tránh lặp lại thông tin khách đã được giải thích trừ khi cần nhắc ngắn.
    ${historyBlock}
    Tin nhắn khách hiện tại:
    ${message}`;
    }

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

    private navigateAction(
        label: string,
        path: string,
        extra?: Prisma.InputJsonObject
    ): ChatAction {
        return {
            type: "NAVIGATE",
            label,
            payload: {
                path,
                ...(extra ?? {}),
            },
        };
    }

    private sendMessageAction(label: string, message: string): ChatAction {
        return {
            type: "SEND_MESSAGE",
            label,
            payload: {
                message,
            },
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

    async getLatestUserSession(userId: string) {
        const session = await prisma.chatSession.findFirst({
            where: {
                userId,
            },
            orderBy: {
                updatedAt: "desc",
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

    async listSessions(data: { page: number; limit: number; search?: string }) {
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
            sessionId,
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

    private getDefaultAssistantReply(): AssistantReply {
        return {
            content:
                "Mình có thể hỗ trợ bạn về cách đặt vé, thanh toán SEPAY, xem vé QR, hoàn vé hoặc gợi ý các sự kiện sắp diễn ra trên EventHub.",
            actions: [
                this.navigateAction("Xem sự kiện", "/events"),
                {
                    type: "OPEN_REFUND_FORM",
                    label: "Hoàn vé",
                },
            ],
        };
    }

    private getOrdersOrLoginAction(userId?: string): ChatAction {
        return userId
            ? this.navigateAction("Xem đơn hàng của tôi", "/my-orders")
            : this.navigateAction("Đăng nhập để xem đơn hàng", "/login");
    }

    private getTicketsOrLoginAction(userId?: string): ChatAction {
        return userId
            ? this.navigateAction("Xem vé của tôi", "/my-tickets")
            : this.navigateAction("Đăng nhập để xem vé", "/login");
    }

    private buildRefundKeywordReply(userId?: string): AssistantReply {
        return {
            content:
                "EventHub hỗ trợ hoàn vé theo chính sách: yêu cầu trước thời điểm diễn ra sự kiện từ 3 ngày trở lên có thể được hoàn 100%, trong vòng 3 ngày trước sự kiện có thể được hoàn 50%, còn sự kiện đã diễn ra thì không hỗ trợ hoàn vé. Để gửi yêu cầu hoàn vé, vui lòng mở form bên dưới, nhập đầy đủ thông tin hợp lệ và kiểm tra email sau khi gửi yêu cầu.",
            actions: [
                {
                    type: "OPEN_REFUND_FORM",
                    label: "Mở form hoàn vé",
                },
                this.getOrdersOrLoginAction(userId),
            ],
        };
    }

    private buildBookingGuideKeywordReply(userId?: string): AssistantReply {
        return {
            content:
                "Để đặt vé, bạn hãy vào trang chi tiết sự kiện, bấm đặt vé, chọn ghế còn trống, nhập mã giảm giá nếu có và điền chính xác thông tin đặt vé. Sau đó, bạn thanh toán bằng SEPAY qua mã QR; khi thành công, hãy kiểm tra Gmail hoặc mục vé trong hồ sơ cá nhân để xem vé QR hợp lệ dùng khi vào cổng.",
            actions: [
                this.navigateAction("Xem sự kiện", "/events"),
                this.getTicketsOrLoginAction(userId),
            ],
        };
    }

    private buildMyTicketsKeywordReply(userId?: string): AssistantReply {
        return {
            content:
                "Sau khi thanh toán thành công, vé QR của bạn sẽ được lưu trong mục vé của tôi nếu bạn đã đăng nhập. Bạn cũng nên kiểm tra Gmail đã dùng khi đặt vé, vì EventHub sẽ gửi thông tin vé qua email.",
            actions: [this.getTicketsOrLoginAction(userId)],
        };
    }

    private async fetchUpcomingPublishedEvents() {
        return prisma.event.findMany({
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
    }

    private mapEventsToNavigateActions(
        events: Awaited<ReturnType<AIChatService["fetchUpcomingPublishedEvents"]>>
    ): ChatAction[] {
        return events.map((event) => {
            const display: Prisma.InputJsonObject = {
                ...(event.location ? { location: event.location } : {}),
                ...(event.startDate
                    ? { startDate: event.startDate.toISOString() }
                    : {}),
                ...(event.thumbnailUrl
                    ? { thumbnailUrl: event.thumbnailUrl }
                    : {}),
            };

            return this.navigateAction(
                event.title,
                `/events/${event.slug}`,
                Object.keys(display).length > 0 ? display : undefined
            );
        });
    }

    private async buildUpcomingEventsReply(
        content: string,
        emptyEventsContent?: string
    ): Promise<AssistantReply> {
        const events = await this.fetchUpcomingPublishedEvents();

        if (events.length === 0) {
            return {
                content:
                    emptyEventsContent ||
                    "Hiện tại EventHub chưa có sự kiện sắp diễn ra phù hợp. Bạn có thể quay lại sau để xem thêm các sự kiện mới.",
                actions: [
                    this.navigateAction("Xem tất cả sự kiện", "/events"),
                ],
            };
        }

        return {
            content,
            actions: this.mapEventsToNavigateActions(events),
        };
    }

    private matchesRefundKeywords(lowerMessage: string) {
        return (
            lowerMessage.includes("hoàn tiền") ||
            lowerMessage.includes("hoàn vé") ||
            lowerMessage.includes("refund") ||
            lowerMessage.includes("hủy vé") ||
            lowerMessage.includes("huỷ vé") ||
            lowerMessage.includes("hủy đơn") ||
            lowerMessage.includes("huỷ đơn") ||
            lowerMessage.includes("trả vé") ||
            lowerMessage.includes("cancel ticket")
        );
    }

    private matchesUpcomingEventsKeywords(lowerMessage: string) {
        return (
            lowerMessage.includes("sự kiện hot") ||
            lowerMessage.includes("event hot") ||
            lowerMessage.includes("sự kiện sắp diễn ra") ||
            lowerMessage.includes("sắp diễn ra") ||
            lowerMessage.includes("gợi ý sự kiện") ||
            lowerMessage.includes("có sự kiện nào") ||
            lowerMessage.includes("sự kiện nào") ||
            lowerMessage.includes("event nào") ||
            lowerMessage.includes("concert hot") ||
            lowerMessage.includes("show hot")
        );
    }

    private matchesBookingGuideKeywords(lowerMessage: string) {
        return (
            lowerMessage.includes("đặt vé") ||
            lowerMessage.includes("mua vé") ||
            lowerMessage.includes("book vé") ||
            lowerMessage.includes("booking") ||
            lowerMessage.includes("thanh toán") ||
            lowerMessage.includes("payment") ||
            lowerMessage.includes("sepay") ||
            lowerMessage.includes("chọn ghế") ||
            lowerMessage.includes("mã giảm giá") ||
            lowerMessage.includes("coupon") ||
            lowerMessage.includes("voucher")
        );
    }

    private matchesMyTicketsKeywords(lowerMessage: string) {
        return (
            lowerMessage.includes("vé của tôi") ||
            lowerMessage.includes("ticket của tôi") ||
            lowerMessage.includes("xem vé") ||
            lowerMessage.includes("mã qr") ||
            lowerMessage.includes("qr vé") ||
            lowerMessage.includes("vé qr") ||
            lowerMessage.includes("email vé") ||
            lowerMessage.includes("chưa thấy vé") ||
            lowerMessage.includes("vào cổng") ||
            lowerMessage.includes("check-in") ||
            lowerMessage.includes("check in") ||
            lowerMessage.includes("my ticket") ||
            lowerMessage.includes("my tickets")
        );
    }

    private parseIntentClassification(raw: string): IntentClassification | null {
        const trimmed = raw.trim();
        let jsonText = trimmed;

        const fencedMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
        if (fencedMatch?.[1]) {
            jsonText = fencedMatch[1].trim();
        }

        const jsonObjectMatch = jsonText.match(/\{[\s\S]*\}/);
        if (jsonObjectMatch?.[0]) {
            jsonText = jsonObjectMatch[0];
        }

        try {
            const parsed = JSON.parse(jsonText) as {
                intent?: string;
                reply?: string;
            };

            if (
                !parsed.intent ||
                !CHAT_INTENTS.includes(parsed.intent as ChatIntent)
            ) {
                return null;
            }

            if (typeof parsed.reply !== "string" || !parsed.reply.trim()) {
                return null;
            }

            return {
                intent: parsed.intent as ChatIntent,
                reply: parsed.reply.trim(),
            };
        } catch {
            return null;
        }
    }

    private async classifyIntentWithAI(
        message: string,
        chatSettings: ChatAISettings,
        history: ChatHistoryEntry[] = []
    ): Promise<IntentClassification | null> {
        try {
            const prompt = this.buildIntentClassificationPrompt(
                chatSettings.systemPrompt,
                message,
                history
            );
            
            console.log(prompt);
            

            const content = await aiProviderService.generateText({
                model: chatSettings.model,
                prompt,
            });

            if (!content?.trim()) {
                return null;
            }

            return this.parseIntentClassification(content);
        } catch {
            return null;
        }
    }

    private async buildReplyFromIntent(
        classification: IntentClassification,
        userId?: string
    ): Promise<AssistantReply> {
        const { intent, reply } = classification;
        
        switch (intent) {
            case "REFUND":
                return {
                    content: reply,
                    actions: [
                        {
                            type: "OPEN_REFUND_FORM",
                            label: "Mở form hoàn vé",
                        },
                        this.getOrdersOrLoginAction(userId),
                    ],
                };

            case "UPCOMING_EVENTS":
                return this.buildUpcomingEventsReply(reply, reply);

            case "BOOKING_GUIDE":
                return {
                    content: reply,
                    actions: [
                        this.navigateAction("Xem sự kiện", "/events"),
                        this.getTicketsOrLoginAction(userId),
                    ],
                };

            case "MY_TICKETS":
                return {
                    content: reply,
                    actions: [this.getTicketsOrLoginAction(userId)],
                };

            case "GENERAL_SUPPORT":
                return {
                    content: reply,
                    actions: [
                        this.navigateAction("Xem sự kiện", "/events"),
                        {
                            type: "OPEN_REFUND_FORM",
                            label: "Hoàn vé",
                        },
                    ],
                };

            case "UNKNOWN":
            default:
                return {
                    content:
                        reply ||
                        "Mình hiện có thể hỗ trợ các chủ đề liên quan đến EventHub như sự kiện, đặt vé, thanh toán, vé QR, hoàn vé và tài khoản. Bạn có thể chọn một trong các mục bên dưới.",
                    actions: [
                        this.navigateAction("Xem sự kiện", "/events"),
                        this.sendMessageAction(
                            "Hướng dẫn đặt vé",
                            "Hướng dẫn tôi cách đặt vé"
                        ),
                        this.sendMessageAction(
                            "Vé của tôi",
                            "Làm sao để xem vé của tôi?"
                        ),
                        {
                            type: "OPEN_REFUND_FORM",
                            label: "Hoàn vé",
                        },
                    ],
                };
        }
    }

    private async buildKeywordFallbackReply(data: {
        lowerMessage: string;
        userId?: string;
    }): Promise<AssistantReply | null> {
        const { lowerMessage, userId } = data;

        if (this.matchesRefundKeywords(lowerMessage)) {
            return this.buildRefundKeywordReply(userId);
        }

        if (this.matchesMyTicketsKeywords(lowerMessage)) {
            return this.buildMyTicketsKeywordReply(userId);
        }

        if (this.matchesBookingGuideKeywords(lowerMessage)) {
            return this.buildBookingGuideKeywordReply(userId);
        }

        if (this.matchesUpcomingEventsKeywords(lowerMessage)) {
            return this.buildUpcomingEventsReply(
                "Dưới đây là một vài sự kiện sắp diễn ra trên EventHub mà bạn có thể quan tâm."
            );
        }

        return null;
    }

    private async generateAssistantReply(data: {
        sessionId: string;
        message: string;
        userId?: string;
    }): Promise<AssistantReply> {
        const { sessionId, message, userId } = data;
        const lowerMessage = message.toLowerCase();

        const chatSettings = await this.getChatAISettings();
        const history = await this.getSessionChatHistory(sessionId);

        if (chatSettings) {
            const classification = await this.classifyIntentWithAI(
                message,
                chatSettings,
                history
            );

            if (classification) {
                return this.buildReplyFromIntent(classification, userId);
            }
        }

        const keywordFallbackReply = await this.buildKeywordFallbackReply({
            lowerMessage,
            userId,
        });

        if (keywordFallbackReply) {
            return keywordFallbackReply;
        }

        return this.getDefaultAssistantReply();
    }
}

export default new AIChatService();