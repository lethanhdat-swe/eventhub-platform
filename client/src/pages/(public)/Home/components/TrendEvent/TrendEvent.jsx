import { ArrowRight, ChevronLeft, ChevronRight, Flame } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import MotionButton from '@/components/motion/MotionButton';
import MotionSection from '@/components/motion/MotionSection';
import {
    fadeInVariants,
    fadeUpVariants,
    motionTransition,
    staggerContainerVariants,
} from '@/constants/motion';

import EventCard from './components/EventCard/EventCard';

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

function TrendEvent({ trendingEvents = [], loading = false }) {
    if (loading) {
        return (
            <section className="container overflow-x-clip pt-12">
                <div className="mb-7 h-12 w-72 animate-pulse rounded-2xl bg-(--soft-surface-color)" />
                <div className="grid gap-4 md:grid-cols-3">
                    {Array.from({ length: 3 }).map((_, index) => (
                        <div
                            key={index}
                            className="h-72 animate-pulse rounded-3xl bg-(--soft-surface-color)"
                        />
                    ))}
                </div>
            </section>
        );
    }

    if (!trendingEvents.length) return null;

    return (
        <MotionSection className="overflow-x-clip pt-12">
            <div className="container overflow-visible">
                <motion.div
                    variants={staggerContainerVariants}
                    className="mb-7 flex items-center justify-between gap-4"
                >
                    <motion.div
                        variants={titleLeftVariants}
                        className="flex items-start gap-3"
                    >
                        <motion.div
                            variants={fadeInVariants}
                            whileHover={{ rotate: -4, scale: 1.06 }}
                            transition={motionTransition.fast}
                            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-500"
                        >
                            <Flame size={23} />
                        </motion.div>

                        <div>
                            <h2 className="text-2xl font-black tracking-tight text-(--text-primary) md:text-3xl">
                                Sự kiện nổi bật tuần này
                            </h2>

                            <p className="mt-1 text-sm text-(--text-primary)/50">
                                Sự kiện đang được quan tâm nhiều nhất
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
                  group flex items-center gap-2 rounded-full border border-(--primary-color)/25
                  bg-(--primary-color)/10 px-5 py-2.5 text-sm font-bold text-(--primary-color)
                  transition-colors duration-300 hover:bg-(--primary-color) hover:text-white
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
                    <motion.button
                        type="button"
                        aria-label="Sự kiện nổi bật trước"
                        whileHover={{ scale: 1.06 }}
                        whileTap={{ scale: 0.96 }}
                        transition={motionTransition.fast}
                        className="
              trending-prev absolute -left-10 top-1/2 z-30 hidden h-12 w-12
              -translate-y-1/2 cursor-pointer items-center justify-center rounded-full
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
              trending-next absolute -right-10 top-1/2 z-30 hidden h-12 w-12
              -translate-y-1/2 cursor-pointer items-center justify-center rounded-full
              border border-white/10 bg-black/70 text-white shadow-xl backdrop-blur-md
              transition-colors duration-300 hover:border-(--primary-color)/50 hover:bg-(--primary-color)
              xl:flex 2xl:-right-16
              [&.swiper-button-disabled]:pointer-events-none
              [&.swiper-button-disabled]:opacity-25
            "
                    >
                        <ChevronRight size={22} />
                    </motion.button>

                    <div className="overflow-hidden py-4">
                        <Swiper
                            modules={[Autoplay, Navigation, Pagination]}
                            autoplay={{
                                delay: 3500,
                                disableOnInteraction: false,
                                pauseOnMouseEnter: true,
                            }}
                            loop
                            speed={900}
                            navigation={{
                                prevEl: '.trending-prev',
                                nextEl: '.trending-next',
                            }}
                            pagination={{
                                clickable: true,
                                el: '.trending-pagination',
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
                            className="trend-event-swiper"
                        >
                            {trendingEvents.map((event, index) => {
                                const delay = Math.min(index * 0.12, 0.48);

                                return (
                                    <SwiperSlide
                                        key={event.id}
                                        className="h-auto"
                                    >
                                        <motion.div
                                            initial={{ opacity: 0, y: 16 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{
                                                once: true,
                                                amount: 0.2,
                                            }}
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
                                            <EventCard event={event} />
                                        </motion.div>
                                    </SwiperSlide>
                                );
                            })}
                        </Swiper>
                    </div>

                    <motion.div
                        variants={fadeInVariants}
                        className="trending-pagination mt-5 flex justify-center"
                    />
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

export default TrendEvent;
