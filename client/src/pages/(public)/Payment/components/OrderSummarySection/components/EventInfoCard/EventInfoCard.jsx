import { Calendar, MapPin } from "lucide-react";

function formatDateTime(startDate) {
    if (!startDate) return 'Thời gian sẽ được cập nhật';
    return new Intl.DateTimeFormat('vi-VN', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
    }).format(new Date(startDate));
}

function EventInfoCard({ event }) {
    return ( 
        <div className="space-y-2 sm:space-y-3">
            <h1 className="text-(--text-primary) text-lg sm:text-xl font-semibold line-clamp-2">
                {event?.title ?? 'Sự kiện'}
            </h1>

            <div className="flex items-start gap-2 sm:gap-3">
                <MapPin size={16} color="var(--text-primary)" className="mt-0.5 shrink-0" />
                <p className="text-sm text-(--text-primary)/60 line-clamp-2">
                    {event?.location ?? 'Địa điểm sẽ được cập nhật'}
                </p>
            </div>

            <div className="flex items-start gap-2 sm:gap-3">
                <Calendar size={16} color="var(--text-primary)" className="mt-0.5 shrink-0" />
                <p className="text-sm text-(--text-primary)/60">
                    {formatDateTime(event?.startDate)}
                </p>
            </div>
        </div>
    );
}

export default EventInfoCard;