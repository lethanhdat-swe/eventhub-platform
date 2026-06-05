import { Socket } from "socket.io";
import { SOCKET_EVENTS, orderRoom } from "../constants";

export const registerPaymentHandlers = (socket: Socket) => {
    socket.on(
        SOCKET_EVENTS.PAYMENT_JOIN,
        ({ orderId }: { orderId?: string }) => {
            if (!orderId) return;
            socket.join(orderRoom(orderId));
        }
    );

    socket.on(
        SOCKET_EVENTS.PAYMENT_LEAVE,
        ({ orderId }: { orderId?: string }) => {
            if (!orderId) return;
            socket.leave(orderRoom(orderId));
        }
    );
};
