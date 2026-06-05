export const SOCKET_EVENTS = {
    SEAT_JOIN: "seat:join-event",
    SEAT_LEAVE: "seat:leave-event",
    SEAT_CHANGED: "seat:changed",

    PAYMENT_JOIN: "payment:join-order",
    PAYMENT_LEAVE: "payment:leave-order",
    PAYMENT_PAID: "payment:paid",
    PAYMENT_FAILED: "payment:failed",
    PAYMENT_EXPIRED: "payment:expired",
} as const;

export const eventRoom = (eventId: string) => `event:${eventId}`;

export const orderRoom = (orderId: string) => `order:${orderId}`;
