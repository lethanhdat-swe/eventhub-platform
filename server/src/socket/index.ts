import { Server as HttpServer } from "http";
import { Server } from "socket.io";
import { registerChatHandlers } from "./handlers/chat.socket";
import { registerPaymentHandlers } from "./handlers/payment.socket";
import { registerSeatHandlers } from "./handlers/seat.socket";
import { socketAuthMiddleware } from "./middleware/socketAuth.middleware";

let io: Server | null = null;

export const initSocket = (httpServer: HttpServer) => {
    io = new Server(httpServer, {
        cors: {
            origin: "*",
        },
    });

    io.use(socketAuthMiddleware);

    io.on("connection", (socket) => {
        registerSeatHandlers(socket);
        registerPaymentHandlers(socket);
        registerChatHandlers(socket);
    });

    return io;
};

export const getIO = () => io;
