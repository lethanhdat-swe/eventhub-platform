import { ArrowRight, Sparkles } from 'lucide-react';

function Limit() {
  return (
    <section className="container mt-12">
      <div className="relative overflow-hidden rounded-[28px] border border-(--primary-color)/25 bg-[radial-gradient(circle_at_20%_20%,rgba(168,85,247,0.28),transparent_32%),linear-gradient(135deg,#15101f_0%,#0b0911_52%,#12081d_100%)] px-5 py-6 shadow-[0_24px_80px_rgba(0,0,0,0.35)] md:px-8 md:py-7">
        {/* Glow */}
        <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-(--primary-color)/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 right-10 h-72 w-72 rounded-full bg-fuchsia-500/10 blur-3xl" />

        {/* Subtle border light */}
        <div className="pointer-events-none absolute inset-0 rounded-[28px] bg-gradient-to-r from-white/10 via-transparent to-white/5" />

        <div className="relative z-10 flex flex-col gap-5 md:gap-6 lg:flex-row lg:items-center lg:justify-between">
          {/* Left content */}
          <div className="flex items-start gap-4">
            <div className="flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl border border-(--primary-color)/30 bg-(--primary-color)/15 text-(--primary-color) shadow-[0_0_35px_rgba(168,85,247,0.22)]">
              <Sparkles size={24} />
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-(--primary-color)">
                Ưu đãi có thời hạn
              </p>

              <h2 className="mt-2 text-2xl font-black tracking-tight text-white md:text-3xl">
                Giảm 20% cho đơn hàng đầu tiên
              </h2>

              <p className="mt-2 max-w-xl text-sm leading-6 text-white/55">
                Đăng ký hôm nay và mở khóa các ưu đãi độc quyền cho các sự kiện
                bạn yêu thích.
              </p>
            </div>
          </div>

          {/* CTA */}
          <button className="group inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-(--primary-color) px-6 py-3.5 text-sm font-bold whitespace-nowrap text-white shadow-[0_14px_40px_rgba(168,85,247,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110 active:scale-95 lg:w-auto lg:min-w-[150px]">
            Đăng ký ngay
            <ArrowRight
              size={18}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </button>
        </div>
      </div>
    </section>
  );
}

export default Limit;
