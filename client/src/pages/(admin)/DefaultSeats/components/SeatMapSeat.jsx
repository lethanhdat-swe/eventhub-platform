import { cn } from '@/lib/utils';
import {
  formatSeatCode,
  getSeatTicketTypeColor,
} from '@/pages/(admin)/DefaultSeats/seatMapUtils';

function SeatMapSeat({ seat, selected, onClick }) {
  const code = formatSeatCode(seat.rowLabel, seat.seatNumber);
  const fill = getSeatTicketTypeColor(seat);
  const isUnassigned = !fill;

  return (
    <button
      type="button"
      aria-label={`Ghế ${code}`}
      aria-pressed={selected}
      title={seat.defaultTicketType?.name ?? 'Chưa gán'}
      onClick={() => onClick(seat)}
      style={fill ? { backgroundColor: fill } : undefined}
      className={cn(
        'flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-lg',
        'border text-sm font-medium transition-colors duration-150 select-none',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-1',
        isUnassigned
          ? 'border-zinc-300 bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
          : 'border-black/10 text-white hover:brightness-[0.97]',
        !selected && 'shadow-none',
        selected &&
          (isUnassigned
            ? 'border-zinc-500 bg-zinc-200 ring-2 ring-zinc-900/15 ring-offset-1'
            : 'border-zinc-900/20 ring-2 ring-zinc-900/25 ring-offset-1')
      )}
    >
      {code}
    </button>
  );
}

export default SeatMapSeat;
