import { images } from '@/assets';
import { TrendingUp, MapPin, MessageCircle } from 'lucide-react';

function EventCard({ event }) {
  const startDate = new Date(event.startDate);
  const day = startDate.getDate();
  const month = startDate.toLocaleString('en-US', { month: 'short' }).toUpperCase();

  return (
    <div className="group cursor-pointer flex flex-col rounded-2xl overflow-hidden border border-(--text-primary)/10 bg-(--background-color) hover:border-(--primary-color)/40 transition-all duration-300 hover:-translate-y-1">
      
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={`${import.meta.env.VITE_API_URL}/uploads/${event.thumbnailUrl}`}
          alt={event.title}
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
        />

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />

        {/* Date badge */}
        <div className="absolute flex flex-col items-center justify-center w-12 h-12 leading-tight top-3 left-3 bg-black/50 backdrop-blur-sm rounded-xl">
          <span className="text-lg font-black text-white">{day}</span>
          <span className="text-[10px] font-semibold tracking-widest text-gray-300">{month}</span>
        </div>

        {/* Category badge */}
        {event.category?.name && (
          <div className="absolute top-3 right-3 bg-(--primary-color)/80 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-1 rounded-lg">
            {event.category.name}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2 p-4">
        <h3 className="text-(--text-primary) font-bold text-sm leading-5 line-clamp-2">
          {event.title}
        </h3>

        <div className="flex items-center gap-1 text-(--text-primary)/50">
          <MapPin size={12} />
          <span className="text-[11px]">{event.location}</span>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-(--text-primary)/10 mt-1">
          <div className="flex items-center gap-1 text-(--text-primary)/60">
            <MessageCircle size={12} />
            <span className="text-[11px]">{event.commentCount} comments</span>
          </div>

          <div className="flex items-center gap-1 text-(--primary-color)">
            <TrendingUp size={12} />
            <span className="text-[11px] font-semibold">{event.trendingScore}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventCard;