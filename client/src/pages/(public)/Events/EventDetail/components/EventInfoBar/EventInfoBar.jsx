import { CalendarDays, Clock, MapPin, UserRound } from 'lucide-react';

function EventInfoBar({ event }) {
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

  return (
    <section className="border-y border-(--border-color) py-5">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-6">
        <InfoItem
          icon={CalendarDays}
          label="Thời gian"
          title={dateStr}
          extra={
            <span className="inline-flex items-center gap-1.5 text-sm font-bold text-(--text-primary)">
              <Clock size={15} className="text-(--primary-color)" />
              {timeStr}
            </span>
          }
        />

        <InfoItem
          icon={MapPin}
          label="Địa điểm"
          title={event.location || 'Đang cập nhật'}
        />

        <InfoItem
          icon={UserRound}
          label="Đơn vị tổ chức"
          title={event.organizer?.name || 'EventHub'}
        />
      </div>
    </section>
  );
}

function InfoItem({ icon: Icon, label, title, extra }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-(--primary-color)/10 text-(--primary-color)">
        <Icon size={19} />
      </div>

      <div className="min-w-0">
        <p className="mb-1 text-[11px] font-black uppercase tracking-[0.16em] text-(--muted-text)">
          {label}
        </p>

        <h3 className="line-clamp-2 text-base font-black leading-snug text-(--text-primary)">
          {title}
        </h3>

        {extra && <div className="mt-2">{extra}</div>}
      </div>
    </div>
  );
}

export default EventInfoBar;
