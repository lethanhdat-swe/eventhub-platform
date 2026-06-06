import EventItem from '@/components/EventItem/EventItem';
import MotionButton from '@/components/motion/MotionButton';
import MotionSection from '@/components/motion/MotionSection';
import {
  fadeInVariants,
  fadeUpVariants,
  motionTransition,
  staggerContainerVariants,
} from '@/constants/motion';
import {
  ArrowRight,
  CalendarHeart,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const titleLeftVariants = {
  hidden: {
    opacity: 0,
    x: -18,
  },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      x: motionTransition.smooth,
      opacity: motionTransition.opacity,
    },
  },
};

const actionRightVariants = {
  hidden: {
    opacity: 0,
    x: 18,
  },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      x: motionTransition.smooth,
      opacity: motionTransition.opacity,
    },
  },
};

function FeaturedEvents({ events = [], loading = false }) {
  if (!loading && !events.length) return null;

  return (
    <MotionSection className="mt-16 overflow-x-clip">
      <div className="container overflow-visible">
        <motion.div
          variants={staggerContainerVariants}
          className="flex items-center justify-between gap-4 mb-7"
        >
          <motion.div
            variants={titleLeftVariants}
            className="flex items-start gap-3"
          >
            <motion.div
              variants={fadeInVariants}
              whileHover={{ rotate: -4, scale: 1.06 }}
              transition={motionTransition.fast}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-(--primary-color)/10 text-(--primary-color)"
            >
              <CalendarHeart size={23} />
            </motion.div>

            <div>
              <p className="mb-2 text-sm font-black tracking-[0.24em] text-(--primary-color) uppercase">
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
          </motion.div>

          <motion.div
            variants={actionRightVariants}
            className="hidden sm:block"
          >
            <MotionButton>
              <Link
                to="/events"
                className="
                  group flex items-center gap-2 rounded-full border border-(--text-primary)/10
                  bg-(--surface-color) px-5 py-2.5 text-sm font-bold text-(--text-primary)/80
                  shadow-sm transition-colors duration-300 hover:border-(--primary-color)/40 hover:text-(--primary-color)
                "
              >
                Xem tất cả
                <ArrowRight
                  size={17}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </MotionButton>
          </motion.div>
        </motion.div>

        <motion.div variants={fadeUpVariants} className="relative">
          {!loading && (
            <>
              <motion.button
                type="button"
                aria-label="Sự kiện nổi bật trước"
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.96 }}
                transition={motionTransition.fast}
                className="
                  featured-prev absolute -left-10 top-1/2 z-30 hidden h-12 w-12
                  -translate-y-1/2 items-center justify-center rounded-full
                  border border-white/10 bg-black/70 text-white shadow-xl backdrop-blur-md
                  transition-colors duration-300 hover:border-(--primary-color)/50 hover:bg-(--primary-color)
                  xl:flex 2xl:-left-16
                  [&.swiper-button-disabled]:pointer-events-none
                  [&.swiper-button-disabled]:opacity-25
                "
              >
                <ChevronLeft size={22} />
              </motion.button>

              <motion.button
                type="button"
                aria-label="Sự kiện nổi bật tiếp theo"
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.96 }}
                transition={motionTransition.fast}
                className="
                  featured-next absolute -right-10 top-1/2 z-30 hidden h-12 w-12
                  -translate-y-1/2 items-center justify-center rounded-full
                  border border-white/10 bg-black/70 text-white shadow-xl backdrop-blur-md
                  transition-colors duration-300 hover:border-(--primary-color)/50 hover:bg-(--primary-color)
                  xl:flex 2xl:-right-16
                  [&.swiper-button-disabled]:pointer-events-none
                  [&.swiper-button-disabled]:opacity-25
                "
              >
                <ChevronRight size={22} />
              </motion.button>
            </>
          )}

          <div className="py-4 overflow-hidden">
            {loading ? (
              <motion.div
                variants={staggerContainerVariants}
                className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3"
              >
                {Array.from({ length: 3 }).map((_, index) => (
                  <motion.div key={index} variants={fadeUpVariants}>
                    <FeaturedEventSkeleton />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <Swiper
                modules={[Autoplay, Navigation, Pagination]}
                autoplay={{
                  delay: 4000,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }}
                loop
                speed={900}
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
                {events.map((event, index) => {
                  const delay = Math.min(index * 0.12, 0.48);

                  return (
                    <SwiperSlide key={event.id} className="h-auto">
                      <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{
                          y: {
                            ...motionTransition.smooth,
                            delay,
                          },
                          opacity: {
                            ...motionTransition.opacity,
                            delay,
                          },
                        }}
                        className="h-full"
                      >
                        <EventItem event={event} />
                      </motion.div>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            )}
          </div>

          {!loading && (
            <motion.div
              variants={fadeInVariants}
              className="flex justify-center mt-5 featured-pagination"
            />
          )}
        </motion.div>

        <motion.div variants={fadeUpVariants} className="sm:hidden">
          <MotionButton className="mt-7">
            <Link
              to="/events"
              className="
                flex items-center justify-center gap-2 rounded-full
                border border-(--primary-color)/25 bg-(--primary-color)/10
                px-5 py-3 text-sm font-bold text-(--primary-color)
                transition-colors duration-300 hover:bg-(--primary-color) hover:text-white
              "
            >
              Xem tất cả
              <ArrowRight size={17} />
            </Link>
          </MotionButton>
        </motion.div>
      </div>
    </MotionSection>
  );
}

function FeaturedEventSkeleton() {
  return (
    <div className="overflow-hidden rounded-[24px] border border-(--text-primary)/10 bg-(--surface-color)">
      <div className="relative h-56 animate-pulse bg-(--background-color)" />

      <div className="p-4 space-y-4">
        <div className="h-5 w-3/4 animate-pulse rounded-lg bg-(--background-color)" />
        <div className="h-4 w-1/2 animate-pulse rounded-lg bg-(--background-color)" />

        <div className="flex items-center justify-between border-t border-(--text-primary)/10 pt-4">
          <div className="h-8 w-24 animate-pulse rounded-full bg-(--background-color)" />
          <div className="h-8 w-20 animate-pulse rounded-full bg-(--background-color)" />
        </div>
      </div>
    </div>
  );
}

export default FeaturedEvents;
