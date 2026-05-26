import { resolvePublicAssetUrl } from '@/lib/url/resolvePublicAssetUrl';
import { MapPin, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LikeButton from '@/components/LikeButton';

function EventItem({ event }) {
  const navigate = useNavigate();
  const startDate = new Date(event.startDate);

  return (
    <div onClick={() => navigate(`/events/${event.slug}`)}>
      <div className="flex flex-col h-full overflow-hidden cursor-pointer group rounded-xl">
        <div className="relative">
          <img
            src={resolvePublicAssetUrl(event.thumbnailUrl)}
            alt={event.title}
            className="object-cover w-full transition-transform duration-500 h-50 group-hover:scale-105"
          />

          <div className="absolute flex flex-col items-center leading-tight top-3 left-3 bg-(--background-color)/70 rounded-lg w-12 h-12">
            <span className="text-xl font-black text-(--text-primary)">
              {startDate.getDate()}
            </span>

            <span className="text-(--text-primary)/50 text-[10px] font-semibold tracking-widest">
              {startDate.toLocaleString('default', {
                month: 'short',
              })}
            </span>
          </div>

          <div className="absolute top-3 right-3">
            <LikeButton eventId={event.id} size={14} showCount={false} />
          </div>

          <span className="absolute bottom-3 left-3 bg-(--primary-color)/70 text-(--text-primary) text-xs font-bold px-2 py-1 rounded">
            {event.category?.name}
          </span>
        </div>

        <div className="flex flex-col flex-1 gap-2 p-4 bg-gray-800/10">
          <h3 className="text-sm font-bold leading-snug text-(--text-primary) truncate">
            {event.title}
          </h3>

          <div className="flex items-center gap-1 text-gray-400">
            <MapPin size={11} />
            <span className="text-[11px] truncate">{event.location}</span>
          </div>

          <div className="flex items-center gap-1 text-gray-400">
            <span className="text-[11px]">
              {startDate.toLocaleDateString('vi-VN')}
            </span>
          </div>

          <div className="flex items-center justify-between">
            {/* <p className="mt-auto text-xs font-semibold text-(--text-primary)">
              {event.eventArtists.map((ea) => ea.artist.name).join(', ')}
            </p> */}

            <div className="flex items-center gap-1 text-gray-400">
              <Star fill="yellow" size={13} />
              <span className="text-[11px]">5.0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventItem;
