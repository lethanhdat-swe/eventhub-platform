import { CalendarDays, MapPin } from 'lucide-react';
import { images } from '@/assets';

const popularEvents = [
  {
    id: 1,
    title: 'Electric Daisy Carnival',
    location: 'Las Vegas, USA',
    date: 'May 25 - 28, 2025',
    image: images.home,
  },
  {
    id: 2,
    title: 'The Weeknd Live',
    location: 'London, UK',
    date: 'May 24, 2025',
    image: images.home,
  },
  {
    id: 3,
    title: 'Tech Summit 2024',
    location: 'Lisbon, Portugal',
    date: 'May 26 - 28, 2025',
    image: images.home,
  },
];

function Popular() {
  return (
    <div
      className="
    relative w-[360px] overflow-hidden rounded-[28px]
    border border-white/10
    bg-black/15
    px-5 py-4
    text-white
    backdrop-blur-md
  "
    >
      <div
        className="
    absolute -right-16 top-10
    size-40 rounded-full
    bg-[var(--primary-color)]/15
    blur-3xl
  "
      />
      <p className="mb-6 text-sm font-semibold text-white/85">
        Popular This Week
      </p>

      <div className="space-y-5">
        {popularEvents.map((event) => (
          <div
            key={event.id}
            className="
              group flex items-center gap-4
              transition-all duration-300
              hover:translate-x-1
            "
          >
            {/* Thumbnail */}
            <div className="relative size-20 shrink-0 overflow-hidden rounded-2xl">
              <img
                src={event.image}
                alt={event.title}
                className="
                  h-full w-full object-cover
                  transition-transform duration-500
                  group-hover:scale-110
                "
              />

              <div className="absolute inset-0 bg-black/15" />
            </div>

            {/* Content */}
            <div className="min-w-0">
              <h4
                className="
                  truncate text-[18px]
                  font-semibold leading-tight text-white
                "
              >
                {event.title}
              </h4>

              <div className="mt-2 flex items-center gap-2 text-sm text-white/60">
                <MapPin size={15} className="text-white/40" />
                <span className="truncate">{event.location}</span>
              </div>

              <div className="mt-1 flex items-center gap-2 text-sm text-white/60">
                <CalendarDays size={15} className="text-white/40" />
                <span>{event.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Popular;
