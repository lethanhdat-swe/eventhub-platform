import { z } from "zod";

export const deleteBulkEventArtistSchema = z.object({
  params: z.object({
    eventId: z.string().uuid("Invalid Event ID format"),
  }),
  body: z.object({
    artistIds: z.array(z.string().uuid("Invalid Artist ID format"))
      .nonempty("artistIds array cannot be empty"),
  }),
});