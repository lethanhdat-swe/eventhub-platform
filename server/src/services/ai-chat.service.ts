import { ChatMessageRole, ChatSessionStatus, Prisma } from "@prisma/client";
import {
    emitAdminChatSessionUpdated,
    emitChatMessageCreated,
    emitChatSessionUpdated,
    ChatMessagePayload,
} from "../socket/emitters/chat.emitters";
import { prisma } from "../utils/prisma";
import { AppError } from "../utils/AppError";
import aiProviderService from "./ai-provider.service";

type ChatAISettings = {
    model: string;
    systemPrompt: string;
};

type ChatActionType =
    | "NAVIGATE"
    | "OPEN_REFUND_LOOKUP_FORM"
    | "OPEN_REFUND_FORM"
    | "SEND_MESSAGE"
    | "SHOW_BOOKING_GUIDE_FLOW";

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
    | "REFUND_LOOKUP"
    | "BOOKING_GUIDE"
    | "MY_TICKETS"
    | "REQUEST_ADMIN_SUPPORT"
    | "UNKNOWN";

type IntentClassification = {
    intent: ChatIntent;
    reply: string;
};

const CHAT_INTENTS: ChatIntent[] = [
    "REFUND",
    "REFUND_LOOKUP",
    "BOOKING_GUIDE",
    "MY_TICKETS",
    "REQUEST_ADMIN_SUPPORT",
    "UNKNOWN",
];

const MAX_CHAT_HISTORY_MESSAGES = 40;

const ADMIN_TRANSFER_USER_MESSAGE =
    "Mình đã chuyển cuộc trò chuyện này sang admin hỗ trợ. Bạn vui lòng chờ một chút, admin sẽ phản hồi sớm nhất có thể.";

const ADMIN_MANUAL_TRANSFER_SYSTEM =
    "Cuộc trò chuyện đã được chuyển sang admin hỗ trợ.";

const BACK_TO_AI_SYSTEM =
    "Cuộc trò chuyện đã quay lại chế độ hỗ trợ tự động bởi EventHub AI.";

const CHAT_MESSAGE_SELECT = {
    id: true,
    role: true,
    content: true,
    actions: true,
    createdAt: true,
} as const;

const CHAT_SESSION_SELECT = {
    id: true,
    userId: true,
    guestId: true,
    status: true,
    createdAt: true,
    updatedAt: true,
} as const;

type ChatHistoryEntry = {
    role: ChatMessageRole;
    content: string;
};

