import { Heart } from 'lucide-react';

function EventCard({ event }) {
  return (
    <div className="flex gap-5 overflow-hidden cursor-pointer group">
      <div className="relative">
        <img
          src={event.image}
          alt={event.title}
          className="object-cover transition-transform duration-500 w-55 h-35 rounded-2xl group-hover:scale-105"
        />

        <div className="absolute flex flex-col items-center leading-tight top-3 left-3 bg-(--background-color)/70 rounded-lg w-12 h-12">
          <span className="text-xl font-black text-(--text-primary)">
            {event.date.day}
          </span>
          <span className="text-gray-300 text-[10px] font-semibold tracking-widest">
            {event.date.month}
          </span>
        </div>
      </div>

      <div className="flex flex-col justify-around">
        <div>
          <h3 className="text-sm font-bold leading-5 text-(--text-primary)">
            {event.title}
          </h3>
          <span className="text-[11px] text-gray-400">{event.location}</span>
        </div>

        <div className="flex justify-between">
          <p className="text-xs font-semibold text-(--text-primary)">
            From <span>$ {event.price.toLocaleString('de-DE')}</span>
          </p>

          <Heart size={15} color="red" />
        </div>
      </div>
    </div>
  );
}

export default EventCard;
