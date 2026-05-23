import { images } from "@/assets";
import { resolvePublicAssetUrl } from '@/lib/url/resolvePublicAssetUrl';
import { Calendar, MapPin } from "lucide-react";

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
          <div className="grid grid-cols-12 gap-3 lg:border-r lg:border-(--text-primary)/20 lg:pr-3">
                    <div className="col-span-4">
                        <img src={imageUrl} alt={event?.title ?? 'Event'} className="object-cover h-full rounded-xl"/>
                    </div>

                    <div className="col-span-8">
                        <div className="flex flex-col items-start gap-2 mb-5">
                            <p className="text-(--text-primary) text-[14px] font-bold tracking-tight">
                                {event?.title ?? 'Event'}
                            </p>
                            {categoryName ? (
                              <p
                                className="text-xs px-2 py-0.5 rounded-sm uppercase border text-center shrink-0"
                                style={{
                                color: "var(--primary-color)",
                                backgroundColor: "color-mix(in srgb, var(--primary-color) 15%, transparent)",
                                borderColor: "color-mix(in srgb, var(--primary-color) 30%, transparent)",
                                }}
                            >
                                {categoryName}
                              </p>
                            ) : null}
                        </div>

                         <div className="space-y-3 text-sm">
                            <div className="flex items-center gap-3 group">
                             <Calendar
                                    size={18}
                                    color="var(--text-primary)"
                                    className="mt-0.5 transition-transform duration-200 group-hover:scale-110"
                                />
                            <div className="flex items-center gap-2 text-(--text-primary)/60">
                                <p>{formatDateRange(event?.startDate, event?.endDate)}</p>
                                <p className=" border-l border-(--text-primary)/30 pl-2">{formatTimeRange(event?.startDate, event?.endDate)}</p>
                            </div>
                         </div>

                          <div className="flex items-center gap-3 group">
                             <MapPin
                                    size={18}
                                    color="var(--text-primary)"
                                    className="mt-0.5 transition-transform duration-200 group-hover:scale-110"
                                />
                            <div className="flex items-center gap-2 text-(--text-primary)/60">
                                <p>{event?.location ?? 'Location to be announced'}</p>
                            </div>
                         </div>
                         </div>
                    </div>
                </div>

      );
}

export default OrderPreviewCard;