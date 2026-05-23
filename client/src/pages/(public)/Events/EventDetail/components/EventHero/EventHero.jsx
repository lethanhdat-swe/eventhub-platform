import { BadgeCheck, Heart, Share2 } from "lucide-react";

function EventHero({ event }) {
  const startDate = new Date(event.startDate);

  return (
    <div className="relative w-full overflow-hidden h-80 rounded-t-2xl">
      <img
        src={`${import.meta.env.VITE_API_URL}/uploads/${event.thumbnailUrl}`}
        alt={event.title}
        className="object-cover w-full h-full"
      />

      <div className="absolute inset-0 bg-linear-to-t from-(--bg-overlay) via-(--bg-overlay)/40 to-transparent" />

      <div className="absolute px-3 py-2 text-center border top-4 left-4 bg-(--background-color)/70 backdrop-blur-sm border-gray-700/50 rounded-xl min-w-13">
        <div className="text-(--text-primary) text-2xl font-bold leading-none">
          {startDate.getDate()}
        </div>

        <div className="text-(--text-primary)/60 text-xs font-semibold mt-0.5">
          {startDate.toLocaleString("default", {
            month: "short",
          })}
        </div>

        <div className="text-(--text-primary)/60 text-xs">
          {startDate.getFullYear()}
        </div>

        <div className="text-(--text-primary)/60 text-xs mt-2">
          {startDate.toLocaleString("default", {
            weekday: "long",
          })}
        </div>
      </div>

      <div className="absolute flex gap-2 top-4 right-4">
        <button className="flex items-center justify-center text-(--text-primary)/30 transition-all duration-200 border rounded-full w-9 h-9 bg-(--background-color)/70 backdrop-blur-sm border-gray-700/50 hover:border-(--primary-color)/60 hover:text-(--primary-color)">
          <Heart className="w-4 h-4" />
        </button>

        <button className="flex items-center justify-center text-(--text-primary)/30 transition-all duration-200 border rounded-full w-9 h-9 bg-(--background-color)/70 backdrop-blur-sm border-gray-700/50 hover:border-(--primary-color)/60 hover:text-(--primary-color)">
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      <div className="absolute bottom-5 left-4">
        <span className="text-white text-[10px] font-bold leading-none bg-(--primary-color) p-2 rounded-[3px]">
          {event.category?.name}
        </span>

        <div className="flex items-center gap-3 mt-2">
          <h1 className="text-(--text-primary) text-2xl">
            {event.title}
          </h1>

          <BadgeCheck
            fill="var(--primary-color)"
            color="white"
          />
        </div>

        <p className="text-(--text-primary)/60 mt-2">
          {event.location}
        </p>
      </div>
    </div>
  );
}

export default EventHero;