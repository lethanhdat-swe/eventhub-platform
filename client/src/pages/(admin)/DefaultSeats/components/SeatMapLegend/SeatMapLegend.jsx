import { getTicketTypeOptions } from '@/pages/(admin)/DefaultSeats/seatMapUtils';

function SeatMapLegend({ seats }) {
  const items = getTicketTypeOptions(seats);

  if (items.length === 0) return null;

  return (
    <div className="mt-10 flex flex-wrap items-center justify-center gap-2 px-4">
      {items.map((item) => (
        <span
          key={item.id}
          className="inline-flex items-center gap-2 rounded-md border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-medium text-zinc-600"
        >
          <span
            className="size-2.5 shrink-0 rounded-sm border border-black/5"
            style={{ backgroundColor: item.color }}
            aria-hidden
          />
          {item.name}
        </span>
      ))}
    </div>
  );
}

export default SeatMapLegend;
