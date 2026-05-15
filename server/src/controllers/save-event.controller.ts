import { Request, Response, NextFunction } from "express";
import saveEventService from "../services/save-event.service";

class SaveEventController {
    toggleSave = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { eventId } = req.params;
            const userId = req.user!.id; 

            const result = await saveEventService.toggleSave(userId, eventId as string);

            return res.success({
                message: result.isSaved ? "Event saved successfully." : "Event unsaved successfully.",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };

    listSaved = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user!.id;
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;

            const result = await saveEventService.getSavedEvents(userId, page, limit);

            return res.success({
                message: "Saved events fetched successfully.",
                data: result.items,
                meta: result.meta, 
            });
        } catch (error) {
            next(error);
        }
    };
}

export default new SaveEventController();