import { ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

import MotionButton from '@/components/motion/MotionButton';
import MotionSection from '@/components/motion/MotionSection';
import {
    fadeInVariants,
    fadeUpVariants,
    motionTransition,
    staggerContainerVariants,
} from '@/constants/motion';
import { Link } from 'react-router-dom';

function Limit() {
    return (
        <MotionSection className="container mt-12">
            <motion.div
                variants={fadeUpVariants}
                className="
          relative overflow-hidden rounded-[28px]
          border border-(--primary-color)/20
          bg-[linear-gradient(105deg,rgba(124,58,237,0.24),rgba(124,58,237,0.08)_42%,rgba(168,85,247,0.2))]
          px-5 py-6
          shadow-[0_24px_80px_rgba(0,0,0,0.14)]
          md:px-8 md:py-7
        "
            >
                <div className="pointer-events-none absolute -top-24 -left-24 h-64 w-64 rounded-full bg-(--primary-color)/16 blur-3xl" />
                <div className="pointer-events-none absolute -right-14 -bottom-28 h-72 w-72 rounded-full bg-(--primary-color)/12 blur-3xl" />

                <div className="pointer-events-none absolute inset-0 rounded-[28px] bg-[linear-gradient(120deg,rgba(255,255,255,0.16),transparent_42%,rgba(255,255,255,0.08))] dark:bg-[linear-gradient(120deg,rgba(255,255,255,0.06),transparent_42%,rgba(255,255,255,0.03))]" />

                <motion.div
                    variants={fadeInVariants}
                    animate={{
                        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                    }}
                    transition={{
                        duration: 10,
                        ease: 'linear',
                        repeat: Infinity,
                    }}
                    className="absolute inset-0 pointer-events-none opacity-60"
                    style={{
                        backgroundSize: '220% 220%',
                        backgroundImage:
                            'linear-gradient(110deg, transparent 0%, rgba(255,255,255,0.05) 28%, rgba(168,85,247,0.1) 50%, rgba(255,255,255,0.05) 68%, transparent 100%)',
                    }}
                />

                <motion.div
                    variants={staggerContainerVariants}
                    className="relative z-10 flex flex-col gap-5 md:gap-6 lg:flex-row lg:items-center lg:justify-between"
                >
                    <motion.div
                        variants={fadeUpVariants}
                        className="flex items-start gap-4"
                    >
                        <motion.div
                            whileHover={{ rotate: -4, scale: 1.06 }}
                            transition={motionTransition.fast}
                            className="
                flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl
                border border-(--primary-color)/25
                bg-(--primary-color)/10
                text-(--primary-color)
                shadow-[0_0_28px_rgba(124,58,237,0.14)]
              "
                        >
                            <Sparkles size={24} />
                        </motion.div>

                        <div>
                            <p className="text-xs font-bold tracking-[0.22em] text-(--primary-color) uppercase">
                                Ưu đãi có thời hạn
                            </p>

                            <h2 className="mt-2 text-2xl font-black tracking-tight text-(--text-primary) md:text-3xl">
                                Giảm 20% cho đơn hàng đầu tiên
                            </h2>

                            <p className="mt-2 max-w-xl text-sm leading-6 text-(--muted-text)">
                                Đăng ký hôm nay và mở khóa các ưu đãi độc quyền
                                cho các sự kiện bạn yêu thích.
                            </p>
                        </div>
                    </motion.div>

                    <motion.div variants={fadeUpVariants}>
                        <MotionButton>
                            <Link
                                to={'/login'}
                                type="button"
                                className="
                  block group inline-flex w-full items-center justify-center gap-2
                  rounded-2xl bg-(--primary-color)
                  px-6 py-3.5 text-sm font-bold whitespace-nowrap text-white
                  shadow-[0_14px_36px_rgba(124,58,237,0.26)]
                  transition-[filter,box-shadow] duration-300
                  hover:brightness-110
                  lg:w-auto lg:min-w-37.5
                "
                            >
                                Đăng ký ngay
                                <ArrowRight
                                    size={18}
                                    className="transition-transform duration-300 group-hover:translate-x-1"
                                />
                            </Link>
                        </MotionButton>
                    </motion.div>
                </motion.div>
            </motion.div>
        </MotionSection>
    );
}

export default Limit;
