import { Calendar, MapPin } from 'lucide-react';

function formatDateRange(startDate, endDate) {
  if (!startDate) return 'Date to be announced';

  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : null;

  const dateFormatter = new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  if (!end || start.toDateString() === end.toDateString()) {
    return dateFormatter.format(start);
  }

  return `${dateFormatter.format(start)} - ${dateFormatter.format(end)}`;
}

function formatTimeRange(startDate, endDate) {
  if (!startDate) return '';

  const timeFormatter = new Intl.DateTimeFormat('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const start = timeFormatter.format(new Date(startDate));
  const end = endDate ? timeFormatter.format(new Date(endDate)) : null;

  return end ? `${start} - ${end}` : start;
}

function EventMetaInfo({ event, isLoading }) {
  const dateRange = isLoading
    ? 'Loading date...'
    : formatDateRange(event?.startDate, event?.endDate);

  const timeRange = formatTimeRange(event?.startDate, event?.endDate);
  const location = event?.location ?? 'Location to be announced';

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:max-w-2xl">
      <div className="flex items-start gap-3 rounded-2xl border border-(--text-primary)/10 bg-white/[0.025] px-4 py-3">
        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-(--primary-color)/10 text-(--primary-color)">
          <Calendar size={17} />
        </div>

        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-(--text-primary)/40">
            Thời gian
          </p>

          <p className="mt-1 text-sm font-semibold text-(--text-primary)">
            {dateRange}
          </p>

          {timeRange ? (
            <p className="mt-0.5 text-sm text-(--text-primary)/55">
              {timeRange}
            </p>
          ) : null}
        </div>
      </div>

      <div className="flex items-start gap-3 rounded-2xl border border-(--text-primary)/10 bg-white/[0.025] px-4 py-3">
        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-(--primary-color)/10 text-(--primary-color)">
          <MapPin size={17} />
        </div>

        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-(--text-primary)/40">
            Địa điểm
          </p>

          <p className="mt-1 line-clamp-2 text-sm font-semibold text-(--text-primary)">
            {location}
          </p>
        </div>
      </div>
    </div>
  );
}

export default EventMetaInfo;
