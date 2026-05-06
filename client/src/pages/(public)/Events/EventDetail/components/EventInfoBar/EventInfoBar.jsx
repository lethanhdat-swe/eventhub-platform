import { Calendar, MapPin, Phone, User } from "lucide-react";

 function EventInfoBar({ event }) {
     const dateStr = `${event.date.weekday}, ${event.date.day} ${event.date.month} ${event.date.year}`;
 
  return (
    <div className="flex items-center justify-between p-4 border-t-2 border-(--text-primary)/30">
        <div className="flex items-center gap-2">
            <Calendar color="var(--primary-color)"/> 
            <div className="flex flex-col gap-0.5">
              <p className="text-(--text-primary)">{dateStr}</p>
              <p className="text-(--text-primary)/60">{event.date.fullTime}</p>
            </div>
        </div>

          <div className="flex items-center gap-2">
            <MapPin color="var(--primary-color)"/> 
            <div className="flex flex-col gap-0.5">
              <p className="text-(--text-primary)">{event.location}</p>
              <p className="text-(--text-primary)/60">Location</p>
            </div>
        </div>

          <div className="flex items-center gap-2">
            <User color="var(--primary-color)"/> 
            <div className="flex flex-col gap-0.5">
              <p className="text-(--text-primary)">{event.organizer.name}</p>
              <p className="text-(--text-primary)/60">Organizer</p>
            </div>
        </div>

        <div className="flex items-center gap-2">
            <Phone color="var(--primary-color)"/> 
            <div className="flex flex-col gap-0.5">
              <p className="text-(--text-primary)">{event.hotline}</p>
              <p className="text-(--text-primary)/60">Hotline</p>
            </div>
        </div>
    </div>
  );
}

export default EventInfoBar;