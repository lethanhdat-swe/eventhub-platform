import { Calendar, MapPin, Phone, User } from "lucide-react";

function EventInfoBar({ event }) {
  const startDate = new Date(event.startDate);

  const dateStr = startDate.toLocaleDateString("vi-VN", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const timeStr = startDate.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 p-3 border-t border-(--text-primary)/20">
      <div className="flex items-center gap-2">
        <Calendar color="var(--primary-color)" size={18} />

        <div className="flex flex-col gap-0.5">
          <p className="text-(--text-primary)">
            {dateStr}
          </p>

          <p className="text-(--text-primary)/60">
            {timeStr}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <MapPin color="var(--primary-color)" size={18} />

        <div className="flex flex-col gap-0.5">
          <p className="text-(--text-primary)">
            {event.location}
          </p>

          <p className="text-(--text-primary)/60">
            Location
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <User color="var(--primary-color)" size={18} />

        <div className="flex flex-col gap-0.5">
          <p className="text-(--text-primary)">
            EventHub
          </p>

          <p className="text-(--text-primary)/60">
            Organizer
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Phone color="var(--primary-color)" size={18} />

        <div className="flex flex-col gap-0.5">
          <p className="text-(--text-primary)">
            Updating...
          </p>

          <p className="text-(--text-primary)/60">
            Hotline
          </p>
        </div>
      </div>
    </div>
  );
}

export default EventInfoBar;