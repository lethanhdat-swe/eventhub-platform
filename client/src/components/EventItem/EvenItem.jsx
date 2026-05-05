import { Heart, MapPin, Star } from 'lucide-react';

function EvenItem({ event }) {
  return (
    <>
      <div className="flex flex-col h-full overflow-hidden cursor-pointer group rounded-xl">
        <div className="relative">
          <img
            src={event.image}
            alt={event.title}
            className="object-cover w-full transition-transform duration-500 h-50 group-hover:scale-105"
          />

          <div className="absolute flex flex-col items-center leading-tight top-3 left-3 bg-(--background-color)/70 rounded-lg w-12 h-12">
            <span className="text-xl font-black text-white">
              {event.date.day}
            </span>
            <span className="text-gray-300 text-[10px] font-semibold tracking-widest">
              {event.date.month}
            </span>
          </div>

          <button className="absolute flex items-center justify-center w-8 h-8 transition-all duration-200 rounded-full top-3 right-3 bg-(--background-color)/40  hover:bg-(--background-color)/60">
            <Heart size={14} />
          </button>

          <span className="absolute bottom-3 left-3 bg-(--primary-color)/70 text-white text-xs font-bold px-2 py-1 rounded">
            {event.tag}
          </span>
        </div>

        <div className="flex flex-col flex-1 gap-2 p-4 bg-gray-800/10">
          <h3 className="text-sm font-bold leading-snug text-white truncate">
            {event.title}
          </h3>
          <div className="flex items-center gap-1 text-gray-400">
            <MapPin size={11} />
            <span className="text-[11px] truncate">{event.location}</span>
          </div>
          {event.date.year && (
            <div className="flex items-center gap-1 text-gray-400">
              <span className="text-[11px]">
                {event.date.weekday}, {event.date.day} {event.date.month}{' '}
                {event.date.year} - {event.date.time} {event.date.period}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <p className="mt-auto text-xs font-semibold text-white">
              From <span>$ {event.price.toLocaleString('de-DE')}</span>
            </p>

            {event.date.year && (
              <div className="flex items-center gap-1 text-gray-400">
                <Star fill="yellow" size={13} />
                <span className="text-[11px]">{event.rating}</span>
                <span className="text-[10px]">({event.reviewCount})</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default EvenItem;
