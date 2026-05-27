import {
  ArrowRight,
  CalendarSearch,
  CreditCard,
  QrCode,
  Sparkles,
} from 'lucide-react';
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
    value: 'Online',
    label: 'Đặt vé nhanh',
  },
  {
    value: 'Fast',
    label: 'Check-in tiện lợi',
  },
];

function HowItWorks() {
  return (
    <section className="container mt-20">
      <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-(--primary-color)/20 bg-(--primary-color)/10 px-4 py-2 text-sm font-bold text-(--primary-color)">
            <Sparkles size={16} />
            Cách EventHub hoạt động
          </div>

          <h2 className="max-w-xl text-3xl font-black leading-tight tracking-tight text-(--text-primary) md:text-5xl">
            Từ khám phá sự kiện đến check-in chỉ trong vài bước
          </h2>

          <p className="mt-5 max-w-lg text-sm leading-7 text-[var(--muted-text)] md:text-base">
            EventHub giúp bạn tìm sự kiện phù hợp, đặt vé online và sử dụng vé
            điện tử để tham gia sự kiện một cách nhanh chóng.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link
              to="/events"
              className="
                group inline-flex items-center gap-2 rounded-full
                bg-(--primary-color) px-5 py-3 text-sm font-bold text-white
                shadow-[0_14px_35px_rgba(168,85,247,0.28)]
                transition-all duration-300
                hover:-translate-y-0.5 hover:shadow-[0_18px_45px_rgba(168,85,247,0.34)]
                active:scale-95
              "
            >
              Khám phá sự kiện
              <ArrowRight
                size={17}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>

            <span className="rounded-full border border-[var(--border-color)] bg-[var(--soft-surface-color)] px-4 py-2 text-sm font-semibold text-[var(--muted-text)]">
              Không cần in vé giấy
            </span>
          </div>
        </div>

        <div className="relative">
          <div className="pointer-events-none absolute -left-10 top-10 h-52 w-52 rounded-full bg-(--primary-color)/20 blur-3xl" />
          <div className="pointer-events-none absolute -right-8 bottom-4 h-56 w-56 rounded-full bg-orange-500/10 blur-3xl" />

          <div
            className="
              relative rounded-[2rem] border border-[var(--border-color)]
              bg-[var(--soft-surface-color)] p-4
              shadow-[0_20px_70px_rgba(0,0,0,0.14)]
              backdrop-blur-xl md:p-5
            "
          >
            <div className="pointer-events-none absolute inset-0 rounded-[2rem] bg-[radial-gradient(circle_at_top_left,rgba(124,58,237,0.12),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(249,115,22,0.08),transparent_30%)]" />

            <div className="relative z-10 space-y-4">
              {steps.map((step, index) => {
                const Icon = step.icon;

                return (
                  <div
                    key={step.number}
                    className={`
                      group relative overflow-hidden rounded-3xl border
                      border-[var(--border-color)] bg-[var(--card-surface-color)]
                      p-5 transition-all duration-300
                      hover:-translate-y-1 hover:border-(--primary-color)/40
                      hover:bg-[var(--card-hover-color)]
                      hover:shadow-[0_14px_35px_rgba(168,85,247,0.12)]
                      ${index === 1 ? 'md:ml-8' : ''}
                      ${index === 2 ? 'md:ml-16' : ''}
                    `}
                  >
                    <div className="pointer-events-none absolute -right-16 -top-16 h-36 w-36 rounded-full bg-(--primary-color)/10 blur-2xl transition group-hover:bg-(--primary-color)/20" />

                    <div className="relative z-10 flex gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-(--primary-color)/25 bg-(--primary-color)/10 text-(--primary-color)">
                        <Icon size={24} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="mb-2 flex items-center justify-between gap-3">
                          <h3 className="text-lg font-black tracking-tight text-(--text-primary)">
                            {step.title}
                          </h3>

                          <span className="text-3xl font-black leading-none text-[var(--decorative-number-color)]">
                            {step.number}
                          </span>
                        </div>

                        <p className="max-w-md text-sm leading-6 text-[var(--muted-text)]">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="relative z-10 mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {highlights.map((item) => (
                <div
                  key={item.value}
                  className="
                    rounded-2xl border border-[var(--border-color)]
                    bg-[var(--card-surface-color)] p-4
                  "
                >
                  <p className="text-lg font-black text-(--text-primary)">
                    {item.value}
                  </p>
                  <p className="mt-1 text-xs text-[var(--muted-text)]">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
