import { ChatMessageRole, ChatSessionStatus, Prisma } from "@prisma/client";
import { getIO } from "..";
import {
    ADMIN_CHAT_DASHBOARD_ROOM,
    chatSessionRoom,
    SOCKET_EVENTS,
} from "../constants";

export type ChatMessagePayload = {
    id: string;
    role: ChatMessageRole;
    content: string;
    actions: Prisma.JsonValue | null;
    createdAt: Date;
};

export type ChatMessageCreatedPayload = {
    sessionId: string;
    message: ChatMessagePayload;
    status: ChatSessionStatus;
    updatedAt: Date;
};

export type ChatSessionUpdatedPayload = {
    sessionId: string;
    status: ChatSessionStatus;
    updatedAt: Date;
};

export type AdminChatSessionUpdatedPayload = {
    id: string;
    userId: string | null;
    guestId: string | null;
    status: ChatSessionStatus;
    updatedAt: Date;
    lastMessage: ChatMessagePayload | null;
    messageCount: number;
    user: {
        id: string;
        fullName: string;
        email: string;
        avatarUrl: string | null;
    } | null;
};

const safeEmit = (action: () => void) => {
    try {
        action();
    } catch (error) {
        console.error("[SOCKET] Chat emit failed:", error);
    }
};

export const emitChatMessageCreated = (
    sessionId: string,
    payload: ChatMessageCreatedPayload
) => {
    const io = getIO();
    if (!io) return;

    safeEmit(() => {
        io.to(chatSessionRoom(sessionId)).emit(
            SOCKET_EVENTS.CHAT_MESSAGE_CREATED,
            payload
        );
    });
};

export const emitChatSessionUpdated = (
    sessionId: string,
    payload: ChatSessionUpdatedPayload
) => {
    const io = getIO();
    if (!io) return;

    safeEmit(() => {
        io.to(chatSessionRoom(sessionId)).emit(
            SOCKET_EVENTS.CHAT_SESSION_UPDATED,
            payload
        );
    });
};

export const emitAdminChatSessionUpdated = (
    payload: AdminChatSessionUpdatedPayload
) => {
    const io = getIO();
    if (!io) return;

    safeEmit(() => {
        io.to(ADMIN_CHAT_DASHBOARD_ROOM).emit(
            SOCKET_EVENTS.ADMIN_CHAT_SESSION_UPDATED,
            payload
        );
    });
};
