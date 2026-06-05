import { Armchair, Trash2, X } from 'lucide-react';

function formatCurrency(value) {
  return Number(value || 0).toLocaleString('vi-VN') + ' ₫';
}

function getSeatLabel(seat) {
  return `${seat.seat?.rowLabel ?? ''}${seat.seat?.seatNumber ?? ''}`;
}

function BookingPanel({ selectedSeats = [], onRemove, onClear }) {
  const total = selectedSeats.reduce(
    (sum, seat) => sum + Number(seat.ticketType?.price ?? 0),
    0
  );

  return (
    <div className="rounded-xl border border-(--text-primary)/10 bg-(--surface-color) p-4 shadow-xl shadow-black/10">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.14em] text-(--text-primary)">
            Ghế đã chọn
          </p>

          <p className="mt-1 text-xs text-(--text-primary)/45">
            {selectedSeats.length > 0
              ? `${selectedSeats.length} ghế trong đơn`
              : 'Bạn chưa chọn ghế nào'}
          </p>
        </div>

        <span className="rounded-full border border-(--primary-color)/20 bg-(--primary-color)/10 px-2.5 py-0.5 text-xs font-bold text-(--primary-color)">
          {selectedSeats.length}
        </span>
      </div>

      {selectedSeats.length === 0 ? (
        <div className="flex min-h-32.5 flex-col items-center justify-center rounded-xl border border-dashed border-(--text-primary)/10 bg-(--background-color)/35 px-4 py-5 text-center">
          <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-(--primary-color)/10 text-(--primary-color)">
            <Armchair size={18} />
          </div>

          <p className="text-sm font-semibold text-(--text-primary)">
            Chưa chọn ghế
          </p>

          <p className="mt-1 max-w-48 text-xs leading-5 text-(--text-primary)/45">
            Chọn ghế trên sơ đồ để xem tại đây.
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-2">
            {selectedSeats.map((seat) => {
              const seatLabel = getSeatLabel(seat);
              const ticketName = seat.ticketType?.name ?? 'Vé';
              const ticketColor =
                seat.ticketType?.color || 'var(--primary-color)';
              const price = seat.ticketType?.price;

              return (
                <div
                  key={seat.id}
                  className="
                    group relative overflow-hidden rounded-xl border
                    border-(--text-primary)/10 bg-(--background-color)/45
                    px-3 py-2.5 transition-all duration-300
                    hover:border-(--primary-color)/35 hover:bg-(--primary-color)/5
                  "
                >
                  <div
                    className="absolute inset-y-0 left-0 w-1 pointer-events-none"
                    style={{ backgroundColor: ticketColor }}
                  />

                  <div className="flex items-center justify-between gap-3 pl-2">
                    <div className="min-w-0">
                      <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
                        <span
                          className="rounded-full border px-2 py-0.5 text-[10px] font-black uppercase"
                          style={{
                            color: ticketColor,
                            borderColor: `${ticketColor}66`,
                            backgroundColor: `${ticketColor}1f`,
                          }}
                        >
                          {ticketName}
                        </span>

                        <span className="text-[11px] text-(--text-primary)/40">
                          Ghế
                        </span>
                      </div>

                      <p className="text-xl font-black leading-none text-(--text-primary)">
                        {seatLabel}
                      </p>

                      <p className="mt-1.5 text-xs font-semibold text-(--text-primary)/65">
                        {formatCurrency(price)}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => onRemove?.(seat.id)}
                      aria-label={`Xóa ghế ${seatLabel}`}
                      className="
                        flex cursor-pointer size-8 shrink-0 items-center justify-center rounded-full
                        border border-(--text-primary)/10 text-(--text-primary)/45
                        transition-all duration-300
                        hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400
                        active:scale-95
                      "
                    >
                      <X className="size-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-3 rounded-xl border border-(--primary-color)/25 bg-(--primary-color)/8 p-3.5">
            <div className="mb-2.5 flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.14em] text-(--text-primary)/50">
                  Tổng tiền
                </p>

                <p className="mt-0.5 text-xs text-(--text-primary)/45">
                  {selectedSeats.length} vé đã chọn
                </p>
              </div>

              <button
                type="button"
                onClick={onClear}
                className="
                  inline-flex items-center gap-1.5 rounded-full
                  border border-red-500/20 bg-red-500/10 px-2.5 py-1
                  text-xs font-bold text-red-300 transition
                  hover:bg-red-500/15 hover:text-red-200 cursor-pointer
                "
              >
                <Trash2 size={12} />
                Xóa
              </button>
            </div>

            <p className="text-2xl font-black leading-tight text-(--primary-color)">
              {formatCurrency(total)}
            </p>
          </div>
        </>
      )}
    </div>
  );
}

export default BookingPanel;
