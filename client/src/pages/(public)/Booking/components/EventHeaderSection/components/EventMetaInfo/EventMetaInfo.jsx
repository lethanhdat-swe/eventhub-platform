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

function EventMetaInfo({ event, isLoading }) {
    const dateRange = isLoading
        ? 'Loading date...'
        : formatDateRange(event?.startDate, event?.endDate);
    const timeRange = formatTimeRange(event?.startDate, event?.endDate);
    const location = event?.location ?? 'Location to be announced';

    return ( 
          <div className="flex flex-wrap items-center gap-8 lg:gap-12">
            <div className="flex items-start gap-3 group">
            <Calendar
                color="var(--text-primary)"
                size={20}
                className="mt-0.5 transition-transform duration-200 group-hover:scale-110"
            />
            <div className="flex flex-col items-start">
                <p className="text-(--text-primary)">{dateRange}</p>
                <p className="text-(--text-primary)/60">{timeRange}</p>
            </div>
            </div>

            <div className="flex items-start gap-3 group">
            <MapPin
                color="var(--text-primary)"
                size={20}
                className="mt-0.5 transition-transform duration-200 group-hover:scale-110"
            />
            <div className="flex flex-col items-start">
                <p className="text-(--text-primary)">Location</p>
                <p className="text-(--text-primary)/60">{location}</p>
            </div>
            </div>
        </div>
     );
}

export default EventMetaInfo;