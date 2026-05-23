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
    <div className="p-5 bg-(--surface-color) rounded-xl mt-4">
      <h1 className="text-(--text-primary) text-xl">
        Event Information
      </h1>

      <div className="flex justify-between mt-5 text-(--text-primary)/70">
        <div className="flex flex-col gap-5">
          <p>Date</p>
          <p>Time</p>
          <p>Location</p>
          <p>Age Restriction</p>
        </div>

        <div className="flex flex-col gap-5">
          <p>{dateStr}</p>
          <p>{timeStr}</p>
          <p>{event.location}</p>
          <p>{event.category?.name || "General"}</p>
        </div>
      </div>

      <div className="mt-10 border-t-2 border-(--text-primary)/30 p-4 flex gap-7 items-center">
        <h1 className="text-(--text-primary) text-[18px]">
          Share this event
        </h1>

        <div className="flex items-center gap-4 text-(--text-primary)">
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