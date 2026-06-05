export const SOCKET_EVENTS = {
    SEAT_JOIN: "seat:join-event",
    SEAT_LEAVE: "seat:leave-event",
    SEAT_CHANGED: "seat:changed",

    PAYMENT_JOIN: "payment:join-order",
    PAYMENT_LEAVE: "payment:leave-order",
    PAYMENT_PAID: "payment:paid",
    PAYMENT_FAILED: "payment:failed",
    PAYMENT_EXPIRED: "payment:expired",

    CHAT_JOIN_SESSION: "chat:join_session",
    CHAT_LEAVE_SESSION: "chat:leave_session",
    ADMIN_CHAT_JOIN_DASHBOARD: "admin_chat:join_dashboard",

    CHAT_JOIN_SESSION_SUCCESS: "chat:join_session_success",
    ADMIN_CHAT_JOIN_DASHBOARD_SUCCESS: "admin_chat:join_dashboard_success",
    CHAT_MESSAGE_CREATED: "chat:message_created",
    CHAT_SESSION_UPDATED: "chat:session_updated",
    ADMIN_CHAT_SESSION_UPDATED: "admin_chat:session_updated",
    CHAT_ERROR: "chat:error",
    ADMIN_CHAT_ERROR: "admin_chat:error",
} as const;

export const eventRoom = (eventId: string) => `event:${eventId}`;

export const orderRoom = (orderId: string) => `order:${orderId}`;

export const chatSessionRoom = (sessionId: string) =>
    `chat:session:${sessionId}`;

export const ADMIN_CHAT_DASHBOARD_ROOM = "admin:chat:dashboard";
