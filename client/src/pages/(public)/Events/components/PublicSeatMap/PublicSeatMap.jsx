import { Clock3, Lock, Slash } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';

const LOCKED_STATUSES = ['BOOKED', 'RESERVING', 'DISABLED'];

const STATUS_LABELS = {
  AVAILABLE: 'Có thể chọn',
  RESERVING: 'Đang giữ',
  BOOKED: 'Đã đặt',
  DISABLED: 'Vô hiệu hóa',
};

function sortRowLabel(a, b) {
  return a.localeCompare(b, undefined, {
    numeric: true,
    sensitivity: 'base',
  });
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

function formatCurrency(value) {
  return Number(value || 0).toLocaleString('vi-VN') + ' ₫';
}

function getSeatTitle(item) {
  const rowLabel = item?.seat?.rowLabel ?? '';
  const seatNumber = item?.seat?.seatNumber ?? '';
  const ticketName = item?.ticketType?.name ?? 'Vé';
  const statusLabel =
    STATUS_LABELS[item?.status] ?? item?.status ?? 'Không xác định';

  return `${rowLabel}${seatNumber} - ${ticketName} - ${statusLabel}`;
}

function PublicSeatMap({
  seats = [],
  mode = 'preview',
  selectedSeatIds = [],
  onToggleSeat,
  showLegend = true,
  showStage = true,
  helperText,
  className,
}) {
  const selectedIds = new Set(selectedSeatIds);
  const rows = groupSeatsByRow(seats);
  const rowLabels = Object.keys(rows).sort(sortRowLabel);
  const ticketTypes = getTicketTypes(seats);
  const isBookingMode = mode === 'booking';

  const handleToggleSeat = (seat) => {
    const isClickable = isBookingMode && seat.status === 'AVAILABLE';

    if (!isClickable) return;

    onToggleSeat?.(seat);
  };

  return (
    <Card
      className={cn(
        'rounded-xl border border-(--text-primary)/10 bg-(--surface-color) text-(--text-primary) shadow-2xl shadow-black/10 sm:rounded-2xl',
        className
      )}
    >
      <CardHeader className="gap-2 px-4 pt-4 sm:px-6 sm:pt-5">
        <div className="flex items-start justify-between gap-3 sm:gap-4">
          <div>
            <CardTitle className="text-base font-semibold text-(--text-primary) sm:text-xl">
              Sơ đồ ghế
            </CardTitle>

            <CardDescription className="mt-1 text-xs text-(--text-primary)/55 sm:text-sm">
              {isBookingMode
                ? 'Chọn vị trí bạn muốn trong sơ đồ sự kiện bên dưới.'
                : helperText
                  ? 'Xem sơ đồ ghế của sự kiện.'
                  : 'Chọn vị trí bạn muốn trong sơ đồ sự kiện bên dưới.'}
            </CardDescription>

            {helperText ? (
              <p className="mt-2 text-xs text-(--text-primary)/45 sm:text-sm">
                {helperText}
              </p>
            ) : null}
          </div>

          <span className="whitespace-nowrap rounded-full border border-(--primary-color)/20 bg-(--primary-color)/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-(--primary-color) sm:px-3 sm:text-xs">
            {isBookingMode ? 'Đặt vé' : 'Xem trước'}
          </span>
        </div>
      </CardHeader>

      <CardContent className="px-4 pb-4 sm:px-6 sm:pb-5">
        <div className="rounded-xl border border-(--text-primary)/10 bg-(--background-color)/40 p-3 sm:rounded-2xl sm:p-6">
          {rowLabels.length > 0 ? (
            <div className="flex flex-col items-center">
              {showStage && (
                <div className="flex w-full justify-center">
                  <div className="w-full max-w-160 rounded-full border border-fuchsia-300/30 bg-linear-to-r from-fuchsia-500/25 via-violet-500/40 to-cyan-400/25 px-4 py-2 text-center text-[10px] font-bold uppercase tracking-[0.42em] text-white shadow-lg shadow-violet-500/20 sm:min-w-105 sm:w-[76%] sm:px-6 sm:py-3 sm:text-xs">
                    Sân khấu
                  </div>
                </div>
              )}

              <div
                className={cn(
                  'w-full overflow-x-auto p-2',
                  showStage && 'mt-10 sm:mt-20'
                )}
              >
                <div className="mx-auto flex w-fit min-w-max flex-col gap-2.5 px-1 sm:gap-4">
                  {rowLabels.map((rowLabel) => (
                    <div
                      key={rowLabel}
                      className="grid grid-cols-[18px_1fr] items-center gap-2.5 sm:grid-cols-[24px_1fr] sm:gap-4"
                    >
                      <span className="text-center text-[10px] font-semibold text-(--text-primary)/50 sm:text-sm">
                        {rowLabel}
                      </span>

                      <div className="grid grid-flow-col auto-cols-[32px] gap-2 sm:auto-cols-[52px] sm:gap-3.5">
                        {rows[rowLabel]
                          .sort(
                            (a, b) =>
                              Number(a.seat.seatNumber) -
                              Number(b.seat.seatNumber)
                          )
                          .map((item) => {
                            const isSelected = selectedIds.has(item.id);
                            const isAvailable = item.status === 'AVAILABLE';
                            const isBooked = item.status === 'BOOKED';
                            const isReserving = item.status === 'RESERVING';
                            const isDisabled = item.status === 'DISABLED';
                            const isLocked = LOCKED_STATUSES.includes(
                              item.status
                            );
                            const isClickable = isBookingMode && isAvailable;
                            const seatColor =
                              item.ticketType?.color || '#8b5cf6';

                            return (
                              <button
                                key={item.id}
                                type="button"
                                disabled={!isClickable}
                                title={getSeatTitle(item)}
                                onClick={() => handleToggleSeat(item)}
                                className={cn(
                                  'relative flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-lg border text-[9px] font-semibold transition-all duration-200 sm:size-12.5 sm:rounded-xl sm:text-xs',
                                  'shadow-sm',

                                  isAvailable &&
                                    'border-transparent text-[#11111a]',

                                  isClickable &&
                                    'cursor-pointer hover:-translate-y-0.5 hover:shadow-lg active:scale-95',

                                  !isClickable && 'cursor-default',

                                  isBooked &&
                                    'cursor-not-allowed border-red-400/25 bg-red-500/10 text-red-200 opacity-95',

                                  isReserving &&
                                    'cursor-not-allowed border-orange-400/30 bg-orange-500/10 text-orange-200 opacity-95',

                                  isDisabled &&
                                    'cursor-not-allowed border-(--text-primary)/10 bg-(--text-primary)/8 text-(--text-primary)/25 opacity-75',

                                  isDisabled &&
                                    'after:absolute after:inset-1 after:rounded-md after:bg-[repeating-linear-gradient(135deg,transparent_0,transparent_4px,rgba(255,255,255,0.24)_4px,rgba(255,255,255,0.24)_6px)] sm:after:rounded-lg',

                                  isSelected &&
                                    'scale-105 ring-2 ring-purple-500 ring-offset-2 ring-offset-(--surface-color) shadow-[0_0_24px_rgba(168,85,247,0.45)]',

                                  isLocked && 'hover:translate-y-0'
                                )}
                                style={
                                  isAvailable
                                    ? {
                                        backgroundColor: seatColor,
                                      }
                                    : undefined
                                }
                              >
                                {isBooked ? (
                                  <Lock className="size-2.5 sm:size-3.5" />
                                ) : isReserving ? (
                                  <Clock3 className="size-2.5 sm:size-3.5" />
                                ) : isDisabled ? (
                                  <Slash className="relative z-10 size-2.5 sm:size-3.5" />
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
            <div className="flex min-h-40 items-center justify-center rounded-xl border border-dashed border-(--text-primary)/10 bg-(--background-color)/30 text-xs text-(--text-primary)/45 sm:min-h-52 sm:rounded-2xl sm:text-sm">
              Chưa có sơ đồ ghế cho sự kiện này.
            </div>
          )}
        </div>

        {showLegend && (
          <div className="mt-4 flex flex-wrap justify-center gap-2 text-xs text-(--text-primary)/65 sm:mt-6 sm:gap-3 sm:text-sm">
            {ticketTypes.map((ticketType) => (
              <div
                key={ticketType.id}
                className="flex items-center gap-1.5 rounded-full border border-(--text-primary)/10 bg-(--background-color)/40 px-2.5 py-1.5 sm:gap-2 sm:px-3 sm:py-2"
              >
                <span
                  className="size-2.5 shrink-0 rounded-full sm:size-3"
                  style={{ backgroundColor: ticketType.color || '#8b5cf6' }}
                />

                <span>{ticketType.name}</span>

                {ticketType.price ? (
                  <span className="text-(--text-primary)/40">
                    {formatCurrency(ticketType.price)}
                  </span>
                ) : null}
              </div>
            ))}

            {isBookingMode ? (
              <div className="flex items-center gap-1.5 rounded-full border border-purple-400/20 bg-purple-500/10 px-2.5 py-1.5 text-purple-200 sm:gap-2 sm:px-3 sm:py-2">
                <span className="size-3 rounded bg-purple-500 shadow-[0_0_12px_rgba(168,85,247,0.55)] sm:size-3.5" />
                <span>Đang chọn</span>
              </div>
            ) : null}

            <div className="flex items-center gap-1.5 rounded-full border border-red-400/20 bg-red-500/10 px-2.5 py-1.5 text-red-200 sm:gap-2 sm:px-3 sm:py-2">
              <span className="flex size-3.5 items-center justify-center rounded bg-red-500/20 text-red-200 sm:size-4">
                <Lock className="size-2 sm:size-2.5" />
              </span>
              <span>Đã đặt</span>
            </div>

            <div className="flex items-center gap-1.5 rounded-full border border-orange-400/20 bg-orange-500/10 px-2.5 py-1.5 text-orange-200 sm:gap-2 sm:px-3 sm:py-2">
              <span className="flex size-3.5 items-center justify-center rounded bg-orange-500/20 text-orange-200 sm:size-4">
                <Clock3 className="size-2 sm:size-2.5" />
              </span>
              <span>Đang giữ</span>
            </div>

            <div className="flex items-center gap-1.5 rounded-full border border-(--text-primary)/10 bg-(--background-color)/40 px-2.5 py-1.5 sm:gap-2 sm:px-3 sm:py-2">
              <span className="flex size-3.5 items-center justify-center rounded bg-[repeating-linear-gradient(135deg,rgba(120,120,130,0.28)_0,rgba(120,120,130,0.28)_4px,rgba(120,120,130,0.65)_4px,rgba(120,120,130,0.65)_6px)] text-(--text-primary)/50 sm:size-4">
                <Slash className="size-2 sm:size-2.5" />
              </span>
              <span>Vô hiệu hóa</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default PublicSeatMap;
