import { getIO } from ".";
import { SOCKET_EVENTS, eventRoom, orderRoom } from "./constants";

type PaymentPayload = {
    orderCode: string;
    status: "PAID" | "FAILED" | "EXPIRED";
};

const safeEmit = (action: () => void) => {
    try {
        action();
    } catch (error) {
        console.error("[SOCKET] Emit failed:", error);
    }
};

export const emitSeatChanged = (
    eventId: string,
    payload?: { eventId: string }
) => {
    const io = getIO();
    if (!io) return;

    safeEmit(() => {
        io.to(eventRoom(eventId)).emit(SOCKET_EVENTS.SEAT_CHANGED, {
            eventId,
            ...payload,
        });
    });
};

export const emitPaymentPaid = (
    orderId: string,
    payload: PaymentPayload & { status: "PAID" }
) => {
    const io = getIO();
    if (!io) return;

    safeEmit(() => {
        io.to(orderRoom(orderId)).emit(SOCKET_EVENTS.PAYMENT_PAID, {
            orderId,
            ...payload,
        });
    });
};

export const emitPaymentFailed = (
    orderId: string,
    payload: PaymentPayload & { status: "FAILED" }
) => {
    const io = getIO();
    if (!io) return;

    safeEmit(() => {
        io.to(orderRoom(orderId)).emit(SOCKET_EVENTS.PAYMENT_FAILED, {
            orderId,
            ...payload,
        });
    });
};

export const emitPaymentExpired = (
    orderId: string,
    payload: PaymentPayload & { status: "EXPIRED" }
) => {
    const io = getIO();
    if (!io) return;

    safeEmit(() => {
        io.to(orderRoom(orderId)).emit(SOCKET_EVENTS.PAYMENT_EXPIRED, {
            orderId,
            ...payload,
        });
    });
};
