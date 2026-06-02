import { NextFunction, Request, Response } from "express";
import aiChatService from "../services/ai-chat.service";

class AIChatController {
    createSession = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const userId = req.user?.id;
            const guestId = req.body?.guestId;

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
            const { sessionId } = req.params;
            const { page, limit } = req.query as unknown as {
                page: number;
                limit: number;
            };

            const result = await aiChatService.getMessages({
                sessionId: sessionId as string,
                userId,
                page,
                limit,
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
            const { message } = req.body;

            const result = await aiChatService.sendMessage({
                sessionId: sessionId as string,
                userId,
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