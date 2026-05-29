import { CalendarDays, MapPin, Sparkles } from 'lucide-react';
import { images } from '@/assets';

function EventsTitle({ totalEvents = 0 }) {
  return (
    <section className="relative overflow-hidden h-85 sm:h-105 md:h-125">
      <img
        src={images.home}
        alt=""
        className="absolute inset-0 object-cover w-full h-full"
      />

      <div className="absolute inset-0 bg-linear-to-r from-black/92 via-black/58 to-black/25" />
      <div className="absolute inset-0 bg-linear-to-t from-black/78 via-black/15 to-black/20" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_35%,rgba(168,85,247,0.34),transparent_36%)]" />

      <div className="container relative z-10 flex items-center h-full pt-4">
        <div className="max-w-3xl">
          <div className="mb-4 sm:mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-3 sm:px-4 py-1.5 sm:py-2 backdrop-blur-xl">
            <Sparkles
              size={12}
              className="text-(--primary-color) drop-shadow-[0_0_16px_rgba(168,85,247,0.9)]"
            />
            <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.26em] text-white/72">
              Khám phá sự kiện
            </span>
          </div>

          <h1 className="mb-3 sm:mb-5 max-w-3xl text-[28px] sm:text-[38px] md:text-[44px] lg:text-[52px] font-black leading-[1.1] sm:leading-[1.08] tracking-[-0.04em] sm:tracking-[-0.045em] text-white drop-shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
            Tìm kiếm những
            <br />
            <span className="bg-linear-to-r from-[#f0abfc] via-[#c084fc] to-[#9333ea] bg-clip-text text-transparent">
              trải nghiệm đáng nhớ
            </span>
          </h1>

          <p className="hidden max-w-2xl text-sm font-medium leading-7 sm:block sm:text-base sm:leading-8 text-white/68">
            Khám phá concert, lễ hội, workshop và các sự kiện nổi bật đang diễn
            ra quanh bạn.
          </p>

          <div className="flex flex-wrap items-center gap-2 mt-5 sm:mt-8 sm:gap-4">
            <div className="inline-flex items-center gap-2 px-3 py-2 text-xs font-bold text-white border rounded-full sm:gap-3 border-white/10 bg-white/10 sm:px-5 sm:py-3 sm:text-sm backdrop-blur-xl">
              <CalendarDays size={13} className="text-white/60 sm:hidden" />
              <CalendarDays size={16} className="hidden text-white/60 sm:block" />
              <span>{totalEvents} sự kiện đang mở</span>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-2 text-xs font-bold text-white border rounded-full sm:gap-3 border-white/10 bg-white/10 sm:px-5 sm:py-3 sm:text-sm backdrop-blur-xl">
              <MapPin size={13} className="text-white/60 sm:hidden" />
              <MapPin size={16} className="hidden text-white/60 sm:block" />
              <span>Nhiều địa điểm nổi bật</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default EventsTitle;