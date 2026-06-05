import { Calendar, ChevronRight, Clock, MapPin } from "lucide-react";
import { resolvePublicAssetUrl } from '@/lib/url/resolvePublicAssetUrl';
import { Link } from "react-router-dom";

function SavedEventCard({ event }) {
  const startDate = new Date(event.startDate);

  return (
    <div className="w-full flex flex-col sm:flex-row items-stretch gap-3 sm:gap-6 border-b border-(--text-primary)/10 px-3 sm:px-6 py-4 sm:py-5">

      {/* LEFT — thumbnail + info */}
      <div className="flex flex-1 min-w-0 items-center gap-3 sm:gap-5 pb-3 sm:pb-0 sm:pr-8 border-b sm:border-b-0 sm:border-r border-(--text-primary)/10">
        <img
          src={resolvePublicAssetUrl(event.thumbnailUrl)}
          alt={event.title}
          className="object-cover w-32 h-20 sm:h-32 sm:w-52 shrink-0 rounded-xl sm:rounded-2xl"
        />

        <div className="flex flex-col min-w-0 gap-1 sm:gap-2">
          <h1 className="truncate text-base sm:text-xl font-bold text-(--text-primary)">
            {event.title}
          </h1>

          {event.location && (
            <div className="flex items-center gap-2 text-(--text-primary)/50">
              <MapPin size={13} />
              <p className="text-xs truncate sm:text-sm">{event.location}</p>
            </div>
          )}
        </div>
      </div>

      {/* BOTTOM ROW on mobile: time + action side by side */}
      <div className="flex items-center justify-between sm:contents">
        {/* TIME */}
        <div className="flex items-center gap-4 sm:flex-col sm:justify-center sm:gap-3 sm:px-8 sm:border-r border-(--text-primary)/10">
          <div className="flex items-center gap-2 text-(--text-primary)/60">
            <Calendar size={14} />
            <p className="text-xs sm:text-sm">{startDate.toLocaleDateString("vi-VN")}</p>
          </div>
          <div className="flex items-center gap-2 text-(--text-primary)/60">
            <Clock size={14} />
            <p className="text-xs sm:text-sm">
              {startDate.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>
        </div>

        {/* ACTION */}
        <Link
          to={`/events/${event.id}`}
          className="flex shrink-0 self-center items-center justify-center h-10 w-10 sm:h-12 sm:w-12 rounded-full border border-(--text-primary)/10 bg-(--text-primary)/5 text-(--text-primary)/70 transition-all duration-300 hover:bg-(--primary-color) hover:text-(--text-primary) hover:scale-110"
        >
          <ChevronRight size={18} />
        </Link>
      </div>

    </div>
  );
}

export default SavedEventCard;