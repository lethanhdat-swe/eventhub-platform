import { images } from '@/assets';
import { Headphones, Mail, Sparkles } from 'lucide-react';

function HeroContact() {
  return (
    <section className="relative h-[500px] overflow-hidden">
      <img
        src={images.home}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div className="absolute inset-0 bg-linear-to-r from-black/92 via-black/58 to-black/25" />
      <div className="absolute inset-0 bg-linear-to-t from-black/78 via-black/15 to-black/20" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_35%,rgba(168,85,247,0.34),transparent_36%)]" />

      <div className="container relative z-10 flex h-full items-center pt-4">
        <div className="max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-4 py-2 backdrop-blur-xl">
            <Sparkles
              size={14}
              className="text-[var(--primary-color)] drop-shadow-[0_0_16px_rgba(168,85,247,0.9)]"
            />

            <span className="text-[11px] font-black uppercase tracking-[0.26em] text-white/72">
              Liên hệ EventHub
            </span>
          </div>

          <h1 className="mb-5 max-w-3xl text-[44px] font-black leading-[1.08] tracking-[-0.045em] text-white drop-shadow-[0_8px_32px_rgba(0,0,0,0.6)] md:text-[52px]">
            Chúng tôi luôn
            <br />
            <span className="bg-gradient-to-r from-[#f0abfc] via-[#c084fc] to-[#9333ea] bg-clip-text text-transparent">
              sẵn sàng hỗ trợ bạn
            </span>
          </h1>

          <p className="max-w-2xl text-base font-medium leading-8 text-white/68">
            Gửi thắc mắc, góp ý hoặc yêu cầu hỗ trợ cho EventHub. Đội ngũ của
            chúng tôi sẽ phản hồi bạn trong thời gian sớm nhất.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/10 px-5 py-3 text-sm font-bold text-white backdrop-blur-xl">
              <Mail size={16} className="text-white/60" />
              <span>Phản hồi nhanh chóng</span>
            </div>

            <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/10 px-5 py-3 text-sm font-bold text-white backdrop-blur-xl">
              <Headphones size={16} className="text-white/60" />
              <span>Hỗ trợ người dùng</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroContact;
