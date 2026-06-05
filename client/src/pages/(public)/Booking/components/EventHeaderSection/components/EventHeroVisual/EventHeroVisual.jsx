import { images } from '@/assets';
import { resolvePublicAssetUrl } from '@/lib/url/resolvePublicAssetUrl';

function EventHeroVisual({ event }) {
  const imageUrl = resolvePublicAssetUrl(event?.thumbnailUrl) || images.home;

  return (
    <div className="flex items-center justify-center w-full h-56 max-w-full mx-auto overflow-hidden rounded-xl md:h-72 lg:ml-auto lg:max-w-115">
      <img
        src={imageUrl}
        alt={event?.title ?? 'Event'}
        className="object-cover w-full h-full transition-transform duration-500 rounded-xl hover:scale-105"
      />
    </div>
  );
}

export default EventHeroVisual;
