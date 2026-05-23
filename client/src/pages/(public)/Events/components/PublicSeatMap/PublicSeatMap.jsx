import { Lock } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';

const LOCKED_STATUSES = ['BOOKED', 'RESERVING', 'PENDING', 'DISABLED'];

function sortRowLabel(a, b) {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
}

function groupSeatsByRow(seats) {
  return seats
    .filter((item) => item?.seat)
    .reduce((rows, item) => {
      const rowLabel = item.seat.rowLabel || '-';

      if (!rows[rowLabel]) {
        rows[rowLabel] = [];
      }

      rows[rowLabel].push(item);
      return rows;
    }, {});
}

function getTicketTypes(seats) {
  const ticketMap = new Map();

  seats.forEach((item) => {
    if (item?.ticketType?.id && !ticketMap.has(item.ticketType.id)) {
      ticketMap.set(item.ticketType.id, item.ticketType);
    }
  });

  return Array.from(ticketMap.values());
}

function PublicSeatMap({
  seats = [],
  mode = 'preview',
  selectedSeatIds = [],
  onToggleSeat,
  showLegend = true,
  showStage = true,
  className,
}) {
  const selectedIds = new Set(selectedSeatIds);
  const rows = groupSeatsByRow(seats);
  const rowLabels = Object.keys(rows).sort(sortRowLabel);
  const ticketTypes = getTicketTypes(seats);

  const handleToggleSeat = (seat) => {
    const isClickable = mode === 'booking' && seat.status === 'AVAILABLE';

    if (!isClickable) return;
    onToggleSeat?.(seat);
  };

  return (
    <Card
      className={cn(
        'rounded-2xl border border-(--text-primary)/10 bg-(--surface-color) text-(--text-primary) shadow-2xl shadow-black/10',
        className
      )}
    >
      <CardHeader className="gap-2 px-5 pt-5 sm:px-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="text-xl font-semibold text-(--text-primary)">
              Seat Map
            </CardTitle>
            <CardDescription className="mt-1 text-sm text-(--text-primary)/55">
              Choose your preferred seats from the interactive event layout.
            </CardDescription>
          </div>

          <span className="rounded-full border border-(--text-primary)/10 bg-(--background-color)/40 px-3 py-1 text-xs font-medium uppercase tracking-[0.24em] text-(--text-primary)/60">
            {mode}
          </span>
        </div>
      </CardHeader>

      <CardContent className="px-5 pb-5 sm:px-6">
        <div className="rounded-2xl border border-(--text-primary)/10 bg-(--background-color)/40 p-4 sm:p-6">
          {rowLabels.length > 0 ? (
            <div className="flex flex-col items-center">
              {showStage && (
                <div className="flex w-full justify-center">
                  <div className="w-[min(100%,640px)] rounded-full border border-fuchsia-300/30 bg-linear-to-r from-fuchsia-500/25 via-violet-500/40 to-cyan-400/25 px-6 py-3 text-center text-xs font-bold uppercase tracking-[0.42em] text-white shadow-lg shadow-violet-500/20 sm:w-[76%] sm:min-w-[420px]">
                    Stage
                  </div>
                </div>
              )}

              <div
                className={cn(
                  'w-full overflow-x-auto p-2',
                  showStage && 'mt-20'
                )}
              >
                <div className="mx-auto flex w-fit min-w-max flex-col gap-4 px-1">
                  {rowLabels.map((rowLabel) => (
                    <div
                      key={rowLabel}
                      className="grid grid-cols-[24px_1fr] items-center gap-4"
                    >
                      <span className="text-center text-sm font-semibold text-(--text-primary)/50">
                        {rowLabel}
                      </span>

                      <div className="grid grid-flow-col auto-cols-[40px] gap-3 sm:auto-cols-[52px] sm:gap-3.5">
                        {rows[rowLabel]
                          .sort(
                            (a, b) =>
                              Number(a.seat.seatNumber) -
                              Number(b.seat.seatNumber)
                          )
                          .map((item) => {
                            const isSelected = selectedIds.has(item.id);
                            const isAvailable = item.status === 'AVAILABLE';
                            const isDisabled = item.status === 'DISABLED';
                            const isBooked = item.status === 'BOOKED';
                            const isClickable =
                              mode === 'booking' && isAvailable;
                            const seatColor =
                              item.ticketType?.color || '#8b5cf6';

                            return (
                              <button
                                key={item.id}
                                type="button"
                                disabled={!isClickable}
                                title={`${rowLabel}${item.seat.seatNumber} - ${item.status}`}
                                onClick={() => handleToggleSeat(item)}
                                className={cn(
                                  'relative flex size-10 shrink-0 items-center justify-center rounded-xl border text-xs font-semibold transition-all duration-200 sm:size-[50px]',
                                  'border-(--text-primary)/10 text-(--text-primary) shadow-sm',
                                  isClickable &&
                                    'cursor-pointer hover:-translate-y-0.5 hover:shadow-lg active:scale-95',
                                  !isClickable && 'cursor-default',
                                  LOCKED_STATUSES.includes(item.status) &&
                                    'cursor-not-allowed border-(--text-primary)/5 bg-(--text-primary)/10 text-(--text-primary)/35 opacity-60',
                                  isSelected &&
                                    'scale-105 ring-2 ring-purple-500 ring-offset-2 ring-offset-(--surface-color) shadow-[0_0_24px_rgba(168,85,247,0.45)]',
                                  isDisabled &&
                                    'after:absolute after:inset-1 after:rounded-lg after:bg-[repeating-linear-gradient(135deg,transparent_0,transparent_4px,rgba(255,255,255,0.18)_4px,rgba(255,255,255,0.18)_6px)]'
                                )}
                                style={
                                  isAvailable
                                    ? {
                                        backgroundColor: seatColor,
                                        color: '#11111a',
                                      }
                                    : undefined
                                }
                              >
                                {isBooked ? (
                                  <Lock className="size-3.5" />
                                ) : (
                                  item.seat.seatNumber
                                )}
                              </button>
                            );
                          })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex min-h-52 items-center justify-center rounded-2xl border border-dashed border-(--text-primary)/10 bg-(--background-color)/30 text-sm text-(--text-primary)/45">
              No seat map available for this event.
            </div>
          )}
        </div>

        {showLegend && (
          <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm text-(--text-primary)/65">
            {ticketTypes.map((ticketType) => (
              <div
                key={ticketType.id}
                className="flex items-center gap-2 rounded-full border border-(--text-primary)/10 bg-(--background-color)/40 px-3 py-2"
              >
                <span
                  className="size-3 rounded-full"
                  style={{ backgroundColor: ticketType.color || '#8b5cf6' }}
                />
                <span>{ticketType.name}</span>
                {ticketType.price ? (
                  <span className="text-(--text-primary)/40">
                    {ticketType.price.toLocaleString('de-DE')} ₫
                  </span>
                ) : null}
              </div>
            ))}

            <div className="flex items-center gap-2 rounded-full border border-(--text-primary)/10 bg-(--background-color)/40 px-3 py-2">
              <span className="flex size-4 items-center justify-center rounded bg-(--text-primary)/10 text-(--text-primary)/50">
                <Lock className="size-2.5" />
              </span>
              <span>Booked</span>
            </div>

            <div className="flex items-center gap-2 rounded-full border border-(--text-primary)/10 bg-(--background-color)/40 px-3 py-2">
              <span className="size-4 rounded bg-[repeating-linear-gradient(135deg,rgba(120,120,130,0.28)_0,rgba(120,120,130,0.28)_4px,rgba(120,120,130,0.65)_4px,rgba(120,120,130,0.65)_6px)]" />
              <span>Disabled</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default PublicSeatMap;
