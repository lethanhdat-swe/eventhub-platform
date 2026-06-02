import { ArrowRight, CalendarDays, Clock, MapPin, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

function PublicEventCard({ event }) {
  const startDate = new Date(event.startDate);

  const day = startDate.getDate().toString().padStart(2, '0');

  const month = startDate
    .toLocaleString('vi-VN', { month: 'short' })
    .replace('thg ', 'T')
    .toUpperCase();

  const dateLabel = startDate.toLocaleDateString('vi-VN', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
  });

  const timeLabel = startDate.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const imageUrl = `${import.meta.env.VITE_API_URL}/uploads/${event.thumbnailUrl}`;

  const artists = event.eventArtists ?? [];
  const visibleArtists = artists.slice(0, 3);
  const remainingArtistCount = Math.max(
    artists.length - visibleArtists.length,
    0
  );

  return (
    <Link
      to={`/events/${event.slug}`}
      className="group relative block overflow-hidden rounded-[28px] border border-(--text-primary)/10 bg-(--surface-color) transition-all duration-300 hover:-translate-y-1 hover:border-(--primary-color)/45 hover:shadow-[0_24px_80px_rgba(124,58,237,0.18)]"
    >
      {/* Image */}
      <div className="relative h-62.5 overflow-hidden">
        <img
          src={imageUrl}
          alt={event.title}
          className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/35 to-black/5" />
        <div className="absolute inset-0 bg-linear-to-r from-black/45 via-transparent to-transparent" />

        {/* Top badges */}
        <div className="absolute flex items-start justify-between gap-3 left-4 right-4 top-4">
          <div className="flex h-14.5 w-14.5 flex-col items-center justify-center rounded-2xl bg-black/50 text-white backdrop-blur-md ring-1 ring-white/10">
            <span className="text-xl font-black leading-none">{day}</span>
            <span className="mt-1 text-[10px] font-bold tracking-[0.16em] text-white/65">
              {month}
            </span>
          </div>

          {event.category?.name && (
            <span className="rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-bold text-white backdrop-blur-md ring-1 ring-white/10">
              {event.category.name}
            </span>
          )}
        </div>

        {/* Bottom content on image */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <div className="mb-3 inline-flex rounded-full bg-(--primary-color) px-3.5 py-1.5 text-xs font-black text-white shadow-[0_12px_35px_rgba(124,58,237,0.35)]">
            Đang mở bán
          </div>

          <h3 className="line-clamp-2 text-[26px] font-black leading-tight tracking-tight text-white drop-shadow">
            {event.title}
          </h3>
        </div>
      </div>

      {/* Info */}
      <div className="p-5">
        <div className="grid gap-3">
          <InfoItem icon={<CalendarDays size={16} />} text={dateLabel} />
          <InfoItem icon={<Clock size={16} />} text={timeLabel} />
          <InfoItem icon={<MapPin size={16} />} text={event.location} />
        </div>

        <div className="mt-5 flex items-center justify-between gap-4 border-t border-(--text-primary)/10 pt-4">
          <div className="flex items-center min-w-0 gap-2">
            {visibleArtists.length > 0 ? (
              <div className="flex -space-x-2">
                {visibleArtists.map((item) => (
                  <img
                    key={item.artist.id}
                    src={`${import.meta.env.VITE_API_URL}${item.artist.avatarUrl}`}
                    alt={item.artist.name}
                    className="h-8 w-8 rounded-full border-2 border-(--surface-color) object-cover"
                  />
                ))}

                {remainingArtistCount > 0 && (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-(--surface-color) bg-(--background-color) text-xs font-bold text-(--text-primary)/70">
                    +{remainingArtistCount}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-(--background-color) text-(--primary-color)">
                <Users size={16} />
              </div>
            )}

            <span className="line-clamp-1 text-sm font-semibold text-(--text-primary)/60">
              {visibleArtists[0]?.artist?.name || 'Nghệ sĩ đang cập nhật'}
            </span>
          </div>

          <div className="flex shrink-0 items-center gap-1.5 rounded-full bg-(--primary-color)/10 px-3.5 py-2 text-sm font-black text-(--primary-color) transition group-hover:bg-(--primary-color) group-hover:text-white">
            Chi tiết
            <ArrowRight
              size={16}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </div>
        </div>
      </div>
    </Link>
  );
}

function InfoItem({ icon, text }) {
  return (
    <div className="flex items-center gap-2 text-sm text-(--text-primary)/60">
      <span className="shrink-0 text-(--primary-color)">{icon}</span>
      <span className="line-clamp-1">{text}</span>
    </div>
  );
}

export default PublicEventCard;
