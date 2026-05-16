import { prisma } from "../utils/prisma";

class EventArtistService {
    removeArtistsFromEvent = async (eventId: string, artistIds: string[]) => {
        const result = await prisma.eventArtist.deleteMany({
            where: {
                eventId: eventId,
                artistId: {
                    in: artistIds,
                },
            },
        });

        return result;
    };
}

export default new EventArtistService();
