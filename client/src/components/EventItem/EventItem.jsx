import LikeButton from '@/components/LikeButton';
import { resolvePublicAssetUrl } from '@/lib/url/resolvePublicAssetUrl';
import { CalendarDays, MapPin, UserRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function EventItem({ event }) {
  const navigate = useNavigate();

  const startDate = event?.startDate ? new Date(event.startDate) : null;

  const title = event?.title || 'Sự kiện chưa có tên';
  const slug = event?.slug;
  const location = event?.location || 'Địa điểm đang cập nhật';
  const categoryName = event?.category?.name || 'Sự kiện';

  const thumbnailUrl = resolvePublicAssetUrl(event?.thumbnailUrl);

  const artists =
    event?.eventArtists?.map((ea) => ea.artist?.name).filter(Boolean) || [];

  const artistText =
    artists.length > 2
      ? `${artists.slice(0, 2).join(', ')} +${artists.length - 2}`
      : artists.join(', ') || 'Đang cập nhật nghệ sĩ';

  const day = startDate ? startDate.getDate() : '--';

  const month = startDate
    ? startDate.toLocaleDateString('vi-VN', {
        month: 'short',
      })
    : '--';

  const fullDate = startDate
    ? startDate.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    : 'Đang cập nhật';

  const startTime = startDate
    ? startDate.toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : null;

  const handleNavigate = () => {
    if (!slug) return;
    navigate(`/events/${slug}`);
  };

  return (
    <article
      onClick={handleNavigate}
      className="
        group flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl
        border border-white/10 bg-(--background-color)
        shadow-sm shadow-black/10 transition-all duration-300
         hover:border-(--primary-color)/40 hover:shadow-2xl hover:shadow-black/20
      "
    >
      <div className="relative h-52 overflow-hidden">
        <img
          src={thumbnailUrl}
          alt={title}
          className="
            h-full w-full object-cover transition-transform duration-700
            group-hover:scale-110
          "
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/5" />

        <div
          className="
            absolute left-3 top-3 flex h-14 w-14 flex-col items-center justify-center
            rounded-2xl border border-white/20 bg-black/35 text-white backdrop-blur-md
          "
        >
          <span className="text-xl font-black leading-none">{day}</span>
          <span className="mt-1 text-[10px] font-bold uppercase tracking-widest text-white/70">
            {month}
          </span>
        </div>

        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute right-3 top-3"
        >
          <LikeButton eventId={event?.id} size={15} showCount={false} />
        </div>

        <span
          className="
            absolute bottom-3 left-3 max-w-[75%] truncate rounded-full
            border border-white/20 bg-white/15 px-3 py-1
            text-xs font-bold text-white shadow-sm backdrop-blur-md
          "
        >
          {categoryName}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="space-y-2">
          <h3
            className="
              line-clamp-2 text-base font-black leading-snug
              text-(--text-primary) transition-colors
              group-hover:text-(--primary-color)
            "
          >
            {title}
          </h3>

          <div className="flex items-center gap-2 text-(--text-primary)/55">
            <MapPin size={14} className="shrink-0" />
            <span className="truncate text-xs font-medium">{location}</span>
          </div>

          <div className="flex items-center gap-2 text-(--text-primary)/55">
            <CalendarDays size={14} className="shrink-0" />
            <span className="truncate text-xs font-medium">
              {startTime ? `${startTime} · ${fullDate}` : fullDate}
            </span>
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-white/10 pt-3">
          <div className="flex min-w-0 items-center gap-2">
            <div
              className="
                flex h-8 w-8 shrink-0 items-center justify-center rounded-full
                bg-(--primary-color)/10 text-(--primary-color)
              "
            >
              <UserRound size={15} />
            </div>

            <p className="truncate text-xs font-bold text-(--text-primary)/85">
              {artistText}
            </p>
          </div>

          <span
            className="
              shrink-0 text-xs font-black text-(--primary-color)
              transition-transform duration-300 group-hover:translate-x-0.5
            "
          >
            Xem chi tiết →
          </span>
        </div>
      </div>
    </article>
  );
}

export default EventItem;
