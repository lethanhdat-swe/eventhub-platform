import { BadgeCheck, Phone } from "lucide-react";
import OrganizerAvatar from "./components/OrganizerAvatar/OrganizerAvatar";

function EventOrganizer({ event }) {
  return (
    <div className="p-4 bg-(--surface-color) rounded-xl">
      <h1 className="text-(--text-primary) font-medium">EventHub Organizer</h1>

      <div className="flex items-start gap-4 mt-4">
        <OrganizerAvatar />

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <p className="text-(--text-primary)">
              {event.eventArtists?.[0]?.name || "Unknown Organizer"}
            </p>

            <BadgeCheck fill="var(--primary-color)" color="white" size={18} />
          </div>

          <p className="text-(--text-primary)/70 text-sm line-clamp-3">
            {event.description}
          </p>

          <div className="flex items-center gap-3">
            <Phone color="var(--primary-color)" size={18} />
            <p className="text-(--text-primary)/70">
              Not available
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventOrganizer;