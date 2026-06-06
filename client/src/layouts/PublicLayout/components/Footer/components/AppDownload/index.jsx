import { AppleIcon, GooglePlayIcon } from '@/assets/icons';

function AppDownload() {
  return (
    <div
      className="
        rounded-[24px] border border-(--border-color)
        bg-(--card-surface-color) p-4 sm:p-5
        shadow-[0_20px_60px_rgba(0,0,0,0.2)]
        backdrop-blur-xl
      "
    >
      <h3 className="text-base font-black tracking-[-0.03em] text-(--text-primary) sm:text-lg">
        Tải ứng dụng Beetic
      </h3>
      <p className="mt-2 text-sm font-medium leading-6 text-(--muted-text)">
        Đặt vé, lưu sự kiện và nhận thông báo mọi lúc mọi nơi.
      </p>

      <div className="mt-4 grid grid-cols-2 gap-2.5 lg:grid-cols-1 xl:grid-cols-2">
        {/* App Store button */}
        <button
          type="button"
          className="
            flex items-center gap-3 rounded-2xl
            border border-(--border-color)
            bg-(--soft-surface-color) px-3 py-2.5 sm:px-4 sm:py-3
            text-left text-(--text-primary)
            transition-all duration-300
            hover:-translate-y-0.5
            hover:border-(--primary-color)/55
            hover:bg-(--primary-color)/10
            active:scale-95
          "
        >
          <AppleIcon size={26} />
          <div className="leading-tight">
            <span className="block text-[10px] font-bold uppercase text-(--muted-text)">
              Tải trên
            </span>
            <span className="block text-sm font-black">App Store</span>
          </div>
        </button>

        {/* Google Play button */}
        <button
          type="button"
          className="
            flex items-center gap-3 rounded-2xl
            border border-(--border-color)
            bg-(--soft-surface-color) px-3 py-2.5 sm:px-4 sm:py-3
            text-left text-(--text-primary)
            transition-all duration-300
            hover:-translate-y-0.5
            hover:border-(--primary-color)/55
            hover:bg-(--primary-color)/10
            active:scale-95
          "
        >
          <GooglePlayIcon size={26} />
          <div className="leading-tight">
            <span className="block text-[10px] font-bold uppercase text-(--muted-text)">
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
