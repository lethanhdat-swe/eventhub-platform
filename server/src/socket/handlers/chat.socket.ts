import { Socket } from "socket.io";
import aiChatService from "../../services/ai-chat.service";
import { AppError } from "../../utils/AppError";
import {
    ADMIN_CHAT_DASHBOARD_ROOM,
    chatSessionRoom,
    SOCKET_EVENTS,
} from "../constants";
import { SocketData } from "../middleware/socketAuth.middleware";

const getSocketData = (socket: Socket): SocketData =>
    socket.data as SocketData;

const emitChatError = (socket: Socket, message: string) => {
    socket.emit(SOCKET_EVENTS.CHAT_ERROR, { message });
};

const emitAdminChatError = (socket: Socket, message: string) => {
    socket.emit(SOCKET_EVENTS.ADMIN_CHAT_ERROR, { message });
};

const leaveChatSessionRoom = (socket: Socket, sessionId?: string) => {
    const data = getSocketData(socket);
    const targetSessionId = sessionId || data.chatSessionId;

    if (!targetSessionId) {
        return;
    }

    socket.leave(chatSessionRoom(targetSessionId));

    if (data.chatSessionId === targetSessionId) {
        delete data.chatSessionId;
    }
};

export const registerChatHandlers = (socket: Socket) => {
    socket.on(
        SOCKET_EVENTS.CHAT_JOIN_SESSION,
        async (payload?: { sessionId?: string; guestId?: string }) => {
            try {
                const sessionId = payload?.sessionId?.trim();
                const guestId = payload?.guestId?.trim();

                if (!sessionId) {
                    emitChatError(socket, "Chat session ID is required.");
                    return;
                }

                const data = getSocketData(socket);
                const user = data.user;
                const userId = user?.id;
                const isAdmin = user?.role === "ADMIN";

                const session = await aiChatService.assertSessionSocketAccess({
                    sessionId,
                    userId,
                    guestId,
                    isAdmin,
                });

                leaveChatSessionRoom(socket);
                socket.join(chatSessionRoom(sessionId));
                data.chatSessionId = sessionId;

                socket.emit(SOCKET_EVENTS.CHAT_JOIN_SESSION_SUCCESS, {
                    session: {
                        id: session.id,
                        userId: session.userId,
                        guestId: session.guestId,
                        status: session.status,
                        updatedAt: session.updatedAt,
                    },
                });
            } catch (error) {
                if (error instanceof AppError) {
                    emitChatError(socket, error.message);
                    return;
                }

                console.error("[SOCKET] chat:join_session failed:", error);
                emitChatError(
                    socket,
                    "Unable to join chat session at this time."
                );
            }
        }
    );

    socket.on(
        SOCKET_EVENTS.CHAT_LEAVE_SESSION,
        (payload?: { sessionId?: string }) => {
            try {
                leaveChatSessionRoom(socket, payload?.sessionId?.trim());
            } catch (error) {
                console.error("[SOCKET] chat:leave_session failed:", error);
            }
        }
    );

    socket.on(SOCKET_EVENTS.ADMIN_CHAT_JOIN_DASHBOARD, () => {
        try {
            const user = getSocketData(socket).user;

            if (!user || user.role !== "ADMIN") {
                emitAdminChatError(
                    socket,
                    "Admin permission is required."
                );
                return;
            }

            socket.join(ADMIN_CHAT_DASHBOARD_ROOM);
            socket.emit(SOCKET_EVENTS.ADMIN_CHAT_JOIN_DASHBOARD_SUCCESS);
        } catch (error) {
            console.error(
                "[SOCKET] admin_chat:join_dashboard failed:",
                error
            );
            emitAdminChatError(
                socket,
                "Unable to join admin chat dashboard at this time."
            );
        }
    });

    socket.on("disconnect", () => {
        leaveChatSessionRoom(socket);
    });
};
