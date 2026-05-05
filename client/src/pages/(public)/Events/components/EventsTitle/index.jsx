import { images } from '@/assets';

function EventsTitle() {
  return (
    <div className="relative">
      <img src={images.home} alt="" className="object-cover w-full h-70" />
      <div className="absolute inset-0 bg-linear-to-r from-black/85 via-black/50 to-black/20" />
      <div className="container absolute flex items-center justify-between top-10 left-10 right-10">
        <div>
          <h1 className="mb-4 text-5xl font-black leading-tight text-(--text-primary)">
            All Events
          </h1>
          <p className="mb-8 text-sm leading-relaxed text-gray-400 max-w-120">
            Discover the best concerts, festivals, and live experiences
            happening near you and around the world.
          </p>
        </div>
      </div>
    </div>
  );
}

export default EventsTitle;
