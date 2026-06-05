import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const STAGE_LABEL = 'SÂN KHẤU';

function SeatButton({
  seat,
  color,
  selected,
  showCheckbox,
  disabled,
  onClick,
}) {
  const code = `${seat.rowLabel}${seat.seatNumber ?? ''}`;
  const isUnassigned = !color;
  const base =
    'relative flex size-11 shrink-0 items-center justify-center rounded-lg border text-sm font-medium transition duration-150 select-none';
  const focus =
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-1';
  const assignedClasses = disabled
    ? 'border-zinc-300 text-zinc-900/70'
    : isUnassigned
      ? 'border-zinc-300 bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
      : 'border-black/10 text-white hover:brightness-[0.97]';

  return (
    <button
      type="button"
      aria-label={`Ghế ${code}`}
      aria-pressed={selected}
      title={`${seat.ticketTypeName ?? 'Chưa có loại vé'} - ${seat.status}`}
      onClick={onClick}
      style={color ? { backgroundColor: color } : undefined}
      className={cn(
        base,
        focus,
        assignedClasses,
        'cursor-pointer',
        disabled && 'opacity-80',
        !selected && 'shadow-none',
        selected &&
          (isUnassigned
            ? 'border-zinc-500 bg-zinc-200 ring-2 ring-zinc-900/15 ring-offset-1'
            : 'border-zinc-900/20 ring-2 ring-zinc-900/25 ring-offset-1')
      )}
    >
      {showCheckbox ? (
        <span
          className={cn(
            'absolute left-2 top-2 grid h-4 w-4 place-items-center rounded border bg-white',
            selected
              ? 'border-primary text-primary'
              : 'border-zinc-300 text-transparent'
          )}
        >
          <Check className="w-3 h-3" />
        </span>
      ) : null}
      {disabled ? (
        <>
          <span className="absolute inset-0 bg-white/10" />
          <span className="absolute inset-0">
            <span className="absolute inset-0 rotate-45 border-t border-white/80" />
            <span className="absolute inset-0 -rotate-45 border-t border-white/80" />
          </span>
          <span className="absolute inset-x-0 top-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-destructive">
            DISABLED
          </span>
        </>
      ) : null}
      <span className={cn(disabled ? 'mt-4' : '')}>{code}</span>
    </button>
  );
}

export default function EventSeatMap({
  seats = [],
  ticketTypeMap = new Map(),
  selectedIds = [],
  selectMode = false,
  onSeatClick,
  isLoading,
}) {
  const byRow = seats.reduce((acc, s) => {
    const row = s.rowLabel ?? '';
    if (!acc[row]) acc[row] = [];
    acc[row].push(s);
    return acc;
  }, {});

  const sortedRowLabels = Object.keys(byRow).sort((a, b) =>
    a.localeCompare(b, undefined, { sensitivity: 'base' })
  );

  return (
    <div className="flex flex-col justify-center min-w-0 px-6 py-10 bg-white min-h-105 md:px-12 md:py-14">
      <div className="flex items-center justify-center w-full gap-3 px-4 mb-10">
        <span
          className="flex-1 hidden h-px max-w-20 bg-zinc-200 sm:block"
          aria-hidden
        />
        <p className="shrink-0 text-[11px] font-medium uppercase tracking-[0.28em] text-zinc-500">
          {STAGE_LABEL}
        </p>
        <span
          className="flex-1 hidden h-px max-w-20 bg-zinc-200 sm:block"
          aria-hidden
        />
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center gap-5 py-12 min-h-90">
          <div className="w-32 h-4 rounded bg-zinc-200" />
        </div>
      ) : sortedRowLabels.length === 0 ? (
        <p className="flex min-h-[360px] items-center justify-center px-8 py-16 text-center text-sm text-muted-foreground">
          Chưa có ghế nào.
        </p>
      ) : (
        <div className="flex flex-col gap-5">
          {sortedRowLabels.map((label) => (
            <div key={label} className="flex justify-center gap-3 px-2">
              {byRow[label]
                .slice()
                .sort((a, b) => (a.seatNumber ?? 0) - (b.seatNumber ?? 0))
                .map((seat) => {
                  const tt = seat.ticketTypeId
                    ? ticketTypeMap.get(seat.ticketTypeId)
                    : null;
                  const color = tt?.color || null;
                  const selected = selectedIds.includes(seat.id);
                  const disabled = seat.status === 'DISABLED';
                  return (
                    <SeatButton
                      key={seat.id}
                      seat={seat}
                      color={color}
                      selected={selected}
                      showCheckbox={selectMode}
                      disabled={disabled}
                      onClick={() => onSeatClick(seat)}
                    />
                  );
                })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
