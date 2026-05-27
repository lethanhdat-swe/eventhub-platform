import { AppleIcon, GooglePlayIcon } from '@/assets/icons';

function AppDownload() {
  return (
    <div
      className="
        rounded-[28px] border border-[var(--border-color)]
        bg-[var(--card-surface-color)] p-5
        shadow-[0_20px_60px_rgba(0,0,0,0.2)]
        backdrop-blur-xl
      "
    >
      <h3 className="text-lg font-black tracking-[-0.03em] text-[var(--text-primary)]">
        Tải ứng dụng EventHub
      </h3>

      <p className="mt-2 text-sm font-medium leading-6 text-[var(--muted-text)]">
        Đặt vé, lưu sự kiện và nhận thông báo mọi lúc mọi nơi.
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        <button
          type="button"
          className="
            flex items-center gap-3 rounded-2xl
            border border-[var(--border-color)]
            bg-[var(--soft-surface-color)] px-4 py-3
            text-left text-[var(--text-primary)]
            transition-all duration-300
            hover:-translate-y-0.5
            hover:border-[var(--primary-color)]/55
            hover:bg-[var(--primary-color)]/10
            active:scale-95
          "
        >
          <AppleIcon size={28} />

          <div className="leading-tight">
            <span className="block text-[10px] font-bold uppercase text-[var(--muted-text)]">
              Tải trên
            </span>
            <span className="block text-sm font-black">App Store</span>
          </div>
        </button>

        <button
          type="button"
          className="
            flex items-center gap-3 rounded-2xl
            border border-[var(--border-color)]
            bg-[var(--soft-surface-color)] px-4 py-3
            text-left text-[var(--text-primary)]
            transition-all duration-300
            hover:-translate-y-0.5
            hover:border-[var(--primary-color)]/55
            hover:bg-[var(--primary-color)]/10
            active:scale-95
          "
        >
          <GooglePlayIcon size={28} />

          <div className="leading-tight">
            <span className="block text-[10px] font-bold uppercase text-[var(--muted-text)]">
              Có mặt trên
            </span>
            <span className="block text-sm font-black">Google Play</span>
          </div>
        </button>
      </div>
    </div>
  );
}

export default AppDownload;
