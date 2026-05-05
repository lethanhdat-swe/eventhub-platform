import { ArrowRight, Star } from 'lucide-react';

function Limit() {
  return (
    <div className="container flex justify-center mt-10">
      <div className="relative flex items-center gap-8 max-w-3xl w-full bg-linear-to-br from-[#110d22] via-[#1a1030] to-[#0e0b1f] border border-(--primary-color)/30 rounded-2xl px-10 py-8 overflow-hidden shadow-[0_0_60px_rgba(120,40,255,0.12)]">
        <div className="absolute w-56 h-56 rounded-full pointer-events-none -top-14 -left-14 bg-(--primary-color)/20 blur-3xl" />
        <div className="absolute w-64 h-64 rounded-full pointer-events-none -bottom-16 right-24 bg-(--primary-color)/10 blur-3xl" />

        <div className="absolute inset-0 pointer-events-none rounded-2xl opacity-40 bg-[repeating-linear-gradient(to_bottom,transparent_0px,transparent_3px,rgba(255,255,255,0.013)_3px,rgba(255,255,255,0.013)_4px)]" />

        {/* Icon */}
        <div className="relative flex items-center justify-center shrink-0 w-28 h-28">
          <div className="absolute w-28 h-28 rounded-full border border-(--primary-color)/40 border-t-(--primary-color) animate-spin animation-duration-[8s]" />
          <div className="absolute w-22 h-22 rounded-full border border-(--primary-color)/20 border-b-(--primary-color)/60 animate-spin animation-duration-[6s] animation-direction-[reverse]" />

          <div className="relative z-10 w-16 h-16 rounded-xl rotate-45 flex items-center justify-center shadow-[0_0_28px_rgba(180,60,255,0.6)] bg-[linear-gradient(to_bottom_right,(--primary-color),(--primary-color))] ">
            <span className="text-yellow-300 text-2xl -rotate-45 drop-shadow-[0_0_8px_rgba(255,220,80,0.9)]">
              <Star />
            </span>
          </div>
        </div>

        <div className="relative z-10 flex-1">
          <p className="mb-2 text-xs font-semibold tracking-widest text-(--primary-color) uppercase">
            Limited Time Offer!
          </p>
          <h2 className="mb-2 text-2xl font-extrabold leading-tight tracking-tight text-white">
            Get 20% Off Your First Order
          </h2>
          <p className="max-w-xs text-sm leading-relaxed text-(--primary-color)/50">
            Sign up now and unlock exclusive deals on your favorite events.
          </p>
        </div>

        <div className="relative z-10 shrink-0">
          <button
            className="flex items-center gap-2 hover:brightness-110 hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(180,80,255,0.6)] active:scale-95 transition-all duration-200 text-white font-medium text-sm px-7 py-4 rounded-xl whitespace-nowrap cursor-pointer border-0"
            style={{
              background:
                'linear-gradient(to bottom right, var(--primary-color), var(--primary-color))',
              boxShadow: '0 4px 24px rgba(160,60,255,0.45)',
            }}
          >
            Sign Up Now
            <span className="text-base transition-transform duration-200 group-hover:translate-x-1">
              <ArrowRight />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
export default Limit;
