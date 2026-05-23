import { saveEventService } from "@/lib/services/saveEvent";
import { Bookmark, MapPin, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function EventItem({ event }) {
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

    const startDate = new Date(event.startDate);

    useEffect(() => {
      saveEventService.list().then((data) => {
        const isSaved = data.some((item) => item.event.id === event.id);
        setSaved(isSaved);
      });
    }, [saved, event.id]);

    const handleBookmark = async (e) => {
      e.stopPropagation();
      if (loading) return;
      setLoading(true);
      try {
        const res = await saveEventService.toggle(event.id);
        setSaved(res);
      } catch (err) {
        console.error('Failed to toggle save:', err);
      } finally {
        setLoading(false);
      }
    };

  return (
    <div onClick={() => navigate(`/events/${event.id}`)}>
      <div className="flex flex-col h-full overflow-hidden cursor-pointer group rounded-xl">
        <div className="relative">
          <img
            src={`${import.meta.env.VITE_API_URL}/uploads/${event.thumbnailUrl}`}
            alt={event.title}
            className="object-cover w-full transition-transform duration-500 h-50 group-hover:scale-105"
          />

          <div className="absolute flex flex-col items-center leading-tight top-3 left-3 bg-(--background-color)/70 rounded-lg w-12 h-12">
            <span className="text-xl font-black text-(--text-primary)">
              {startDate.getDate()}
            </span>

            <span className="text-(--text-primary)/50 text-[10px] font-semibold tracking-widest">
              {startDate.toLocaleString("default", {
                month: "short",
              })}
            </span>
          </div>

          <button
              onClick={handleBookmark}
              disabled={loading}
              className="absolute flex items-center justify-center w-8 h-8 transition-all duration-200 rounded-full top-3 right-3 bg-(--background-color)/40 hover:bg-(--background-color)/60 disabled:opacity-40"
            >
              <Bookmark
                size={25}
                color="var(--text-primary)"
                fill={saved ? "var(--text-primary)" : "none"}
              />
          </button>

          <span className="absolute bottom-3 left-3 bg-(--primary-color)/70 text-(--text-primary) text-xs font-bold px-2 py-1 rounded">
            {event.category?.name}
          </span>
        </div>

        <div className="flex flex-col flex-1 gap-2 p-4 bg-gray-800/10">
          <h3 className="text-sm font-bold leading-snug text-(--text-primary) truncate">
            {event.title}
          </h3>

          <div className="flex items-center gap-1 text-gray-400">
            <MapPin size={11} />
            <span className="text-[11px] truncate">
              {event.location}
            </span>
          </div>

          <div className="flex items-center gap-1 text-gray-400">
            <span className="text-[11px]">
              {startDate.toLocaleDateString("vi-VN")}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <p className="mt-auto text-xs font-semibold text-(--text-primary)">
              {event.eventArtists.map((ea) => ea.artist.name).join(", ")}
            </p>

            <div className="flex items-center gap-1 text-gray-400">
              <Star fill="yellow" size={13} />
              <span className="text-[11px]">5.0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventItem;