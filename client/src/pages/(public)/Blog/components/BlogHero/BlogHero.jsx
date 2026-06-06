import { images } from '@/assets';
import {
  fadeInVariants,
  motionTransition,
  staggerContainerVariants,
} from '@/constants/motion';
import { BookOpenText, Newspaper, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

const titleLeftVariants = {
  hidden: {
    opacity: 0,
    x: -22,
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

const titleRightVariants = {
  hidden: {
    opacity: 0,
    x: 22,
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

const chipVariants = {
  hidden: {
    opacity: 0,
    y: 12,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      y: motionTransition.smooth,
      opacity: motionTransition.opacity,
    },
  },
};

function BlogHero() {
  return (
    <motion.section
      initial="hidden"
      animate="show"
      className="relative h-85 overflow-hidden sm:h-105 md:h-125"
    >
      <motion.img
        src={images.home}
        alt=""
        initial={{ scale: 1.04 }}
        animate={{ scale: 1 }}
        transition={motionTransition.slow}
        className="absolute inset-0 h-full w-full object-cover"
      />

      <motion.div
        variants={fadeInVariants}
        className="absolute inset-0 bg-linear-to-r from-black/92 via-black/58 to-black/25"
      />
      <motion.div
        variants={fadeInVariants}
        className="absolute inset-0 bg-linear-to-t from-black/78 via-black/15 to-black/20"
      />
      <motion.div
        variants={fadeInVariants}
        className="absolute inset-0 bg-[radial-gradient(circle_at_72%_35%,rgba(168,85,247,0.34),transparent_36%)]"
      />

      <motion.div
        animate={{
          opacity: [0.45, 0.75, 0.45],
        }}
        transition={{
          duration: 5,
          ease: 'linear',
          repeat: Infinity,
        }}
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_72%_35%,rgba(168,85,247,0.2),transparent_34%)]"
      />

      <div className="container relative z-10 flex h-full items-center pt-4">
        <motion.div variants={staggerContainerVariants} className="max-w-3xl">
          <motion.div
            variants={titleLeftVariants}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-3 py-1.5 backdrop-blur-xl sm:mb-6 sm:px-4 sm:py-2"
          >
            <Sparkles
              size={12}
              className="text-(--primary-color) drop-shadow-[0_0_16px_rgba(168,85,247,0.9)]"
            />
            <span className="text-[10px] font-black tracking-[0.26em] text-white/72 uppercase sm:text-[11px]">
              Blog & tin tức
            </span>
          </motion.div>

          <motion.h1
            variants={titleLeftVariants}
            className="mb-3 max-w-3xl text-[28px] leading-[1.1] font-black tracking-[-0.04em] text-white drop-shadow-[0_8px_32px_rgba(0,0,0,0.6)] sm:mb-5 sm:text-[38px] sm:leading-[1.08] sm:tracking-[-0.045em] md:text-[44px] lg:text-[52px]"
          >
            Góc nhìn mới về
            <br />
            <span className="bg-linear-to-r from-[#f0abfc] via-[#c084fc] to-[#9333ea] bg-clip-text text-transparent">
              sự kiện & trải nghiệm
            </span>
          </motion.h1>

          <motion.p
            variants={titleRightVariants}
            className="hidden max-w-2xl text-sm leading-7 font-medium text-white/68 sm:block sm:text-base sm:leading-8"
          >
            Cập nhật tin tức, review sự kiện, mẹo tham gia và những câu chuyện
            thú vị xoay quanh thế giới trải nghiệm trực tiếp.
          </motion.p>

          <motion.div
            variants={staggerContainerVariants}
            className="mt-5 flex flex-wrap items-center gap-2 sm:mt-8 sm:gap-4"
          >
            <motion.div
              variants={chipVariants}
              whileHover={{ y: -2 }}
              transition={motionTransition.fast}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-2 text-xs font-bold text-white backdrop-blur-xl sm:gap-3 sm:px-5 sm:py-3 sm:text-sm"
            >
              <Newspaper size={13} className="text-white/60 sm:hidden" />
              <Newspaper size={16} className="hidden text-white/60 sm:block" />
              <span>Bài viết mới nhất</span>
            </motion.div>

            <motion.div
              variants={chipVariants}
              whileHover={{ y: -2 }}
              transition={motionTransition.fast}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-2 text-xs font-bold text-white backdrop-blur-xl sm:gap-3 sm:px-5 sm:py-3 sm:text-sm"
            >
              <BookOpenText size={13} className="text-white/60 sm:hidden" />
              <BookOpenText
                size={16}
                className="hidden text-white/60 sm:block"
              />
              <span>Đánh giá, hướng dẫn & cảm hứng</span>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}

export default BlogHero;
