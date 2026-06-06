import {
  CalendarDays,
  CircleAlert,
  Heart,
  MapPin,
  MessageCircle,
  Ticket,
  TrendingUp,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { resolvePublicAssetUrl } from '@/lib/url/resolvePublicAssetUrl';
import { isEventEnded, isEventOngoing } from '@/utils/eventDate';

function EventCard({ event }) {
  const ended = isEventEnded(event);
  const ongoing = !ended && isEventOngoing(event);
  const startDate = new Date(event.startDate);

  const day = startDate.getDate().toString().padStart(2, '0');
  const month = startDate
    .toLocaleString('vi-VN', { month: 'short' })
    .toUpperCase();

  const timeLabel = startDate.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const imageUrl = resolvePublicAssetUrl(event.thumbnailUrl, '');

  const artist = event.eventArtists?.[0]?.artist;

  const likeCount = event.likeCount ?? event._count?.likedByUsers ?? 0;
  const commentCount = event.commentCount ?? event._count?.comments ?? 0;
  const paidTicketCount = event.paidTicketCount ?? 0;
  const trendingScore = event.trendingScore ?? 0;

  return (
    <Link to={`/events/${event.slug}`}>
      <article
        className={`group relative h-70 cursor-pointer overflow-hidden rounded-[28px] border bg-zinc-950 shadow-[0_18px_50px_rgba(0,0,0,0.35)] transition-all duration-300 ${
          ended
            ? 'border-white/10 saturate-[0.92] hover:-translate-y-0.5 hover:border-rose-500/15 hover:shadow-[0_18px_40px_rgba(0,0,0,0.3)]'
            : 'border-white/10 hover:-translate-y-1 hover:border-(--primary-color)/45 hover:shadow-[0_18px_45px_rgba(168,85,247,0.14)]'
        }`}
      >
        {/* Image */}
        <img
          src={imageUrl}
          alt={event.title}
          className={`absolute inset-0 object-cover w-full h-full transition-transform duration-700 ${
            ended ? 'brightness-[0.88] saturate-[0.85]' : 'group-hover:scale-105'
          }`}
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/55 to-black/10" />
        <div className="absolute inset-0 bg-linear-to-r from-black/55 via-black/10 to-transparent" />
        {ended ? (
          <>
            <div className="absolute inset-0 bg-black/35" />
            <div className="absolute inset-0 bg-linear-to-br from-zinc-950/20 via-transparent to-black/20" />
          </>
        ) : null}

        {/* Top badges */}
        <div className="absolute flex items-start justify-between left-4 right-4 top-4">
          <div
            className={`flex h-14.5 w-14.5 flex-col items-center justify-center rounded-2xl backdrop-blur-md ring-1 ${
              ended
                ? 'bg-black/25 text-white/75 opacity-80 ring-white/10'
                : 'bg-black/50 ring-white/10 text-white'
            }`}
          >
            <span className="text-xl font-black leading-none">
              {day}
            </span>
            <span className="mt-1 text-[10px] font-bold tracking-[0.16em] text-white/60">
              {month}
            </span>
          </div>

          <div className="flex flex-col items-end gap-2">
            {ended ? (
              <span className="rounded-full border border-rose-400/25 bg-rose-500/12 px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.14em] text-rose-200 backdrop-blur-md">
                Đã diễn ra
              </span>
            ) : ongoing ? (
              <span className="rounded-full border border-amber-400/30 bg-amber-500/15 px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.14em] text-amber-200 backdrop-blur-md">
                Đang diễn ra
              </span>
            ) : null}
            {event.category?.name && (
              <span className="rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-bold text-white backdrop-blur-md ring-1 ring-white/10">
                {event.category.name}
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-white/65">
            <CalendarDays
              size={14}
              className={ended ? 'text-neutral-400' : 'text-(--primary-color)'}
            />
            <span className={ended ? 'text-white/55' : undefined}>{timeLabel}</span>

            {artist?.name && (
              <>
                <span className="w-1 h-1 rounded-full bg-white/35" />
                <span className="line-clamp-1">{artist.name}</span>
              </>
            )}
          </div>

          {ended ? (
            <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-rose-300/80">
              <CircleAlert size={13} className="shrink-0 text-rose-300/70" />
              Sự kiện đã kết thúc
            </p>
          ) : ongoing ? (
            <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-amber-300/85">
              <CircleAlert size={13} className="shrink-0 text-amber-300/75" />
              Sự kiện đang diễn ra
            </p>
          ) : null}

          <h3
            className={`line-clamp-1 text-[26px] font-black leading-tight tracking-tight drop-shadow ${
              ended ? 'text-white/90' : 'text-white'
            }`}
          >
            {event.title}
          </h3>

          <div className="flex items-center gap-2 mt-2 text-sm text-white/65">
            <MapPin size={15} className="shrink-0 text-(--primary-color)" />
            <span className="line-clamp-1">{event.location}</span>
          </div>

          <div className="mt-5 flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
            {/* Engagement */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/10 text-white/75 backdrop-blur-md ring-1 ring-white/10">
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
    </Link>
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
