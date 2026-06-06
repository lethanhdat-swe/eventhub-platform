import { Calendar, MapPin } from 'lucide-react';
import { formatDateRange, formatTimeRange } from '@/utils/formatters';

function EventMetaInfo({ event, isLoading }) {
  const dateRange = isLoading
    ? 'Đang tải ngày...'
    : formatDateRange(event?.startDate, event?.endDate, {
        emptyText: 'Ngày sẽ được cập nhật',
        sameDayMode: 'dateString',
      });

  const timeRange = formatTimeRange(event?.startDate, event?.endDate);
  const location = event?.location ?? 'Địa điểm sẽ được cập nhật';

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:max-w-2xl">
      <div className="flex items-start gap-3 rounded-2xl border border-(--text-primary)/10 bg-white/2.5 px-4 py-3">
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

      <div className="flex items-start gap-3 rounded-2xl border border-(--text-primary)/10 bg-white/2.5 px-4 py-3">
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
