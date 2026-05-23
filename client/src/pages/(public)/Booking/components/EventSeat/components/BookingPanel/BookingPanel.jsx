import { X } from 'lucide-react';

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
    <div className="space-y-3">

      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <p className="text-(--text-primary) font-semibold uppercase tracking-wider text-sm">
          Ghế đã chọn ({selectedSeats.length})
        </p>
        {selectedSeats.length > 0 && (
          <button
            onClick={onClear}
            className="rounded-full px-3 py-1.5 text-xs font-semibold text-pink-500 transition-colors hover:bg-pink-500/10 hover:text-pink-400"
          >
            Xóa tất cả
          </button>
        )}
      </div>

      {/* Seat list */}
      {selectedSeats.length === 0 ? (
        <p className="text-(--text-primary)/40 text-sm py-4 text-center">
          Chưa chọn ghế nào
        </p>
      ) : (
        <div className="space-y-2.5">
          {selectedSeats.map((seat) => (
            <div
              key={seat.id}
              className="flex items-center justify-between gap-4 rounded-xl border border-(--text-primary)/10 bg-(--background-color) px-4 py-3 transition-colors hover:border-(--primary-color)/45"
            >
              <div className="flex min-w-0 flex-col gap-1">
                <span className="text-sm font-semibold" style={{ color: "var(--primary-color)" }}>
                  {seat.ticketType?.name ?? 'Ticket'}
                </span>
                <span className="text-(--text-primary) text-xl font-bold leading-none">
                  {getSeatLabel(seat)}
                </span>
              </div>

              <div className="flex shrink-0 items-center gap-3">
                <span className="text-(--text-primary) text-sm font-semibold">
                  {formatCurrency(seat.ticketType?.price)}
                </span>
                <button
                  type="button"
                  onClick={() => onRemove(seat.id)}
                  aria-label={`Xóa ghế ${getSeatLabel(seat)}`}
                  className="flex size-7 items-center justify-center rounded-full text-(--text-primary)/45 transition-colors hover:bg-red-500/10 hover:text-red-500"
                >
                  <X className="size-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Total */}
      {selectedSeats.length > 0 && (
        <div className="mt-3 rounded-xl border border-(--primary-color)/25 bg-(--background-color) px-4 py-4">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-(--text-primary)/55">
            Tổng tiền ({selectedSeats.length} vé)
          </p>
          <p className="text-3xl font-bold leading-tight" style={{ color: "var(--primary-color)" }}>
            {formatCurrency(total)}
          </p>
        </div>
      )}

    </div>
  );
}

export default BookingPanel;