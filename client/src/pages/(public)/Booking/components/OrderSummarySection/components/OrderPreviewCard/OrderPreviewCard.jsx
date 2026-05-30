import { images } from '@/assets';
import { resolvePublicAssetUrl } from '@/lib/url/resolvePublicAssetUrl';
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

function OrderPreviewCard({ event }) {
  const imageUrl = resolvePublicAssetUrl(event?.thumbnailUrl) || images.home;
  const categoryName = event?.category?.name;

  return (
    <div className="rounded-2xl border border-(--text-primary)/10 bg-white/[0.025] p-4 xl:border-r xl:border-(--text-primary)/10">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-4 sm:col-span-3 xl:col-span-4">
          <div className="overflow-hidden rounded-2xl bg-black/20">
            <img
              src={imageUrl}
              alt={event?.title ?? 'Event'}
              className="aspect-[3/4] h-full w-full object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
        </div>

        <div className="col-span-8 min-w-0 sm:col-span-9 xl:col-span-8">
          <div className="mb-4">
            <h3 className="line-clamp-2 text-base font-black tracking-tight text-(--text-primary)">
              {event?.title ?? 'Event'}
            </h3>

            {categoryName ? (
              <span
                className="mt-2 inline-flex rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase"
                style={{
                  color: 'var(--primary-color)',
                  backgroundColor:
                    'color-mix(in srgb, var(--primary-color) 15%, transparent)',
                  borderColor:
                    'color-mix(in srgb, var(--primary-color) 30%, transparent)',
                }}
              >
                {categoryName}
              </span>
            ) : null}
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3 rounded-xl bg-black/15 p-3">
              <Calendar
                size={17}
                color="var(--text-primary)"
                className="mt-0.5 shrink-0 opacity-80"
              />

              <div className="min-w-0 text-(--text-primary)/65">
                <p className="font-medium text-(--text-primary)">
                  {formatDateRange(event?.startDate, event?.endDate)}
                </p>
                <p className="mt-0.5 text-xs">
                  {formatTimeRange(event?.startDate, event?.endDate)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl bg-black/15 p-3">
              <MapPin
                size={17}
                color="var(--text-primary)"
                className="mt-0.5 shrink-0 opacity-80"
              />

              <p className="line-clamp-2 min-w-0 text-sm text-(--text-primary)/65">
                {event?.location ?? 'Location to be announced'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderPreviewCard;
