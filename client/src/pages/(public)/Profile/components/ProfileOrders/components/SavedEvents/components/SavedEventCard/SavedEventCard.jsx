import { Calendar, ChevronRight, Clock, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

function SavedEventCard({ event }) {
  const startDate = new Date(event.startDate);

  return (
    <div className="w-full flex items-stretch gap-6 border-b border-(--text-primary)/10 px-6 py-5">

      {/* LEFT — thumbnail + info */}
      <div className="flex flex-1 min-w-0 items-center gap-5 pr-8 border-r border-(--text-primary)/10">
        <img
          src={`${import.meta.env.VITE_API_URL}/uploads/${event.thumbnailUrl}`}
          alt={event.title}
          className="object-cover h-32 w-52 shrink-0 rounded-2xl"
        />

        <div className="flex flex-col min-w-0 gap-2">
          <h1 className="truncate text-xl font-bold text-(--text-primary)">
            {event.title}
          </h1>

          {event.location && (
            <div className="flex items-center gap-2 text-(--text-primary)/50">
              <MapPin size={14} />
              <p className="text-sm truncate">{event.location}</p>
            </div>
          )}
        </div>
      </div>

      {/* TIME */}
      <div className="flex flex-col justify-center gap-3 px-8 border-r border-(--text-primary)/10">
        <div className="flex items-center gap-3 text-(--text-primary)/60">
          <Calendar size={16} />
          <p className="text-sm">{startDate.toLocaleDateString("vi-VN")}</p>
        </div>
        <div className="flex items-center gap-3 text-(--text-primary)/60">
          <Clock size={16} />
          <p className="text-sm">
            {startDate.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
          </p>
        </div>
      </div>

      {/* ACTION */}
      <Link
        to={`/events/${event.id}`}
        className="flex shrink-0 self-center items-center justify-center h-12 w-12 rounded-full border border-(--text-primary)/10 bg-(--text-primary)/5 text-(--text-primary)/70 transition-all duration-300 hover:bg-(--primary-color) hover:text-(--text-primary) hover:scale-110"
      >
        <ChevronRight size={20} />
      </Link>

    </div>
  );
}

export default SavedEventCard;