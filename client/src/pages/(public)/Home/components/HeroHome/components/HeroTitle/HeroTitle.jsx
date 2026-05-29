import { ArrowRight, PlayCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

function HeroTitle() {
  return (
    <div className="max-w-4xl">
      <div className="inline-flex items-center gap-2 mb-4 sm:mb-6">
        <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.32em] text-(--primary-color) drop-shadow-[0_0_18px_rgba(124,58,237,0.8)]">
          ✦ Sống trọn từng khoảnh khắc
        </span>
      </div>

      <h1 className="mb-5 sm:mb-7 max-w-245 text-[38px] sm:text-[52px] md:text-[62px] lg:text-[70px] font-black leading-[1.1] sm:leading-[1.08] tracking-[-0.04em] sm:tracking-tighter text-white drop-shadow-[0_8px_32px_rgba(0,0,0,0.55)]">
        Khám phá những sự kiện đỉnh cao &{' '}
        <span className="bg-linear-to-r from-[#a855f7] via-[#9333ea] to-[#7c3aed] bg-clip-text text-transparent">
          trải nghiệm
        </span>{' '}
        <span className="bg-linear-to-r from-[#a855f7] via-[#9333ea] to-[#7c3aed] bg-clip-text text-transparent">
          khó quên
        </span>
      </h1>

      <p className="max-w-2xl mb-8 text-sm font-medium leading-7 sm:mb-10 sm:text-base lg:text-lg sm:leading-8 lg:leading-9 text-white/68">
        Tìm kiếm concert, lễ hội, workshop và những trải nghiệm trực tiếp nổi
        bật đang diễn ra quanh bạn.
      </p>

      <div className="flex flex-col items-stretch gap-3 xs:flex-row xs:items-center sm:gap-5">
        <Link
          to="/events"
          className="
            group inline-flex items-center justify-center gap-2 rounded-full
            bg-(--primary-color) px-6 sm:px-7 py-3 sm:py-3.5
            text-xs sm:text-sm font-bold text-white
            shadow-[0_14px_40px_rgba(124,58,237,0.38)]
            transition-all duration-300
            hover:-translate-y-0.5 hover:shadow-[0_18px_55px_rgba(124,58,237,0.5)]
            active:scale-95
          "
        >
          Khám phá sự kiện
          <ArrowRight
            size={15}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </Link>

        <button
          className="
            group inline-flex items-center justify-center gap-2 rounded-full
            border border-white/15 bg-white/10 px-6 sm:px-7 py-3 sm:py-3.5
            text-xs sm:text-sm font-bold text-white
            backdrop-blur-xl
            transition-all duration-300
            hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/15
            active:scale-95
          "
        >
          Cách hoạt động
          <PlayCircle
            size={15}
            className="transition-transform duration-300 text-white/70 group-hover:scale-110"
          />
        </button>
      </div>
    </div>
  );
}

export default HeroTitle;