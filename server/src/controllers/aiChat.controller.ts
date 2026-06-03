import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError";
import aiChatService from "../services/ai-chat.service";

class AIChatController {
    listSessions = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const { page, limit, search } = req.query as unknown as {
                page: number;
                limit: number;
                search?: string;
            };

            const result = await aiChatService.listSessions({
                page,
                limit,
                search,
            });

            return res.success({
                message: "Chat sessions retrieved successfully.",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };

    getLatestMySession = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const userId = req.user?.id;

            if (!userId) {
                throw new AppError("Authentication required.", 401);
            }

            const session = await aiChatService.getLatestUserSession(userId);

            return res.success({
                message: session
                    ? "Latest chat session retrieved successfully."
                    : "No chat session found.",
                data: session,
            });
        } catch (error) {
            next(error);
        }
    };

    createSession = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const userId = req.user?.id;
            const { guestId } = req.body || {};

            const session = await aiChatService.createSession({
                userId,
                guestId,
            });

            return res.success({
                message: "Chat session created successfully.",
                data: session,
                status: 201,
            });
        } catch (error) {
            next(error);
        }
    };

    getMessages = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const userId = req.user?.id;
            const isAdmin = req.user?.role === "ADMIN";

            const { sessionId } = req.params;

            const { page, limit, guestId } = req.query as unknown as {
                page: number;
                limit: number;
                guestId?: string;
            };

            const result = await aiChatService.getMessages({
                sessionId: sessionId as string,
                userId,
                guestId,
                page,
                limit,
                isAdmin,
            });

            return res.success({
                message: "Chat messages retrieved successfully.",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };

    sendMessage = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const userId = req.user?.id;
            const { sessionId } = req.params;
            const { message, guestId } = req.body;

            const result = await aiChatService.sendMessage({
                sessionId: sessionId as string,
                userId,
                guestId,
                message,
            });

            return res.success({
                message: "Chat message sent successfully.",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };
}

export default new AIChatController();