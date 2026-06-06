import { resolvePublicAssetUrl } from '@/lib/url/resolvePublicAssetUrl';
import { useNavigate } from 'react-router-dom';
import LikeButton from '@/components/LikeButton';
import { CalendarDays, CircleAlert, MapPin } from 'lucide-react';
import { isEventEnded, isEventOngoing } from '@/utils/eventDate';

function EventItem({ event }) {
    const navigate = useNavigate();

    const ended = isEventEnded(event);
    const ongoing = !ended && isEventOngoing(event);
    const startDate = event?.startDate ? new Date(event.startDate) : null;

    const title = event?.title || 'Sự kiện chưa có tên';
    const slug = event?.slug;
    const location = event?.location || 'Địa điểm đang cập nhật';
    const categoryName = event?.category?.name || 'Sự kiện';

    const thumbnailUrl = resolvePublicAssetUrl(event?.thumbnailUrl);

    const eventArtists = event?.eventArtists?.filter((ea) => ea.artist) ?? [];

    const artistNames = eventArtists
        .map((ea) => ea.artist?.name)
        .filter(Boolean);

    const artistText =
        artistNames.length > 2
            ? `${artistNames.slice(0, 2).join(', ')} +${artistNames.length - 2}`
            : artistNames.join(', ') || 'Đang cập nhật nghệ sĩ';

    const visibleArtists = eventArtists.slice(0, 2);
    const remainingArtistCount = Math.max(
        eventArtists.length - visibleArtists.length,
        0
    );

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
            className={`
        group flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl
        border bg-(--background-color) shadow-sm shadow-black/10 transition-all duration-300
        ${
            ended
                ? 'border-white/10 saturate-[0.92] hover:border-rose-500/15 hover:shadow-lg hover:shadow-black/15'
                : 'border-white/10 hover:border-(--primary-color)/40 hover:shadow-2xl hover:shadow-black/20'
        }
      `}
        >
            <div className="relative overflow-hidden h-52">
                <img
                    src={thumbnailUrl}
                    alt={title}
                    className={`object-cover w-full h-full transition-transform duration-700 ${
                        ended
                            ? 'brightness-[0.88] saturate-[0.85]'
                            : 'group-hover:scale-110'
                    }`}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/5" />
                {ended ? (
                    <>
                        <div className="absolute inset-0 bg-black/35" />
                        <div className="absolute inset-0 bg-gradient-to-br from-zinc-950/20 via-transparent to-black/20" />
                    </>
                ) : null}

                <div
                    className={`absolute left-3 top-3 flex h-14 w-14 flex-col items-center justify-center rounded-2xl border backdrop-blur-md ${
                        ended
                            ? 'border-white/10 bg-black/25 text-white/75 opacity-80'
                            : 'border-white/20 bg-black/35 text-white'
                    }`}
                >
                    <span className="text-xl font-black leading-none">
                        {day}
                    </span>
                    <span className="mt-1 text-[10px] font-bold uppercase tracking-widest text-white/70">
                        {month}
                    </span>
                </div>

                <div
                    onClick={(e) => e.stopPropagation()}
                    className="absolute right-3 top-3"
                >
                    <LikeButton
                        eventId={event?.id}
                        size={15}
                        showCount={false}
                    />
                </div>

                {ended ? (
                    <span className="absolute left-1/2 top-3 z-10 -translate-x-1/2 rounded-full border border-rose-400/25 bg-rose-500/12 px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.14em] text-rose-200 backdrop-blur-md">
                        Đã diễn ra
                    </span>
                ) : ongoing ? (
                    <span className="absolute left-1/2 top-3 z-10 -translate-x-1/2 rounded-full border border-amber-400/30 bg-amber-500/15 px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.14em] text-amber-200 backdrop-blur-md">
                        Đang diễn ra
                    </span>
                ) : null}

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

            <div className="flex flex-col flex-1 gap-3 p-4">
                <div className="space-y-2">
                    <h3
                        className={`
              line-clamp-2 text-base font-black leading-snug transition-colors
              ${
                  ended
                      ? 'text-(--text-primary)/90 group-hover:text-(--text-primary)'
                      : 'text-(--text-primary) group-hover:text-(--primary-color)'
              }
            `}
                    >
                        {title}
                    </h3>

                    <div className="flex items-center gap-2 text-(--text-primary)/55">
                        <MapPin size={14} className="shrink-0" />
                        <span className="text-xs font-medium truncate">
                            {location}
                        </span>
                    </div>

                    <div className="flex items-center gap-2 text-(--text-primary)/55">
                        <CalendarDays size={14} className="shrink-0" />
                        <span className="text-xs font-medium truncate">
                            {startTime
                                ? `${startTime} · ${fullDate}`
                                : fullDate}
                        </span>
                    </div>

                    {ended ? (
                        <p className="flex items-center gap-1.5 pt-0.5 text-xs font-semibold text-rose-300/80">
                            <CircleAlert
                                size={13}
                                className="shrink-0 text-rose-300/70"
                            />
                            Sự kiện đã kết thúc
                        </p>
                    ) : ongoing ? (
                        <p className="flex items-center gap-1.5 pt-0.5 text-xs font-semibold text-amber-300/85">
                            <CircleAlert
                                size={13}
                                className="shrink-0 text-amber-300/75"
                            />
                            Sự kiện đang diễn ra
                        </p>
                    ) : null}
                </div>
                <div className="mt-auto flex items-center justify-between gap-3 border-t border-white/10 pt-3">
                    <div className="flex items-center min-w-0 gap-2">
                        {visibleArtists.length > 0 ? (
                            <div className="flex shrink-0 -space-x-2">
                                {visibleArtists.map((item) => {
                                    const name = item.artist?.name || 'Nghệ sĩ';
                                    const avatarUrl = resolvePublicAssetUrl(
                                        item.artist?.avatarUrl,
                                        ''
                                    );

                                    return avatarUrl ? (
                                        <img
                                            key={item.artist.id}
                                            src={avatarUrl}
                                            alt={name}
                                            className="h-5 w-5 rounded-full border-2 border-(--background-color) object-cover"
                                        />
                                    ) : (
                                        <div
                                            key={item.artist.id}
                                            className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-(--background-color) bg-(--primary-color)/10 text-xs font-black text-(--primary-color)"
                                        >
                                            {name.charAt(0).toUpperCase()}
                                        </div>
                                    );
                                })}

                                {remainingArtistCount > 0 ? (
                                    <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-(--background-color) bg-(--background-color) text-xs font-bold text-(--text-primary)/70">
                                        +{remainingArtistCount}
                                    </div>
                                ) : null}
                            </div>
                        ) : null}

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
