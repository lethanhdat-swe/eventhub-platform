import { CalendarDays, MapPin } from 'lucide-react';
import StatusBadge from '../StatusBadge/StatusBadge';
import { formatEventDate } from '../../helpers';

function EventHeroSection({
  event,
  bannerUrl,
  orderCode,
  ticketCount,
  orderStatus,
}) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-(--primary-color)/20 bg-[#050816] shadow-[0_0_48px_rgba(168,85,247,0.12)]">
      <img
        src={bannerUrl}
        alt={event.title ?? 'Event banner'}
        className="absolute inset-0 object-cover w-full h-full opacity-45"
      />

      <div className="absolute inset-0 bg-linear-to-r from-[#050816] via-[#050816]/85 to-[#050816]/35" />
      <div className="absolute inset-0 bg-linear-to-br from-(--primary-color)/25 via-transparent to-blue-500/15" />

      <div className="relative flex flex-col justify-end gap-5 p-6 min-h-72 sm:p-8 lg:p-10">
        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge tone={orderStatus.tone}>{orderStatus.label}</StatusBadge>
          <StatusBadge className="text-white">{ticketCount} vé</StatusBadge>
          <StatusBadge className="text-white">{orderCode}</StatusBadge>
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.28em] text-(--primary-color)">
            EventHub Ticket Pass
          </p>

          <h1 className="max-w-3xl text-3xl font-bold text-white sm:text-5xl">
            {event.title ?? 'Sự kiện'}
          </h1>

          <div className="flex flex-wrap gap-4 mt-5 text-sm text-white/75">
            <span className="flex items-center gap-2">
              <CalendarDays className="size-4 text-(--primary-color)" />
              {formatEventDate(event.startDate, event.endDate)}
            </span>

            <span className="flex items-center gap-2">
              <MapPin className="size-4 text-(--primary-color)" />
              {event.location ?? 'Chưa cập nhật địa điểm'}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default EventHeroSection;
