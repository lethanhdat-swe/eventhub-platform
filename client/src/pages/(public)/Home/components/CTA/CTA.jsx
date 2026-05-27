import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

function HomeCTA() {
  return (
    <section className="container mt-20">
      <div
        className="
          relative overflow-hidden rounded-[2rem]
          border border-[var(--border-color)]
          bg-[var(--surface-color)]
          px-6 py-14 text-center
          shadow-[0_22px_70px_rgba(0,0,0,0.16)]
          md:px-10 md:py-16
        "
      >
        <div className="pointer-events-none absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-(--primary-color)/20 blur-3xl" />
        <div className="pointer-events-none absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-orange-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-(--primary-color)/10 blur-3xl" />

        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(124,58,237,0.14),transparent_34%)]" />

        <div className="relative z-10 mx-auto max-w-3xl">
          <div
            className="
              mb-5 inline-flex items-center gap-2 rounded-full
              border border-(--primary-color)/20 bg-(--primary-color)/10
              px-4 py-2 text-xs font-bold text-(--primary-color)
            "
          >
            <Sparkles size={14} />
            Khám phá cùng EventHub
          </div>

          <h2 className="text-3xl font-black leading-tight tracking-tight text-(--text-primary) md:text-5xl">
            Cùng EventHub tìm trải nghiệm tiếp theo của bạn
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[var(--muted-text)] md:text-base">
            Từ những đêm nhạc đầy cảm xúc đến workshop, festival và các buổi gặp
            gỡ cộng đồng — mọi trải nghiệm đáng nhớ đều bắt đầu từ một lựa chọn
            nhỏ.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/events"
              className="
                group inline-flex h-12 items-center justify-center gap-2
                rounded-full bg-(--primary-color) px-7 text-sm font-black
                text-white shadow-[0_16px_40px_rgba(168,85,247,0.28)]
                transition-all duration-300
                hover:-translate-y-0.5 hover:brightness-110
                active:scale-95
              "
            >
              Bắt đầu khám phá
              <ArrowRight
                size={17}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>

            <Link
              to="/events"
              className="
                inline-flex h-12 items-center justify-center rounded-full
                border border-[var(--border-color)]
                bg-[var(--soft-surface-color)] px-7
                text-sm font-bold text-[var(--muted-text)]
                transition-all duration-300
                hover:border-(--primary-color)/35 hover:text-(--primary-color)
              "
            >
              Xem tất cả sự kiện
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HomeCTA;
