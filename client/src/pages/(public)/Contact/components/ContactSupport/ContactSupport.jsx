import { Headphones, MessageSquareText, ShieldCheck } from 'lucide-react';

const SUPPORT_DATA = [
  {
    id: 1,
    Icon: MessageSquareText,
    title: 'Phản hồi nhanh',
    description:
      'Đội ngũ EventHub sẽ tiếp nhận và phản hồi yêu cầu của bạn trong thời gian sớm nhất.',
  },
  {
    id: 2,
    Icon: Headphones,
    title: 'Hỗ trợ tận tâm',
    description:
      'Luôn sẵn sàng hỗ trợ các vấn đề liên quan đến sự kiện, vé và tài khoản.',
  },
  {
    id: 3,
    Icon: ShieldCheck,
    title: 'Bảo mật thông tin',
    description:
      'Thông tin liên hệ của bạn được bảo mật và chỉ sử dụng cho mục đích hỗ trợ.',
  },
];

function ContactSupport() {
  return (
    <section className="relative bg-[var(--background-color)] py-16 text-[var(--text-primary)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(124,58,237,0.16),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.1),transparent_30%)]" />

      <div className="container relative z-10">
        <div
          className="
            overflow-hidden rounded-[32px] border border-[var(--border-color)]
            bg-[var(--card-surface-color)]
            p-6 shadow-[0_24px_80px_rgba(0,0,0,0.24)]
            backdrop-blur-xl md:p-8
          "
        >
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="mb-4 text-xs font-black uppercase tracking-[0.28em] text-[var(--primary-color)]">
                Bạn có thắc mắc?
              </p>

              <h2 className="max-w-xl text-3xl font-black leading-tight tracking-[-0.04em] text-[var(--text-primary)] md:text-4xl">
                EventHub luôn sẵn sàng
                <br />
                <span className="bg-gradient-to-r from-[#f0abfc] via-[#c084fc] to-[#9333ea] bg-clip-text text-transparent">
                  hỗ trợ bạn
                </span>
              </h2>

              <p className="mt-5 max-w-xl text-base font-medium leading-8 text-[var(--muted-text)]">
                Liên hệ với chúng tôi nếu bạn cần hỗ trợ về sự kiện, đặt vé, đối
                tác hoặc bất kỳ thông tin nào khác.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {SUPPORT_DATA.map(({ id, Icon, title, description }) => (
                <div
                  key={id}
                  className="
                    group rounded-[24px] border border-[var(--border-color)]
                    bg-[var(--soft-surface-color)] p-5
                    transition-all duration-300
                    hover:-translate-y-1 hover:border-[var(--primary-color)]/45
                    hover:bg-[var(--primary-color)]/8
                    hover:shadow-[0_18px_55px_rgba(124,58,237,0.16)]
                  "
                >
                  <div
                    className="
                      mb-5 flex size-12 items-center justify-center rounded-2xl
                      bg-[var(--primary-color)]/12 text-[var(--primary-color)]
                      transition-all duration-300
                      group-hover:scale-105 group-hover:bg-[var(--primary-color)]/18
                    "
                  >
                    <Icon size={21} />
                  </div>

                  <h3 className="text-base font-black text-[var(--text-primary)]">
                    {title}
                  </h3>

                  <p className="mt-3 text-sm font-medium leading-6 text-[var(--muted-text)]">
                    {description}
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

export default ContactSupport;
