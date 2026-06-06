import { Headphones, MessageSquareText, ShieldCheck } from 'lucide-react';

const SUPPORT_DATA = [
  {
    id: 1,
    Icon: MessageSquareText,
    title: 'Phản hồi nhanh',
    description:
      'Đội ngũ Beetic sẽ tiếp nhận và phản hồi yêu cầu của bạn trong thời gian sớm nhất.',
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
    <section className="relative bg-(--background-color) py-10 sm:py-14 md:py-16 text-(--text-primary)">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(124,58,237,0.16),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.1),transparent_30%)]" />

      <div className="container relative z-10">
        <div
          className="
            overflow-hidden rounded-2xl sm:rounded-[28px] md:rounded-[32px]
            border border-(--border-color)
            bg-(--card-surface-color)
            p-5 sm:p-6 md:p-8
            shadow-[0_24px_80px_rgba(0,0,0,0.24)]
            backdrop-blur-xl
          "
        >
          <div className="grid gap-8 sm:gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            {/* Left: heading */}
            <div>
              <p className="mb-3 sm:mb-4 text-[10px] sm:text-xs font-black uppercase tracking-[0.28em] text-(--primary-color)">
                Bạn có thắc mắc?
              </p>

              <h2 className="max-w-xl text-2xl sm:text-3xl md:text-4xl font-black leading-tight tracking-[-0.04em] text-(--text-primary)">
                Beetic luôn sẵn sàng
                <br />
                <span className="bg-linear-to-r from-[#f0abfc] via-[#c084fc] to-[#9333ea] bg-clip-text text-transparent">
                  hỗ trợ bạn
                </span>
              </h2>

              <p className="mt-4 sm:mt-5 max-w-xl text-sm sm:text-base font-medium leading-7 sm:leading-8 text-(--muted-text)">
                Liên hệ với chúng tôi nếu bạn cần hỗ trợ về sự kiện, đặt vé, đối
                tác hoặc bất kỳ thông tin nào khác.
              </p>
            </div>

            {/* Right: cards */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
              {SUPPORT_DATA.map(({ id, Icon, title, description }) => (
                <div
                  key={id}
                  className="
                    group rounded-xl sm:rounded-[20px] md:rounded-[24px]
                    border border-(--border-color)
                    bg-(--soft-surface-color)
                    p-4 sm:p-5
                    transition-all duration-300
                    hover:-translate-y-1 hover:border-(--primary-color)/45
                    hover:bg-(--primary-color)/8
                    hover:shadow-[0_18px_55px_rgba(124,58,237,0.16)]
                    flex sm:flex-col items-start gap-4 sm:gap-0
                  "
                >
                  <div
                    className="
                      shrink-0 flex size-10 sm:size-12 items-center justify-center rounded-xl sm:rounded-2xl
                      bg-(--primary-color)/12 text-(--primary-color)
                      transition-all duration-300
                      group-hover:scale-105 group-hover:bg-(--primary-color)/18
                      sm:mb-5
                    "
                  >
                    <Icon size={18} className="sm:hidden" />
                    <Icon size={21} className="hidden sm:block" />
                  </div>

                  <div>
                    <h3 className="text-sm sm:text-base font-black text-(--text-primary)">
                      {title}
                    </h3>

                    <p className="mt-1.5 sm:mt-3 text-xs sm:text-sm font-medium leading-5 sm:leading-6 text-(--muted-text)">
                      {description}
                    </p>
                  </div>
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