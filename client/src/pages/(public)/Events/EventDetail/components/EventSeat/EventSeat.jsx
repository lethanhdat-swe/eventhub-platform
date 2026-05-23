import { useMemo } from 'react';

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
    <div className="mt-5">
      {isLoading ? (
        <div className="rounded-xl border border-(--text-primary)/10 bg-(--surface-color) p-4 text-sm text-(--text-primary)/55">
          Loading seat map...
        </div>
      ) : error ? (
        <div className="rounded-xl border border-(--text-primary)/10 bg-(--surface-color) p-4 text-sm text-(--text-primary)/55">
          {error}
        </div>
      ) : (
        <PublicSeatMap seats={eventSeatItems} mode="preview" />
      )}
    </div>
  );
}

export default EventSeat;
