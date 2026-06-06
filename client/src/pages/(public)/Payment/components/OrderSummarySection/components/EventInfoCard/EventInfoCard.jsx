import { Calendar, MapPin } from "lucide-react";
import { formatDateTime } from '@/utils/formatters';

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
                    {formatDateTime(event?.startDate, {
                        emptyText: 'Thời gian sẽ được cập nhật',
                    })}
                </p>
            </div>
        </div>
    );
}

export default EventInfoCard;