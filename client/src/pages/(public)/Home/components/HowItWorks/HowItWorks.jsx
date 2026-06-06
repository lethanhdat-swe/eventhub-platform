import MotionButton from '@/components/motion/MotionButton';
import MotionSection from '@/components/motion/MotionSection';
import {
  cardHoverMotion,
  fadeInVariants,
  fadeUpVariants,
  motionTransition,
  scaleInVariants,
  staggerContainerVariants,
  tapMotion,
} from '@/constants/motion';
import {
  ArrowRight,
  CalendarSearch,
  CreditCard,
  QrCode,
  Sparkles,
} from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

const steps = [
  {
    number: '01',
    title: 'Khám phá sự kiện',
    description:
      'Tìm concert, workshop, festival hoặc sự kiện phù hợp với sở thích của bạn.',
    icon: CalendarSearch,
  },
  {
    number: '02',
    title: 'Đặt vé online',
    description:
      'Chọn vé, thanh toán nhanh và nhận xác nhận ngay trên hệ thống.',
    icon: CreditCard,
  },
  {
    number: '03',
    title: 'Check-in QR',
    description:
      'Dùng vé điện tử để quét mã QR tại cổng sự kiện, nhanh và tiện lợi.',
    icon: QrCode,
  },
];

const highlights = [
  {
    value: 'QR',
    label: 'Vé điện tử',
  },
  {
    value: 'Trực tuyến',
    label: 'Đặt vé nhanh',
  },
  {
    value: 'Nhanh',
    label: 'Check-in tiện lợi',
  },
];

function HowItWorks() {
  return (
    <MotionSection className="container mt-20">
      <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <motion.div variants={staggerContainerVariants}>
          <motion.div
            variants={fadeUpVariants}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-(--primary-color)/20 bg-(--primary-color)/10 px-4 py-2 text-sm font-bold text-(--primary-color)"
          >
            <Sparkles size={16} />
            Cách Beetic hoạt động
          </motion.div>

          <motion.h2
            variants={fadeUpVariants}
            className="max-w-xl text-3xl leading-tight font-black tracking-tight text-(--text-primary) md:text-5xl"
          >
            Từ khám phá sự kiện đến check-in chỉ trong vài bước
          </motion.h2>

          <motion.p
            variants={fadeUpVariants}
            className="mt-5 max-w-lg text-sm leading-7 text-(--muted-text) md:text-base"
          >
            Beetic giúp bạn tìm sự kiện phù hợp, đặt vé online và sử dụng vé
            điện tử để tham gia sự kiện một cách nhanh chóng.
          </motion.p>

          <motion.div
            variants={fadeUpVariants}
            className="flex flex-wrap items-center gap-3 mt-7"
          >
            <MotionButton>
              <Link
                to="/events"
                className="
                  group inline-flex items-center gap-2 rounded-full
                  bg-(--primary-color) px-5 py-3 text-sm font-bold text-white
                  shadow-[0_14px_35px_rgba(168,85,247,0.28)]
                  transition-shadow duration-300
                  hover:shadow-[0_18px_45px_rgba(168,85,247,0.34)]
                "
              >
                Khám phá sự kiện
                <ArrowRight
                  size={17}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </MotionButton>

            <motion.span
              whileHover={{ y: -2 }}
              transition={motionTransition.fast}
              className="rounded-full border border-(--border-color) bg-(--soft-surface-color) px-4 py-2 text-sm font-semibold text-(--muted-text)"
            >
              Không cần in vé giấy
            </motion.span>
          </motion.div>
        </motion.div>

        <motion.div variants={fadeUpVariants} className="relative">
          <motion.div
            animate={{
              scale: [1, 1.08, 1],
              opacity: [0.65, 1, 0.65],
            }}
            transition={{
              duration: 7,
              ease: 'linear',
              repeat: Infinity,
            }}
            className="pointer-events-none absolute top-10 -left-10 h-52 w-52 rounded-full bg-(--primary-color)/20 blur-3xl"
          />

          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.45, 0.75, 0.45],
            }}
            transition={{
              duration: 8,
              ease: 'linear',
              repeat: Infinity,
            }}
            className="absolute w-56 h-56 rounded-full pointer-events-none right-8 bottom-4 bg-orange-500/10 blur-3xl"
          />

          <motion.div
            variants={scaleInVariants}
            className="
              relative rounded-[2rem] border border-(--border-color)
              bg-(--soft-surface-color) p-4
              shadow-[0_20px_70px_rgba(0,0,0,0.14)]
              backdrop-blur-xl md:p-5
            "
          >
            <div className="pointer-events-none absolute inset-0 rounded-[2rem] bg-[radial-gradient(circle_at_top_left,rgba(124,58,237,0.12),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(249,115,22,0.08),transparent_30%)]" />

            <motion.div
              variants={staggerContainerVariants}
              className="relative z-10 space-y-4"
            >
              {steps.map((step, index) => {
                const Icon = step.icon;

                return (
                  <motion.div
                    key={step.number}
                    variants={fadeUpVariants}
                    whileHover={cardHoverMotion}
                    whileTap={tapMotion}
                    transition={motionTransition.fast}
                    className={`
                      group relative overflow-hidden rounded-3xl border
                      border-(--border-color) bg-(--card-surface-color)
                      p-5 transition-[border-color,background-color,box-shadow] duration-300
                      hover:border-(--primary-color)/40
                      hover:bg-(--card-hover-color)
                      hover:shadow-[0_14px_35px_rgba(168,85,247,0.12)]
                      ${index === 1 ? 'md:ml-8' : ''}
                      ${index === 2 ? 'md:ml-16' : ''}
                    `}
                  >
                    <div className="pointer-events-none absolute -top-16 -right-16 h-36 w-36 rounded-full bg-(--primary-color)/10 blur-2xl transition-colors duration-300 group-hover:bg-(--primary-color)/20" />

                    <div className="relative z-10 flex gap-4">
                      <motion.div
                        whileHover={{ rotate: -4, scale: 1.06 }}
                        transition={motionTransition.fast}
                        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-(--primary-color)/25 bg-(--primary-color)/10 text-(--primary-color)"
                      >
                        <Icon size={24} />
                      </motion.div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-3 mb-2">
                          <h3 className="text-lg font-black tracking-tight text-(--text-primary)">
                            {step.title}
                          </h3>

                          <span className="text-3xl leading-none font-black text-(--decorative-number-color)">
                            {step.number}
                          </span>
                        </div>

                        <p className="max-w-md text-sm leading-6 text-(--muted-text)">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>

            <motion.div
              variants={staggerContainerVariants}
              className="relative z-10 grid grid-cols-1 gap-3 mt-5 sm:grid-cols-3"
            >
              {highlights.map((item) => (
                <motion.div
                  key={item.value}
                  variants={fadeInVariants}
                  whileHover={{ y: -3 }}
                  transition={motionTransition.fast}
                  className="
                    rounded-2xl border border-(--border-color)
                    bg-(--card-surface-color) p-4
                  "
                >
                  <p className="text-lg font-black text-(--text-primary)">
                    {item.value}
                  </p>
                  <p className="mt-1 text-xs text-(--muted-text)">
                    {item.label}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </MotionSection>
  );
}

export default HowItWorks;
