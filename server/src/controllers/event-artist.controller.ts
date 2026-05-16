import { Request, Response, NextFunction } from "express";
import eventArtistService from "../services/event-artist.service";

class EventArtistController {
    removeArtists = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { eventId } = req.params;
            const { artistIds } = req.body;

            await eventArtistService.removeArtistsFromEvent(
                eventId as string,
                artistIds as string[]
            );

            return res.success({
                message: "Artists removed from event successfully.",
                status: 200,
            });
        } catch (error) {
            next(error);
        }
    };
}

export default new EventArtistController();
