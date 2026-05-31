import { useEffect, useMemo, useState } from 'react';
import { BadgeCheck, Bookmark, CalendarDays, MapPin } from 'lucide-react';
import { toast } from 'sonner';

import LikeButton from '@/components/LikeButton';
import { saveEventService } from '@/lib/services/saveEvent';
import { resolvePublicAssetUrl } from '@/lib/url/resolvePublicAssetUrl';

function getStoredUser() {
  try {
    const rawUser =
      localStorage.getItem('user') ||
      localStorage.getItem('currentUser') ||
      localStorage.getItem('authUser');

    if (!rawUser) return null;

    return JSON.parse(rawUser);
  } catch {
    return null;
  }
}

function getStoredToken() {
  return (
    localStorage.getItem('accessToken') ||
    localStorage.getItem('token') ||
    localStorage.getItem('authToken')
  );
}

function EventHero({ event }) {
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  const isLoggedIn = useMemo(() => {
    const user = getStoredUser();
    const token = getStoredToken();

    return Boolean(user?.id || user?._id || token);
  }, []);

  const startDate = new Date(event.startDate);

  useEffect(() => {
    let mounted = true;

    const fetchSavedEvents = async () => {
      if (!isLoggedIn) {
        setSaved(false);
        return;
      }

      try {
        const data = await saveEventService.list();

        if (!mounted) return;

        const savedEvents = data ?? [];

        const isSaved = savedEvents.some(
          (item) => item.event?.id === event.id || item.eventId === event.id
        );

        setSaved(isSaved);
      } catch (error) {
        console.error('Failed to fetch saved events:', error);
      }
    };

    if (event?.id) {
      fetchSavedEvents();
    }

    return () => {
      mounted = false;
    };
  }, [event?.id, isLoggedIn]);

  const handleBookmark = async (e) => {
    e.stopPropagation();

    if (!isLoggedIn) {
      toast.error('Vui lòng đăng nhập để lưu sự kiện.');
      return;
    }

    if (loading || !event?.id) return;

    const previousSaved = saved;
    const nextSaved = !previousSaved;

    setSaved(nextSaved);
    setLoading(true);

    try {
      const result = await saveEventService.toggle(event.id);

      const isSaved = result?.isSaved ?? nextSaved;

      setSaved(isSaved);

      toast.success(
        isSaved ? 'Sự kiện đã được lưu!' : 'Sự kiện đã được bỏ lưu!'
      );
    } catch (error) {
      console.error('Failed to toggle save:', error);

      setSaved(previousSaved);
      toast.error('Không thể cập nhật trạng thái lưu sự kiện.');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLikeClick = (e) => {
    if (isLoggedIn) return;

    e.preventDefault();
    e.stopPropagation();

    toast.error('Vui lòng đăng nhập để thả tim sự kiện.');
  };

  const day = startDate.getDate();
  const month = startDate.toLocaleString('vi-VN', { month: 'short' });
  const weekday = startDate.toLocaleString('vi-VN', { weekday: 'long' });
  const year = startDate.getFullYear();

  return (
    <section className="group relative h-[21rem] w-full overflow-hidden rounded-3xl border border-(--border-color) bg-(--card-surface-color) shadow-2xl shadow-black/20 lg:h-[25rem]">
      <img
        src={resolvePublicAssetUrl(event.thumbnailUrl)}
        alt={event.title}
        referrerPolicy="no-referrer"
        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
      />

      <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/35 to-black/25" />
      <div className="absolute inset-0 bg-linear-to-r from-black/55 via-transparent to-black/20" />

      <div className="absolute left-5 top-5 flex items-center gap-3">
        <div className="rounded-2xl border border-white/15 bg-black/45 px-3.5 py-3 text-center backdrop-blur-xl">
          <div className="text-2xl font-black leading-none text-white">
            {day}
          </div>

          <div className="mt-1 text-[11px] font-bold uppercase tracking-wide text-white/70">
            {month}
          </div>
        </div>

        <div className="hidden rounded-2xl border border-white/15 bg-black/35 px-4 py-3 backdrop-blur-xl sm:block">
          <div className="flex items-center gap-2 text-xs font-semibold text-white/80">
            <CalendarDays size={14} className="text-(--primary-color)" />
            <span>
              {weekday}, {year}
            </span>
          </div>

          <div className="mt-1 flex items-center gap-2 text-xs text-white/60">
            <MapPin size={14} className="text-(--primary-color)" />
            <span className="line-clamp-1">{event.location}</span>
          </div>
        </div>
      </div>

      <div className="absolute right-5 top-5 flex items-center gap-2">
        <div onClickCapture={handleGuestLikeClick}>
          <LikeButton eventId={event.id} size={18} showCount={true} />
        </div>

        <button
          type="button"
          onClick={handleBookmark}
          disabled={loading}
          aria-label={saved ? 'Bỏ lưu sự kiện' : 'Lưu sự kiện'}
          className={`
            flex h-10 w-10 cursor-pointer items-center justify-center
            rounded-full border border-white/15 bg-black/45 text-white/80
            backdrop-blur-xl transition-all duration-200
            hover:border-(--primary-color)/70
            hover:bg-(--primary-color)/15
            hover:text-white
            disabled:cursor-not-allowed disabled:opacity-60
            ${
              saved
                ? 'border-(--primary-color)/70 bg-(--primary-color)/20 text-white'
                : ''
            }
          `}
        >
          <Bookmark
            className="h-4 w-4"
            fill={saved ? 'currentColor' : 'none'}
          />
        </button>
      </div>

      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 lg:p-7">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          {event.category?.name && (
            <span className="rounded-full bg-(--primary-color) px-3 py-1.5 text-xs font-bold text-white shadow-lg shadow-(--primary-color)/25">
              {event.category.name}
            </span>
          )}

          <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/75 backdrop-blur-xl">
            EventHub verified
          </span>
        </div>

        <div className="flex max-w-3xl items-center gap-3">
          <h1 className="line-clamp-2 text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
            {event.title}
          </h1>

          <BadgeCheck
            size={26}
            className="mt-1 shrink-0 text-white"
            fill="var(--primary-color)"
          />
        </div>

        <p className="mt-3 flex max-w-2xl items-center gap-2 text-sm font-medium text-white/70 sm:text-base">
          <MapPin size={17} className="shrink-0 text-(--primary-color)" />
          <span className="line-clamp-1">{event.location}</span>
        </p>
      </div>
    </section>
  );
}

export default EventHero;
