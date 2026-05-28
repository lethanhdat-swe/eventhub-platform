import { useMemo } from 'react';
import { Armchair } from 'lucide-react';

import PublicSeatMap from '../../../components/PublicSeatMap/PublicSeatMap';

function mapEventSeat(item) {
  return {
    id: item.id,
    status: item.status,
    seat: {
      rowLabel: item.seat?.rowLabel ?? item.rowLabel,
      seatNumber: item.seat?.seatNumber ?? item.seatNumber,
    },
    ticketType: {
      id: item.ticketType?.id ?? item.ticketTypeId,
      name: item.ticketType?.name ?? 'Ticket',
      color: item.ticketType?.color ?? '#8b5cf6',
      price: item.ticketType?.price ?? 0,
    },
  };
}

function EventSeat({ eventSeats = [], isLoading = false, error = null }) {
  const eventSeatItems = useMemo(
    () => eventSeats.map(mapEventSeat).filter((item) => item.id),
    [eventSeats]
  );

  return (
    <section className="mt-8 border-t border-(--border-color) pt-8">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-(--primary-color)">
            <Armchair size={15} />
            Sơ đồ chỗ ngồi
          </p>

          <h2 className="text-2xl font-black tracking-tight text-(--text-primary)">
            Chọn vị trí của bạn
          </h2>
        </div>

        <span className="hidden rounded-full border border-(--border-color) bg-(--soft-surface-color) px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-(--muted-text) sm:inline-flex">
          Preview
        </span>
      </div>

      {isLoading ? (
        <div className="rounded-2xl border border-(--border-color) bg-(--surface-color) p-5 text-sm text-(--muted-text)">
          Đang tải sơ đồ chỗ ngồi...
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-5 text-sm text-red-300">
          {error}
        </div>
      ) : eventSeatItems.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-(--border-color) bg-(--soft-surface-color) p-5 text-sm text-(--muted-text)">
          Sự kiện này chưa có sơ đồ chỗ ngồi.
        </div>
      ) : (
        <PublicSeatMap seats={eventSeatItems} mode="preview" />
      )}
    </section>
  );
}

export default EventSeat;
