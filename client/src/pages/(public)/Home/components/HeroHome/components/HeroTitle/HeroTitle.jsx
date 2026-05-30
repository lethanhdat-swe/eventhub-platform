import { ArrowRight, Phone, PlayCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

function HeroTitle() {
  return (
    <div className="max-w-4xl">
      <div className="mb-4 inline-flex items-center gap-2 sm:mb-6">
        <span className="text-[10px] font-bold uppercase tracking-[0.32em] text-(--primary-color) drop-shadow-[0_0_18px_rgba(124,58,237,0.8)] sm:text-xs">
          ✦ Sống trọn từng khoảnh khắc
        </span>
      </div>

      <h1 className="mb-5 max-w-245 text-[38px] font-black leading-[1.1] tracking-[-0.04em] text-white drop-shadow-[0_8px_32px_rgba(0,0,0,0.55)] sm:mb-7 sm:text-[52px] sm:leading-[1.08] sm:tracking-tighter md:text-[62px] lg:text-[70px]">
        Khám phá những sự kiện đỉnh cao &{' '}
        <span className="bg-linear-to-r from-[#a855f7] via-[#9333ea] to-[#7c3aed] bg-clip-text text-transparent">
          trải nghiệm
        </span>{' '}
        <span className="bg-linear-to-r from-[#a855f7] via-[#9333ea] to-[#7c3aed] bg-clip-text text-transparent">
          khó quên
        </span>
      </h1>

      <p className="mb-8 max-w-2xl text-sm font-medium leading-7 text-white/68 sm:mb-10 sm:text-base sm:leading-8 lg:text-lg lg:leading-9">
        Tìm kiếm concert, lễ hội, workshop và những trải nghiệm trực tiếp nổi
        bật đang diễn ra quanh bạn.
      </p>

      <div className="flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-5">
        <Link
          to="/events"
          className="
            group inline-flex w-full items-center justify-center gap-2 rounded-full
            bg-(--primary-color) px-6 py-3
            text-xs font-bold text-white
            shadow-[0_14px_40px_rgba(124,58,237,0.38)]
            transition-all duration-300
            hover:-translate-y-0.5 hover:shadow-[0_18px_55px_rgba(124,58,237,0.5)]
            active:scale-95
            sm:w-auto sm:min-w-[220px] sm:px-7 sm:py-3.5 sm:text-sm
          "
        >
          Khám phá sự kiện
          <ArrowRight
            size={15}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </Link>

        <Link
          to="/contact"
          className="
            group inline-flex w-full items-center justify-center gap-2 rounded-full
            border border-white/15 bg-white/10 px-6 py-3
            text-xs font-bold text-white
            backdrop-blur-xl
            transition-all duration-300
            hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/15
            active:scale-95
            sm:w-auto sm:min-w-[220px] sm:px-7 sm:py-3.5 sm:text-sm
          "
        >
          Liên hệ chúng tôi
          <Phone
            size={15}
            className="text-white/70 transition-transform duration-300 group-hover:scale-110"
          />
        </Link>
      </div>
    </div>
  );
}

export default HeroTitle;
