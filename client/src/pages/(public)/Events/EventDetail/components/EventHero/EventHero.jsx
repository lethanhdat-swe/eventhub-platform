import { BadgeCheck, Heart, Share2, Bookmark } from 'lucide-react';
import { resolvePublicAssetUrl } from '@/lib/url/resolvePublicAssetUrl';
import { saveEventService } from '@/lib/services/saveEvent';
import { useEffect, useState } from 'react';
import LikeButton from '@/components/LikeButton';

function EventHero({ event }) {
  const startDate = new Date(event.startDate);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    saveEventService.list().then((data) => {
      const isSaved = data.some((item) => item.event.id === event.id);
      setSaved(isSaved);
    });
  }, [saved, event.id]);

  const handleBookmark = async (e) => {
    e.stopPropagation();
    if (loading) return;
    setLoading(true);
    try {
      const res = await saveEventService.toggle(event.id);
      setSaved(res);
    } catch (err) {
      console.error('Failed to toggle save:', err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="relative w-full overflow-hidden h-72 rounded-t-2xl lg:h-[19rem]">
      <img
        src={resolvePublicAssetUrl(event.thumbnailUrl)}
        alt={event.title}
        className="object-cover w-full h-full"
      />

      <div className="absolute inset-0 bg-linear-to-t from-(--bg-overlay) via-(--bg-overlay)/40 to-transparent" />

      <div className="absolute flex items-center gap-4 top-4 left-4">
        <div className=" px-3 py-2 text-center border  bg-(--background-color)/70 backdrop-blur-sm border-gray-700/50 rounded-xl min-w-13">
          <div className="text-(--text-primary) text-2xl font-bold leading-none">
            {startDate.getDate()}
          </div>

          <div className="text-(--text-primary)/60 text-xs font-semibold mt-0.5">
            {startDate.toLocaleString('default', {
              month: 'short',
            })}
          </div>

          <div className="text-(--text-primary)/60 text-xs">
            {startDate.getFullYear()}
          </div>

          <div className="text-(--text-primary)/60 text-xs mt-2">
            {startDate.toLocaleString('default', {
              weekday: 'long',
            })}
          </div>
        </div>

        <div>
          <span className="text-(--text-primary) text-[10px] font-bold leading-none bg-(--primary-color) p-2 rounded-[3px]">
            {event.category?.name}
          </span>

          <div className="flex items-center gap-3 mt-2">
            <h1 className="text-(--text-primary) text-xl lg:text-2xl">
              {event.title}
            </h1>

            <BadgeCheck
              fill="var(--primary-color)"
              color="var(--text-primary)"
            />
          </div>

          <p className="text-(--text-primary)/60 mt-2">{event.location}</p>
        </div>
      </div>
      <div className="absolute flex gap-2 top-4 right-4">
        <LikeButton eventId={event.id} size={18} showCount={true} />

        <button
          onClick={handleBookmark}
          disabled={loading}
          className="cursor-pointer flex items-center justify-center text-(--text-primary)/30 transition-all duration-200 border rounded-full w-9 h-9 bg-(--background-color)/70 backdrop-blur-sm border-gray-700/50 hover:border-(--primary-color)/60 hover:text-(--primary-color)"
        >
          <Bookmark
            color="var(--text-primary)"
            fill={saved ? 'var(--text-primary)' : 'none'}
            className="w-4 h-4"
          />
        </button>
      </div>
    </div>
  );
}

export default EventHero;
