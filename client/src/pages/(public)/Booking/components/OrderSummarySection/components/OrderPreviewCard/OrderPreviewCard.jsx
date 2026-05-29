import { images } from "@/assets";
import { resolvePublicAssetUrl } from '@/lib/url/resolvePublicAssetUrl';
import { Calendar, MapPin } from "lucide-react";

function formatDateRange(startDate, endDate) {
    if (!startDate) return 'Date to be announced';
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : null;
    const dateFormatter = new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    if (!end || start.toDateString() === end.toDateString()) return dateFormatter.format(start);
    return `${dateFormatter.format(start)} - ${dateFormatter.format(end)}`;
}

function formatTimeRange(startDate, endDate) {
    if (!startDate) return '';
    const timeFormatter = new Intl.DateTimeFormat('vi-VN', { hour: '2-digit', minute: '2-digit' });
    const start = timeFormatter.format(new Date(startDate));
    const end = endDate ? timeFormatter.format(new Date(endDate)) : null;
    return end ? `${start} - ${end}` : start;
}

function OrderPreviewCard({ event }) {
    const imageUrl = resolvePublicAssetUrl(event?.thumbnailUrl) || images.home;
    const categoryName = event?.category?.name;

    return (
        <div className="grid grid-cols-12 gap-3 lg:border-r lg:border-(--text-primary)/20 lg:pr-3">
            {/* Thumbnail */}
            <div className="col-span-4 sm:col-span-3">
                <img
                    src={imageUrl}
                    alt={event?.title ?? 'Event'}
                    className="object-cover w-full h-full rounded-xl aspect-3/4 sm:aspect-auto"
                />
            </div>

            {/* Info */}
            <div className="min-w-0 col-span-8 sm:col-span-9">
                <div className="flex flex-col items-start gap-2 mb-3 sm:mb-5">
                    <p className="text-(--text-primary) text-sm font-bold tracking-tight line-clamp-2">
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

                <div className="space-y-2 text-xs sm:space-y-3 sm:text-sm">
                    <div className="flex items-start gap-2 sm:gap-3 group">
                        <Calendar size={16} color="var(--text-primary)" className="mt-0.5 shrink-0 transition-transform duration-200 group-hover:scale-110" />
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-(--text-primary)/60 min-w-0">
                            <p className="shrink-0">{formatDateRange(event?.startDate, event?.endDate)}</p>
                            <p className="sm:border-l sm:border-(--text-primary)/30 sm:pl-2">{formatTimeRange(event?.startDate, event?.endDate)}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-2 sm:gap-3 group">
                        <MapPin size={16} color="var(--text-primary)" className="mt-0.5 shrink-0 transition-transform duration-200 group-hover:scale-110" />
                        <p className="text-(--text-primary)/60 line-clamp-2">
                            {event?.location ?? 'Location to be announced'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OrderPreviewCard;