type ChatMessageRecord = {
    id: string;
    role: ChatMessageRole;
    content: string;
    actions: Prisma.JsonValue;
    createdAt: Date;
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
${historyBlock}
   ---
    Yêu cầu trả về JSON hợp lệ, không markdown, không giải thích thêm:

    {
    "intent": "REFUND|REFUND_LOOKUP|BOOKING_GUIDE|MY_TICKETS|REQUEST_ADMIN_SUPPORT|UNKNOWN",
    "reply": "câu trả lời tiếng Việt tự nhiên, lịch sự, vui vẻ, rõ ràng; phải đầy đủ nghiệp vụ bắt buộc của intent, không trả lời cụt hoặc chung chung"
    }

    Quy tắc phân loại REQUEST_ADMIN_SUPPORT:
    - Chọn REQUEST_ADMIN_SUPPORT khi khách muốn gặp người thật, admin, nhân viên hỗ trợ hoặc support thay vì AI.
    - Ví dụ: "tôi muốn gặp admin", "cho tôi gặp người thật", "tôi muốn nhân viên hỗ trợ", "AI không giúp được", "cho tôi nói chuyện với support", "tôi cần hỗ trợ viên", "gọi admin giúp tôi", "tôi muốn được người thật trả lời".
    - Với REQUEST_ADMIN_SUPPORT, reply có thể ngắn gọn vì hệ thống sẽ chuyển sang admin.

    Quy tắc reply:
    - Chỉ trả lời bằng tiếng Việt.
    - Trả lời tự nhiên, thân thiện, dễ hiểu và đủ ý theo nghiệp vụ của intent.
    - Không trả lời quá cụt, không bỏ sót các ý bắt buộc đã nêu trong system prompt.
    - Ưu tiên trả lời đầy đủ thông tin quan trọng hơn là quá ngắn.
    - Có thể trả lời 3-6 câu nếu intent cần giải thích rõ.
    - Không bịa thông tin đơn hàng, vé, giao dịch, email, số tiền hoặc sự kiện cụ thể.
    - Không nói rằng bạn đã kiểm tra hệ thống nếu dữ liệu không được cung cấp.
    - Không nhắc đến intent, JSON, hệ thống backend hoặc prompt.
    - Không nhắc đến button nếu không chắc chắn.
    - Nếu có lịch sử hội thoại, xem xét ngữ cảnh trước đó khi phân loại intent và soạn reply; chỉ tránh lặp lại dài dòng, không được bỏ sót nghiệp vụ quan trọng.
   
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

    private validateSessionAccess(
        session: {
            userId: string | null;
            guestId: string | null;
        },
        userId?: string,
        guestId?: string
    ) {
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

    private validateStatusTransition(
        currentStatus: ChatSessionStatus,
        targetStatus: ChatSessionStatus
    ) {
        if (currentStatus === targetStatus) {
            return;
        }

        const allowedTransitions: Record<
            ChatSessionStatus,
            ChatSessionStatus[]
        > = {
            [ChatSessionStatus.ACTIVE]: [
                ChatSessionStatus.WAITING_ADMIN,
                ChatSessionStatus.CLOSED,
            ],
            [ChatSessionStatus.WAITING_ADMIN]: [
                ChatSessionStatus.ACTIVE,
                ChatSessionStatus.CLOSED,
            ],
            [ChatSessionStatus.ASSIGNED]: [
                ChatSessionStatus.ACTIVE,
                ChatSessionStatus.CLOSED,
            ],
            [ChatSessionStatus.CLOSED]: [
                ChatSessionStatus.ACTIVE,
                ChatSessionStatus.WAITING_ADMIN,
            ],
        };

        const allowed = allowedTransitions[currentStatus] ?? [];

        if (!allowed.includes(targetStatus)) {
            throw new AppError(
                `Cannot change chat session status from ${currentStatus} to ${targetStatus}.`,
                400
            );
        }
    }

    private getSystemMessageForStatusChange(
        targetStatus: ChatSessionStatus
    ): string | null {
        if (targetStatus === ChatSessionStatus.WAITING_ADMIN) {
            return ADMIN_MANUAL_TRANSFER_SYSTEM;
        }

        if (targetStatus === ChatSessionStatus.ACTIVE) {
            return BACK_TO_AI_SYSTEM;
        }

        return null;
    }

    private toChatMessagePayload(
        message: ChatMessageRecord
    ): ChatMessagePayload {
        return {
            id: message.id,
            role: message.role,
            content: message.content,
            actions: message.actions,
            createdAt: message.createdAt,
        };
    }

    private publishChatMessageCreated(
        sessionId: string,
        message: ChatMessageRecord,
        status: ChatSessionStatus,
        updatedAt: Date
    ) {
        emitChatMessageCreated(sessionId, {
            sessionId,
            message: this.toChatMessagePayload(message),
            status,
            updatedAt,
        });
    }

    private publishChatSessionUpdated(
        sessionId: string,
        status: ChatSessionStatus,
        updatedAt: Date
    ) {
        emitChatSessionUpdated(sessionId, {
            sessionId,
            status,
            updatedAt,
        });
    }

    private async buildAdminRealtimeSessionPayload(
        sessionId: string,
        lastMessage?: ChatMessageRecord | null
    ) {
        const session = await prisma.chatSession.findUnique({
            where: {
                id: sessionId,
            },
            select: {
                ...CHAT_SESSION_SELECT,
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
                    select: CHAT_MESSAGE_SELECT,
                },
                _count: {
                    select: {
                        messages: true,
                    },
                },
            },
        });

        if (!session) {
            return null;
        }

        let resolvedLastMessage: ChatMessagePayload | null = null;

        if (lastMessage !== undefined) {
            resolvedLastMessage = lastMessage
                ? this.toChatMessagePayload(lastMessage)
                : null;
        } else if (session.messages[0]) {
            resolvedLastMessage = this.toChatMessagePayload(
                session.messages[0]
            );
        }

        return {
            id: session.id,
            userId: session.userId,
            guestId: session.guestId,
            status: session.status,
            updatedAt: session.updatedAt,
            lastMessage: resolvedLastMessage,
            messageCount: session._count.messages,
            user: session.user,
        };
    }

    private async publishAdminSessionUpdated(
        sessionId: string,
        lastMessage?: ChatMessageRecord | null
    ) {
        const payload = await this.buildAdminRealtimeSessionPayload(
            sessionId,
            lastMessage
        );

        if (payload) {
            emitAdminChatSessionUpdated(payload);
        }
    }

    async assertSessionSocketAccess(data: {
        sessionId: string;
        userId?: string;
        guestId?: string;
        isAdmin?: boolean;
    }) {
        const { sessionId, userId, guestId, isAdmin } = data;

        const session = await prisma.chatSession.findUnique({
            where: {
                id: sessionId,
            },
            select: CHAT_SESSION_SELECT,
        });

        if (!session) {
            throw new AppError("Chat session not found.", 404);
        }

        if (!isAdmin) {
            this.validateSessionAccess(session, userId, guestId);
        }

        return session;
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
            select: CHAT_SESSION_SELECT,
        });

        await this.publishAdminSessionUpdated(session.id);

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
            select: CHAT_SESSION_SELECT,
        });

        return session;
    }

    async listSessions(data: {
        page: number;
        limit: number;
        search?: string;
        status?: ChatSessionStatus;
    }) {
        const { page, limit, search, status } = data;

        const skip = (page - 1) * limit;

        const where: Prisma.ChatSessionWhereInput = {
            ...(status && { status }),
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
                    ...CHAT_SESSION_SELECT,
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
            status: session.status,
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
            this.validateSessionAccess(session, userId, guestId);
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
                select: CHAT_MESSAGE_SELECT,
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
                status: true,
            },
        });

        if (!session) {
            throw new AppError("Chat session not found.", 404);
        }

        this.validateSessionAccess(session, userId, guestId);

        if (session.status === ChatSessionStatus.CLOSED) {
            throw new AppError("This chat session is closed.", 409);
        }

        if (
            session.status === ChatSessionStatus.WAITING_ADMIN ||
            session.status === ChatSessionStatus.ASSIGNED
        ) {
            const result = await prisma.$transaction(async (tx) => {
                const userMessage = await tx.chatMessage.create({
                    data: {
                        sessionId,
                        role: ChatMessageRole.USER,
                        content: message,
                    },
                    select: CHAT_MESSAGE_SELECT,
                });

                const updatedSession = await tx.chatSession.update({
                    where: {
                        id: sessionId,
                    },
                    data: {
                        updatedAt: new Date(),
                    },
                    select: {
                        status: true,
                        updatedAt: true,
                    },
                });

                return {
                    userMessage,
                    assistantMessage: null,
                    session: updatedSession,
                };
            });

            this.publishChatMessageCreated(
                sessionId,
                result.userMessage,
                result.session.status,
                result.session.updatedAt
            );
            await this.publishAdminSessionUpdated(
                sessionId,
                result.userMessage
            );

            return {
                userMessage: result.userMessage,
                assistantMessage: result.assistantMessage,
            };
        }

        const chatSettings = await this.getChatAISettings();
        const history = await this.getSessionChatHistory(sessionId);

        let classification: IntentClassification | null = null;

        if (chatSettings) {
            classification = await this.classifyIntentWithAI(
                message,
                chatSettings,
                history
            );
        }

        if (classification?.intent === "REQUEST_ADMIN_SUPPORT") {
            const result = await prisma.$transaction(async (tx) => {
                const userMessage = await tx.chatMessage.create({
                    data: {
                        sessionId,
                        role: ChatMessageRole.USER,
                        content: message,
                    },
                    select: CHAT_MESSAGE_SELECT,
                });

                const systemMessage = await tx.chatMessage.create({
                    data: {
                        sessionId,
                        role: ChatMessageRole.SYSTEM,
                        content: ADMIN_TRANSFER_USER_MESSAGE,
                    },
                    select: CHAT_MESSAGE_SELECT,
                });

                const updatedSession = await tx.chatSession.update({
                    where: {
                        id: sessionId,
                    },
                    data: {
                        status: ChatSessionStatus.WAITING_ADMIN,
                        updatedAt: new Date(),
                    },
                    select: {
                        status: true,
                        updatedAt: true,
                    },
                });

                return {
                    userMessage,
                    assistantMessage: systemMessage,
                    session: updatedSession,
                };
            });

            this.publishChatMessageCreated(
                sessionId,
                result.userMessage,
                result.session.status,
                result.session.updatedAt
            );
            this.publishChatMessageCreated(
                sessionId,
                result.assistantMessage,
                result.session.status,
                result.session.updatedAt
            );
            this.publishChatSessionUpdated(
                sessionId,
                result.session.status,
                result.session.updatedAt
            );
            await this.publishAdminSessionUpdated(
                sessionId,
                result.assistantMessage
            );

            return {
                userMessage: result.userMessage,
                assistantMessage: result.assistantMessage,
            };
        }

        const assistantReply = classification
            ? await this.buildReplyFromIntent(classification, userId)
            : this.getDefaultAssistantReply();

        const result = await prisma.$transaction(async (tx) => {
            const userMessage = await tx.chatMessage.create({
                data: {
                    sessionId,
                    role: ChatMessageRole.USER,
                    content: message,
                },
                select: CHAT_MESSAGE_SELECT,
            });

            const assistantMessage = await tx.chatMessage.create({
                data: {
                    sessionId,
                    role: ChatMessageRole.ASSISTANT,
                    content: assistantReply.content,
                    actions: this.buildActionsJson(assistantReply.actions),
                },
                select: CHAT_MESSAGE_SELECT,
            });

            const updatedSession = await tx.chatSession.update({
                where: {
                    id: sessionId,
                },
                data: {
                    updatedAt: new Date(),
                },
                select: {
                    status: true,
                    updatedAt: true,
                },
            });

            return {
                userMessage,
                assistantMessage,
                session: updatedSession,
            };
        });

        this.publishChatMessageCreated(
            sessionId,
            result.userMessage,
            result.session.status,
            result.session.updatedAt
        );
        this.publishChatMessageCreated(
            sessionId,
            result.assistantMessage,
            result.session.status,
            result.session.updatedAt
        );
        await this.publishAdminSessionUpdated(
            sessionId,
            result.assistantMessage
        );

        return {
            userMessage: result.userMessage,
            assistantMessage: result.assistantMessage,
        };
    }

    async sendAdminMessage(data: { sessionId: string; message: string }) {
        const { sessionId, message } = data;

        const session = await prisma.chatSession.findUnique({
            where: {
                id: sessionId,
            },
            select: {
                id: true,
                status: true,
            },
        });

        if (!session) {
            throw new AppError("Chat session not found.", 404);
        }

        if (session.status === ChatSessionStatus.CLOSED) {
            throw new AppError(
                "Cannot send message to a closed chat session.",
                409
            );
        }

        const previousStatus = session.status;
        const nextStatus =
            session.status === ChatSessionStatus.WAITING_ADMIN
                ? ChatSessionStatus.ASSIGNED
                : session.status;

        const result = await prisma.$transaction(async (tx) => {
            const createdMessage = await tx.chatMessage.create({
                data: {
                    sessionId,
                    role: ChatMessageRole.ADMIN,
                    content: message,
                },
                select: CHAT_MESSAGE_SELECT,
            });

            const updatedSession = await tx.chatSession.update({
                where: {
                    id: sessionId,
                },
                data: {
                    status: nextStatus,
                    updatedAt: new Date(),
                },
                select: {
                    status: true,
                    updatedAt: true,
                },
            });

            return {
                message: createdMessage,
                session: updatedSession,
            };
        });

        this.publishChatMessageCreated(
            sessionId,
            result.message,
            result.session.status,
            result.session.updatedAt
        );

        if (result.session.status !== previousStatus) {
            this.publishChatSessionUpdated(
                sessionId,
                result.session.status,
                result.session.updatedAt
            );
        }

        await this.publishAdminSessionUpdated(sessionId, result.message);

        return {
            message: result.message,
        };
    }

    async updateSessionStatus(data: {
        sessionId: string;
        status: ChatSessionStatus;
    }) {
        const { sessionId, status: targetStatus } = data;

        if (targetStatus === ChatSessionStatus.ASSIGNED) {
            throw new AppError(
                "Chat session status cannot be changed to ASSIGNED manually.",
                400
            );
        }

        const session = await prisma.chatSession.findUnique({
            where: {
                id: sessionId,
            },
            select: CHAT_SESSION_SELECT,
        });

        if (!session) {
            throw new AppError("Chat session not found.", 404);
        }

        if (session.status === targetStatus) {
            return {
                session,
                systemMessage: undefined,
            };
        }

        this.validateStatusTransition(session.status, targetStatus);

        const systemContent =
            this.getSystemMessageForStatusChange(targetStatus);

        const result = await prisma.$transaction(async (tx) => {
            let systemMessage: ChatMessageRecord | undefined;

            if (systemContent) {
                systemMessage = await tx.chatMessage.create({
                    data: {
                        sessionId,
                        role: ChatMessageRole.SYSTEM,
                        content: systemContent,
                    },
                    select: CHAT_MESSAGE_SELECT,
                });
            }

            const updatedSession = await tx.chatSession.update({
                where: {
                    id: sessionId,
                },
                data: {
                    status: targetStatus,
                    updatedAt: new Date(),
                },
                select: CHAT_SESSION_SELECT,
            });

            return {
                session: updatedSession,
                systemMessage,
            };
        });

        if (result.systemMessage) {
            this.publishChatMessageCreated(
                sessionId,
                result.systemMessage,
                result.session.status,
                result.session.updatedAt
            );
        }

        this.publishChatSessionUpdated(
            sessionId,
            result.session.status,
            result.session.updatedAt
        );
        await this.publishAdminSessionUpdated(sessionId, result.systemMessage);

        return result;
    }

    private getDefaultAssistantReply(): AssistantReply {
        return {
            content:
                "Mình có thể hỗ trợ bạn về cách đặt vé, thanh toán SEPAY, xem vé QR, hoàn vé hoặc gợi ý các sự kiện sắp diễn ra trên EventHub.",
            actions: [
                {
                    type: "SEND_MESSAGE",
                    label: "Hoàn vé",
                },
                {
                    type: "SEND_MESSAGE",
                    label: "Tra cứu vé",
                },
            ],
        };
    }

    private parseIntentClassification(
        raw: string
    ): IntentClassification | null {
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
                        { type: "SEND_MESSAGE", label: "Tra cứu thông tin vé" },
                    ],
                };

            case "REFUND_LOOKUP":
                return {
                    content: reply,
                    actions: [
                        {
                            type: "OPEN_REFUND_LOOKUP_FORM",
                            label: "Tra cứu vé đã đặt",
                        },
                        { type: "SEND_MESSAGE", label: "Xử lí hoàn vé" },
                    ],
                };

            case "BOOKING_GUIDE":
                return {
                    content: reply,
                    actions: [
                        {
                            type: "SHOW_BOOKING_GUIDE_FLOW",
                            label: "Quy trình đặt vé",
                            payload: {
                                steps: [
                                    {
                                        title: "Chọn sự kiện",
                                        description:
                                            "Vào danh sách sự kiện và chọn một sự kiện sắp diễn ra.",
                                    },
                                    {
                                        title: "Đặt chỗ",
                                        description:
                                            "Bấm nút “Đặt chỗ ngay” trong trang chi tiết sự kiện.",
                                    },
                                    {
                                        title: "Chọn ghế",
                                        description:
                                            "Chọn ghế còn trống mà bạn muốn đặt.",
                                    },
                                    {
                                        title: "Nhập thông tin",
                                        description:
                                            "Nhập email, họ tên và số điện thoại để tạo đơn.",
                                    },
                                    {
                                        title: "Áp dụng coupon",
                                        description:
                                            "Ở trang thanh toán, nhập coupon/mã giảm giá nếu có.",
                                    },
                                    {
                                        title: "Thanh toán SEPAY",
                                        description:
                                            "Quét mã QR để thanh toán. Hiện tại EventHub chỉ hỗ trợ thanh toán bằng SEPAY.",
                                    },
                                    {
                                        title: "Nhận vé QR",
                                        description:
                                            "Sau khi thanh toán thành công, EventHub sẽ gửi email kèm thông tin đơn hàng và mã QR của từng ticket.",
                                    },
                                    {
                                        title: "Bảo mật vé",
                                        description:
                                            "Không chia sẻ mã QR vé hoặc mã đơn hàng/order code cho bất kỳ ai.",
                                    },
                                ],
                            },
                        },
                        {
                            type: "NAVIGATE",
                            label: "Xem danh sách sự kiện",
                            payload: {
                                path: "/events",
                            },
                        },
                    ],
                };

            case "MY_TICKETS":
                return {
                    content: reply,
                    actions: [
                        this.getTicketsOrLoginAction(userId),
                        {
                            type: "SEND_MESSAGE",
                            label: "Tra cứu vé đã đặt",
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
                        {
                            type: "SEND_MESSAGE",
                            label: "Hoàn vé đã đặt",
                        },
                        {
                            type: "SEND_MESSAGE",
                            label: "Tra cứu hoàn vé",
                        },
                        {
                            type: "SEND_MESSAGE",
                            label: "Hướng dẫn đặt vé",
                        },
                        {
                            type: "SEND_MESSAGE",
                            label: "Vé tôi đặt ở đâu?",
                        },
                    ],
                };
        }
    }

    private getTicketsOrLoginAction(userId?: string): ChatAction {
        if (userId) {
            return {
                type: "NAVIGATE",
                label: "Xem vé của tôi",
                payload: {
                    path: "/my-tickets",
                },
            };
        }

        return {
            type: "NAVIGATE",
            label: "Đăng nhập để xem vé",
            payload: {
                path: "/login",
            },
        };
    }
}

export default new AIChatService();
