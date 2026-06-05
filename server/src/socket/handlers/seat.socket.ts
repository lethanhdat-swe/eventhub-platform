import { Socket } from "socket.io";
import { SOCKET_EVENTS, eventRoom } from "../constants";

export const registerSeatHandlers = (socket: Socket) => {
    socket.on(SOCKET_EVENTS.SEAT_JOIN, ({ eventId }: { eventId?: string }) => {
        if (!eventId) return;
        socket.join(eventRoom(eventId));
    });

    socket.on(SOCKET_EVENTS.SEAT_LEAVE, ({ eventId }: { eventId?: string }) => {
        if (!eventId) return;
        socket.leave(eventRoom(eventId));
    });
};
