import { images } from '@/assets';
import { resolvePublicAssetUrl } from '@/lib/url/resolvePublicAssetUrl';
import { Calendar, MapPin } from 'lucide-react';
import { formatDateRange, formatTimeRange } from '@/utils/formatters';

function OrderPreviewCard({ event }) {
  const imageUrl = resolvePublicAssetUrl(event?.thumbnailUrl) || images.home;
  const categoryName = event?.category?.name;

  return (
    <div className="rounded-2xl border border-(--text-primary)/10 bg-white/2.5 p-4 xl:border-r xl:border-(--text-primary)/10">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-4 sm:col-span-3 xl:col-span-4">
          <div className="overflow-hidden rounded-2xl bg-black/20">
            <img
              src={imageUrl}
              alt={event?.title ?? 'Sự kiện'}
              className="object-cover w-full h-full transition-transform duration-500 aspect-3/4 hover:scale-105"
            />
          </div>
        </div>

        <div className="min-w-0 col-span-8 sm:col-span-9 xl:col-span-8">
          <div className="mb-4">
            <h3 className="line-clamp-2 text-base font-black tracking-tight text-(--text-primary)">
              {event?.title ?? 'Sự kiện'}
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
            <div className="flex items-start gap-3 p-3 rounded-xl bg-black/15">
              <Calendar
                size={17}
                color="var(--text-primary)"
                className="mt-0.5 shrink-0 opacity-80"
              />

              <div className="min-w-0 text-(--text-primary)/65">
                <p className="font-medium text-(--text-primary)">
                  {formatDateRange(event?.startDate, event?.endDate, {
                    emptyText: 'Ngày sẽ được cập nhật',
                    sameDayMode: 'dateString',
                  })}
                </p>
                <p className="mt-0.5 text-xs">
                  {formatTimeRange(event?.startDate, event?.endDate)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-black/15">
              <MapPin
                size={17}
                color="var(--text-primary)"
                className="mt-0.5 shrink-0 opacity-80"
              />

              <p className="line-clamp-2 min-w-0 text-sm text-(--text-primary)/65">
                {event?.location ?? 'Địa điểm sẽ được cập nhật'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderPreviewCard;
