import {
  Bookmark,
  CalendarDays,
  Heart,
  MapPin,
  MessageCircle,
  Ticket,
  TrendingUp,
} from 'lucide-react';

function EventCard({ event }) {
  const startDate = new Date(event.startDate);

  const day = startDate.getDate().toString().padStart(2, '0');
  const month = startDate
    .toLocaleString('en-US', { month: 'short' })
    .toUpperCase();

  const timeLabel = startDate.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const imageUrl = `${import.meta.env.VITE_API_URL}/uploads/${event.thumbnailUrl}`;

  const artist = event.eventArtists?.[0]?.artist;

  const likeCount = event.likeCount ?? event._count?.likedByUsers ?? 0;
  const commentCount = event.commentCount ?? event._count?.comments ?? 0;
  const paidTicketCount = event.paidTicketCount ?? 0;
  const trendingScore = event.trendingScore ?? 0;

  return (
    <article className="group relative h-[280px] cursor-pointer overflow-hidden rounded-[28px] border border-white/10 bg-zinc-950 shadow-[0_18px_50px_rgba(0,0,0,0.35)] transition-all duration-300 hover:-translate-y-1 hover:border-(--primary-color)/45 hover:shadow-[0_18px_45px_rgba(168,85,247,0.14)]">
      {/* Image */}
      <img
        src={imageUrl}
        alt={event.title}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/10" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/10 to-transparent" />

      {/* Top badges */}
      <div className="absolute left-4 right-4 top-4 flex items-start justify-between">
        <div className="flex h-[58px] w-[58px] flex-col items-center justify-center rounded-2xl bg-black/50 backdrop-blur-md ring-1 ring-white/10">
          <span className="text-xl font-black leading-none text-white">
            {day}
          </span>
          <span className="mt-1 text-[10px] font-bold tracking-[0.16em] text-white/60">
            {month}
          </span>
        </div>

        {event.category?.name && (
          <span className="rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-bold text-white backdrop-blur-md ring-1 ring-white/10">
            {event.category.name}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-white/65">
          <CalendarDays size={14} className="text-(--primary-color)" />
          <span>{timeLabel}</span>

          {artist?.name && (
            <>
              <span className="h-1 w-1 rounded-full bg-white/35" />
              <span className="line-clamp-1">{artist.name}</span>
            </>
          )}
        </div>

        <h3 className="line-clamp-1 text-[26px] font-black leading-tight tracking-tight text-white drop-shadow">
          {event.title}
        </h3>

        <div className="mt-2 flex items-center gap-2 text-sm text-white/65">
          <MapPin size={15} className="shrink-0 text-(--primary-color)" />
          <span className="line-clamp-1">{event.location}</span>
        </div>

        <div className="mt-5 flex items-center justify-between gap-3">
          {/* Engagement */}
          <div className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-white/75 backdrop-blur-md ring-1 ring-white/10">
            <Stat icon={<Heart size={14} />} value={likeCount} />
            <Stat icon={<MessageCircle size={14} />} value={commentCount} />
            <Stat icon={<Ticket size={14} />} value={paidTicketCount} />
          </div>

          {/* Trending */}
          <div className="flex items-center gap-1.5 rounded-full bg-(--primary-color)/25 px-3.5 py-2 text-sm font-black text-white backdrop-blur-md ring-1 ring-(--primary-color)/35">
            <TrendingUp size={15} />
            <span>{trendingScore}</span>
          </div>
        </div>
      </div>
    </article>
  );
}

function Stat({ icon, value }) {
  return (
    <div className="flex items-center gap-1.5 text-xs font-semibold">
      <span className="text-(--primary-color)">{icon}</span>
      <span>{value}</span>
    </div>
  );
}

export default EventCard;
