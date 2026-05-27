import { ArrowRight, PlayCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

function HeroTitle() {
  return (
    <div className="max-w-4xl">
      <div className="mb-6 inline-flex items-center gap-2">
        <span className="text-xs font-bold uppercase tracking-[0.32em] text-[var(--primary-color)] drop-shadow-[0_0_18px_rgba(124,58,237,0.8)]">
          ✦ Sống trọn từng khoảnh khắc
        </span>
      </div>

      <h1 className="mb-7 max-w-[980px] text-[70px] font-black leading-[1.08] tracking-[-0.05em] text-white drop-shadow-[0_8px_32px_rgba(0,0,0,0.55)]">
        Khám phá những sự kiện đỉnh cao &{' '}
        <span className="bg-gradient-to-r from-[#a855f7] via-[#9333ea] to-[#7c3aed] bg-clip-text text-transparent">
          trải nghiệm
        </span>{' '}
        <span className="bg-gradient-to-r from-[#a855f7] via-[#9333ea] to-[#7c3aed] bg-clip-text text-transparent">
          khó quên
        </span>
      </h1>

      <p className="mb-10 max-w-2xl text-lg font-medium leading-9 text-white/68">
        Tìm kiếm concert, lễ hội, workshop và những trải nghiệm trực tiếp nổi
        bật đang diễn ra quanh bạn.
      </p>

      <div className="flex items-center gap-5">
        <Link
          to="/events"
          className="
            group inline-flex items-center gap-2 rounded-full
            bg-[var(--primary-color)] px-7 py-3.5
            text-sm font-bold text-white
            shadow-[0_14px_40px_rgba(124,58,237,0.38)]
            transition-all duration-300
            hover:-translate-y-0.5 hover:shadow-[0_18px_55px_rgba(124,58,237,0.5)]
            active:scale-95
          "
        >
          Khám phá sự kiện
          <ArrowRight
            size={17}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </Link>

        <button
          className="
            group inline-flex items-center gap-2 rounded-full
            border border-white/15 bg-white/10 px-7 py-3.5
            text-sm font-bold text-white
            backdrop-blur-xl
            transition-all duration-300
            hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/15
            active:scale-95
          "
        >
          Cách hoạt động
          <PlayCircle
            size={17}
            className="text-white/70 transition-transform duration-300 group-hover:scale-110"
          />
        </button>
      </div>
    </div>
  );
}

export default HeroTitle;
