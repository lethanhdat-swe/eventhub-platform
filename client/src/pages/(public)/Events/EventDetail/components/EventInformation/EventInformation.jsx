import {
  FacebookIcon,
  InstagramIcon,
  TwitterIcon,
} from "@/assets/icons";

import { Link2 } from "lucide-react";

function EventInformation({ event }) {
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
    <div className="p-4 bg-(--surface-color) rounded-xl mt-4">
      <h1 className="text-(--text-primary) text-lg font-medium">
        Event Information
      </h1>

      <div className="flex justify-between gap-4 mt-4 text-sm text-(--text-primary)/70">
        <div className="flex flex-col gap-3">
          <p>Date</p>
          <p>Time</p>
          <p>Location</p>
          <p>Age Restriction</p>
        </div>

        <div className="flex flex-col gap-3 text-right">
          <p>{dateStr}</p>
          <p>{timeStr}</p>
          <p>{event.location}</p>
          <p>{event.category?.name || "General"}</p>
        </div>
      </div>

      <div className="mt-5 border-t border-(--text-primary)/20 pt-4 flex gap-4 items-center">
        <h1 className="text-(--text-primary) text-sm font-medium">
          Share this event
        </h1>

        <div className="flex items-center gap-3 text-(--text-primary)">
          <FacebookIcon />
          <InstagramIcon />
          <TwitterIcon />
          <Link2 />
        </div>
      </div>
    </div>
  );
}

export default EventInformation;