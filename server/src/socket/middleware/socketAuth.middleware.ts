import jwt from "jsonwebtoken";
import { Socket } from "socket.io";
import { prisma } from "../../utils/prisma";

export type SocketAuthUser = {
    id: string;
    email: string;
    role: string;
};

export type SocketData = {
    user: SocketAuthUser | null;
    chatSessionId?: string;
};

function extractBearerToken(socket: Socket): string | null {
    const authToken = socket.handshake.auth?.token;

    if (typeof authToken === "string" && authToken.trim()) {
        return authToken.trim();
    }

    const authorization = socket.handshake.headers.authorization;

    if (
        typeof authorization === "string" &&
        authorization.startsWith("Bearer ")
    ) {
        return authorization.split(" ")[1]?.trim() || null;
    }

    return null;
}

export const socketAuthMiddleware = async (
    socket: Socket,
    next: (err?: Error) => void
) => {
    const data = socket.data as SocketData;
    data.user = null;

    const token = extractBearerToken(socket);

    if (!token) {
        return next();
    }

    try {
        const decoded = jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET!
        ) as { id?: string };

        if (!decoded?.id) {
            return next();
        }

        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: { id: true, email: true, role: true },
        });

        if (user) {
            data.user = user;
        }
    } catch {
        // Invalid or expired token: allow guest socket connection.
    }

    return next();
};
