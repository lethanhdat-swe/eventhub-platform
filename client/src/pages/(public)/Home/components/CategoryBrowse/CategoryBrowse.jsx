import { useEffect, useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

import MotionButton from '@/components/motion/MotionButton';
import MotionSection from '@/components/motion/MotionSection';
import {
    cardHoverMotion,
    fadeInVariants,
    fadeUpVariants,
    motionTransition,
    staggerContainerVariants,
    tapMotion,
} from '@/constants/motion';
import { categoryService } from '@/lib/services/admin';
import { Link } from 'react-router-dom';

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

function CategoryBrowse() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let ignore = false;

        async function fetchCategories() {
            try {
                setLoading(true);

                const res = await categoryService.list({
                    page: 1,
                    limit: 4,
                });

                if (ignore) return;

                const list = Array.isArray(res) ? res : (res?.data ?? []);
                setCategories(list);
            } catch (error) {
                console.error('Fetch categories failed:', error);

                if (!ignore) {
                    setCategories([]);
                }
            } finally {
                if (!ignore) {
                    setLoading(false);
                }
            }
        }

        fetchCategories();

        return () => {
            ignore = true;
        };
    }, []);

    if (!loading && categories.length === 0) {
        return null;
    }

    return (
        <MotionSection className="container mt-16">
            <motion.div
                variants={staggerContainerVariants}
                className="flex items-start justify-between gap-4 mb-7 md:gap-6"
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
                        <Sparkles size={23} />
                    </motion.div>

                    <div>
                        <p className="mb-2 text-sm font-black tracking-[0.24em] text-(--primary-color) uppercase">
                            Danh mục sự kiện
                        </p>

                        <h2 className="text-2xl font-black tracking-tight text-(--text-primary) md:text-3xl">
                            Khám phá theo sở thích của bạn
                        </h2>

                        <p className="mt-2 max-w-xl text-sm leading-6 text-(--text-primary)/55">
                            Chọn nhanh nhóm sự kiện bạn quan tâm và bắt đầu khám
                            phá những trải nghiệm phù hợp.
                        </p>
                    </div>
                </motion.div>

                <motion.div
                    variants={actionRightVariants}
                    className="hidden shrink-0 sm:block"
                >
                    <MotionButton>
                        <Link
                            to={'/events'}
                            className="group flex items-center gap-2 rounded-full border border-(--text-primary)/10 bg-(--surface-color) px-5 py-2.5 text-sm font-bold whitespace-nowrap text-(--text-primary)/80 shadow-sm transition-colors duration-300 hover:border-(--primary-color)/40 hover:text-(--primary-color) md:px-6 md:py-3"
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

            <motion.div
                variants={staggerContainerVariants}
                className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
            >
                {loading
                    ? Array.from({ length: 4 }).map((_, index) => (
                          <motion.div key={index} variants={fadeUpVariants}>
                              <CategoryCardSkeleton />
                          </motion.div>
                      ))
                    : categories.map((category) => (
                          <motion.div
                              key={category.id}
                              variants={fadeUpVariants}
                          >
                              <CategoryCard category={category} />
                          </motion.div>
                      ))}
            </motion.div>
        </MotionSection>
    );
}

function CategoryCard({ category }) {
    return (
        <motion.button
            whileHover={cardHoverMotion}
            whileTap={tapMotion}
            transition={motionTransition.fast}
            className="group relative w-full overflow-hidden rounded-[22px] border border-(--text-primary)/10 bg-(--surface-color) p-5 text-left transition-[border-color,box-shadow] duration-300 hover:border-(--primary-color)/45 hover:shadow-[0_18px_55px_rgba(124,58,237,0.16)]"
        >
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.07)_0%,transparent_42%,rgba(124,58,237,0.18)_100%)] opacity-80 transition-opacity duration-300 group-hover:opacity-100" />

            <div className="pointer-events-none absolute -top-16 -right-16 h-32 w-32 rounded-full bg-(--primary-color)/12 blur-3xl transition-colors duration-300 group-hover:bg-(--primary-color)/25" />

            <div className="relative z-10 flex flex-col min-h-32">
                <div className="flex items-start justify-between gap-3 mb-6">
                    <motion.div
                        whileHover={{ rotate: -4, scale: 1.06 }}
                        transition={motionTransition.fast}
                        className="flex h-11 w-11 items-center justify-center rounded-2xl border border-(--text-primary)/10 bg-(--background-color) text-(--primary-color)"
                    >
                        <Sparkles size={21} />
                    </motion.div>

                    <span className="rounded-full border border-(--text-primary)/10 bg-(--background-color)/80 px-3 py-1 text-xs font-bold text-(--text-primary)/55">
                        {category.eventCount ?? 0} sự kiện
                    </span>
                </div>

                <div className="mt-auto">
                    <h3 className="line-clamp-1 text-xl font-black text-(--text-primary)">
                        {category.name}
                    </h3>

                    <div className="mt-4 flex items-center gap-2 text-sm font-bold text-(--primary-color)">
                        Khám phá
                        <ArrowRight
                            size={16}
                            className="transition-transform duration-300 group-hover:translate-x-1"
                        />
                    </div>
                </div>
            </div>
        </motion.button>
    );
}

function CategoryCardSkeleton() {
    return (
        <div className="relative overflow-hidden rounded-[22px] border border-(--text-primary)/10 bg-(--surface-color) p-5">
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.05)_0%,transparent_42%,rgba(124,58,237,0.12)_100%)]" />

            <div className="relative z-10 flex flex-col min-h-32">
                <div className="flex items-start justify-between gap-3 mb-6">
                    <div className="h-11 w-11 animate-pulse rounded-2xl bg-(--background-color)" />
                    <div className="h-6 w-20 animate-pulse rounded-full bg-(--background-color)" />
                </div>

                <div className="mt-auto">
                    <div className="h-6 w-28 animate-pulse rounded-lg bg-(--background-color)" />
                    <div className="mt-4 h-5 w-20 animate-pulse rounded-lg bg-(--background-color)" />
                </div>
            </div>
        </div>
    );
}

export default CategoryBrowse;
