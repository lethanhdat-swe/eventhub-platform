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
    <section className="overflow-hidden rounded-3xl border border-(--border-color) bg-(--card-surface-color) shadow-xl shadow-black/10 backdrop-blur-xl">
      <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_1.5fr]">
        <div className="relative border-b border-(--border-color) p-5 lg:border-b-0 lg:border-r">
          <div className="absolute inset-0 bg-(--primary-color)/[0.04]" />

          <div className="relative flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-(--primary-color)/30 bg-(--primary-color)/15 text-(--primary-color)">
              <CalendarDays size={24} />
            </div>

            <div className="min-w-0">
              <p className="mb-1 text-xs font-black uppercase tracking-[0.18em] text-(--muted-text)">
                Thời gian diễn ra
              </p>

              <h3 className="text-lg font-black leading-snug text-(--text-primary)">
                {dateStr}
              </h3>

              <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-(--border-color) bg-(--background-color)/50 px-3 py-1.5 text-sm font-bold text-(--text-primary)">
                <Clock size={15} className="text-(--primary-color)" />
                {timeStr}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 divide-y divide-(--border-color)">
          <div className="flex items-start gap-4 p-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-(--border-color) bg-(--soft-surface-color) text-(--primary-color)">
              <MapPin size={22} />
            </div>

            <div className="min-w-0">
              <p className="mb-1 text-xs font-black uppercase tracking-[0.18em] text-(--muted-text)">
                Địa điểm
              </p>

              <p className="text-base font-bold leading-snug text-(--text-primary)">
                {event.location || 'Đang cập nhật'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-(--border-color) bg-(--soft-surface-color) text-(--primary-color)">
              <UserRound size={22} />
            </div>

            <div className="min-w-0">
              <p className="mb-1 text-xs font-black uppercase tracking-[0.18em] text-(--muted-text)">
                Đơn vị tổ chức
              </p>

              <p className="text-base font-bold leading-snug text-(--text-primary)">
                {event.organizer?.name || 'EventHub'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default EventInfoBar;
