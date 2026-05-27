import EventItem from '@/components/EventItem/EventItem';
import {
  ArrowRight,
  CalendarHeart,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

function FeaturedEvents({ events = [] }) {
  if (!events.length) return null;

  return (
    <section className="overflow-x-clip mt-16">
      <div className="container overflow-visible">
        <div className="mb-7 flex items-end justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-(--primary-color)/10 text-(--primary-color)">
              <CalendarHeart size={23} />
            </div>

            <div>
              <p className="mb-2 text-sm font-black uppercase tracking-[0.24em] text-(--primary-color)">
                Sự kiện nổi bật
              </p>

              <h2 className="text-2xl font-black tracking-tight text-(--text-primary) md:text-3xl">
                Những sự kiện đáng chú ý
              </h2>

              <p className="mt-2 max-w-xl text-sm leading-6 text-(--text-primary)/55">
                Khám phá các sự kiện đang được mở bán và nhận được nhiều sự quan
                tâm.
              </p>
            </div>
          </div>

          <Link
            to="/events"
            className="
              group hidden items-center gap-2 rounded-full border border-(--text-primary)/10
              bg-(--surface-color) px-5 py-2.5 text-sm font-bold text-(--text-primary)/80
              shadow-sm transition hover:border-(--primary-color)/40 hover:text-(--primary-color)
              sm:flex
            "
          >
            Xem tất cả
            <ArrowRight
              size={17}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>

        <div className="relative">
          <button
            type="button"
            aria-label="Previous featured event"
            className="
              featured-prev absolute -left-10 top-1/2 z-30 hidden h-12 w-12
              -translate-y-1/2 items-center justify-center rounded-full
              border border-white/10 bg-black/70 text-white shadow-xl backdrop-blur-md
              transition hover:border-(--primary-color)/50 hover:bg-(--primary-color)
              xl:flex 2xl:-left-16
              [&.swiper-button-disabled]:pointer-events-none
              [&.swiper-button-disabled]:opacity-25
            "
          >
            <ChevronLeft size={22} />
          </button>

          <button
            type="button"
            aria-label="Next featured event"
            className="
              featured-next absolute -right-10 top-1/2 z-30 hidden h-12 w-12
              -translate-y-1/2 items-center justify-center rounded-full
              border border-white/10 bg-black/70 text-white shadow-xl backdrop-blur-md
              transition hover:border-(--primary-color)/50 hover:bg-(--primary-color)
              xl:flex 2xl:-right-16
              [&.swiper-button-disabled]:pointer-events-none
              [&.swiper-button-disabled]:opacity-25
            "
          >
            <ChevronRight size={22} />
          </button>

          <div className="overflow-hidden py-4">
            <Swiper
              modules={[Autoplay, Navigation, Pagination]}
              autoplay={{
                delay: 4000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              speed={800}
              navigation={{
                prevEl: '.featured-prev',
                nextEl: '.featured-next',
              }}
              pagination={{
                clickable: true,
                el: '.featured-pagination',
              }}
              spaceBetween={24}
              slidesPerView={1}
              breakpoints={{
                640: {
                  slidesPerView: 1.15,
                  spaceBetween: 20,
                },
                768: {
                  slidesPerView: 2,
                  spaceBetween: 24,
                },
                1280: {
                  slidesPerView: 3,
                  spaceBetween: 24,
                },
              }}
              className="featured-event-swiper"
            >
              {events.map((event) => (
                <SwiperSlide key={event.id} className="h-auto">
                  <EventItem event={event} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          <div className="featured-pagination mt-5 flex justify-center" />
        </div>

        <Link
          to="/events"
          className="
            mt-7 flex items-center justify-center gap-2 rounded-full
            border border-(--primary-color)/25 bg-(--primary-color)/10
            px-5 py-3 text-sm font-bold text-(--primary-color)
            transition hover:bg-(--primary-color) hover:text-white sm:hidden
          "
        >
          Xem tất cả
          <ArrowRight size={17} />
        </Link>
      </div>
    </section>
  );
}

export default FeaturedEvents;
