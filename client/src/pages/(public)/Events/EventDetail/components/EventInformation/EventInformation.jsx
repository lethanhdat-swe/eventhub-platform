import { FacebookIcon, InstagramIcon, TwitterIcon } from '@/assets/icons';

import { CalendarDays, Clock, Link2, MapPin, Tag } from 'lucide-react';

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 rounded-xl bg-(--soft-surface-color) px-3 py-2.5">
      <Icon size={16} className="mt-0.5 shrink-0 text-(--primary-color)" />

      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-(--muted-text)">{label}</p>

        <p className="mt-0.5 wrap-break-word text-sm font-bold leading-snug text-(--text-primary)">
          {value}
        </p>
      </div>
    </div>
  );
}

function EventInformation({ event }) {
  const startDate = new Date(event.startDate);

  const dateStr = startDate.toLocaleDateString('vi-VN', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const timeStr = startDate.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch (error) {
      console.error('Failed to copy event link:', error);
    }
  };

  return (
    <section className="mt-4 rounded-2xl border border-(--border-color) bg-(--card-surface-color) p-4 shadow-xl shadow-black/10 backdrop-blur-xl">
      <div className="mb-4">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-(--muted-text)">
          Thông tin
        </p>

        <h2 className="mt-1 text-sm font-bold text-(--text-primary)">
          Chi tiết sự kiện
        </h2>
      </div>

      <div className="space-y-2.5">
        <InfoRow icon={CalendarDays} label="Ngày diễn ra" value={dateStr} />
        <InfoRow icon={Clock} label="Thời gian" value={timeStr} />
        <InfoRow
          icon={MapPin}
          label="Địa điểm"
          value={event.location || 'Đang cập nhật'}
        />
        <InfoRow
          icon={Tag}
          label="Danh mục"
          value={event.category?.name || 'Tổng hợp'}
        />
      </div>

      <div className="mt-4 border-t border-(--border-color) pt-4">
        <p className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-(--muted-text)">
          Chia sẻ sự kiện
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-(--border-color) bg-(--soft-surface-color) text-(--text-primary) transition-colors hover:border-(--primary-color)/40 hover:bg-(--primary-color)/10"
          >
            <FacebookIcon />
          </button>

          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-(--border-color) bg-(--soft-surface-color) text-(--text-primary) transition-colors hover:border-(--primary-color)/40 hover:bg-(--primary-color)/10"
          >
            <InstagramIcon />
          </button>

          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-(--border-color) bg-(--soft-surface-color) text-(--text-primary) transition-colors hover:border-(--primary-color)/40 hover:bg-(--primary-color)/10"
          >
            <TwitterIcon />
          </button>

          <button
            type="button"
            onClick={handleCopyLink}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-(--border-color) bg-(--soft-surface-color) text-(--text-primary) transition-colors hover:border-(--primary-color)/40 hover:bg-(--primary-color)/10"
          >
            <Link2 size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}

export default EventInformation;
