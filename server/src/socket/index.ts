import { Server as HttpServer } from "http";
import { Server } from "socket.io";
import { registerSeatHandlers } from "./handlers/seat.socket";
import { registerPaymentHandlers } from "./handlers/payment.socket";

let io: Server | null = null;

export const initSocket = (httpServer: HttpServer) => {
    io = new Server(httpServer, {
        cors: {
            origin: "*",
        },
    });

    io.on("connection", (socket) => {
        registerSeatHandlers(socket);
        registerPaymentHandlers(socket);
    });

    return io;
};

export const getIO = () => io;
