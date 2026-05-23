import { images } from "@/assets";
import { resolvePublicAssetUrl } from '@/lib/url/resolvePublicAssetUrl';

function EventHeroVisual({ event }) {
    const imageUrl = resolvePublicAssetUrl(event?.thumbnailUrl) || images.home;

    return ( 
      <div className="ml-auto flex h-64 w-full max-w-[460px] items-center justify-center overflow-hidden rounded-xl lg:h-72">
        <img
          src={imageUrl}
          alt={event?.title ?? 'Event'}
          className="h-full w-full rounded-xl object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>
     );
}

export default EventHeroVisual;