import { images } from '@/assets';
import { resolvePublicAssetUrl } from '@/lib/url/resolvePublicAssetUrl';

function EventHeroVisual({ event }) {
  const imageUrl = resolvePublicAssetUrl(event?.thumbnailUrl) || images.home;

  return (
    <div className="mx-auto flex h-56 w-full max-w-full items-center justify-center overflow-hidden rounded-xl md:h-72 lg:ml-auto lg:max-w-[460px]">
      <img
        src={imageUrl}
        alt={event?.title ?? 'Event'}
        className="h-full w-full rounded-xl object-cover transition-transform duration-500 hover:scale-105"
      />
    </div>
  );
}

export default EventHeroVisual;
