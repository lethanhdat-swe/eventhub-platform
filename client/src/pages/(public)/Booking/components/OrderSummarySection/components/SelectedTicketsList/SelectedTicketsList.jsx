function formatCurrency(value) {
  return Number(value || 0).toLocaleString('vi-VN') + ' ₫';
}

function getSeatLabel(seat) {
  return `${seat.seat?.rowLabel ?? ''}${seat.seat?.seatNumber ?? ''}`;
}

function SelectedTicketsList({ selectedSeats = [] }) {
  const total = selectedSeats.reduce(
    (sum, seat) => sum + Number(seat.ticketType?.price ?? 0),
    0
  );

  return (
    <div className="rounded-xl border border-(--text-primary)/10 bg-white/2.5 p-4">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          <p className="text-sm font-semibold text-(--text-primary)">
            Chi tiết vé
          </p>

          <p className="mt-1 text-xs text-(--text-primary)/45">
            {selectedSeats.length} vé đã chọn
          </p>
        </div>

        <span className="rounded-full border border-(--primary-color)/25 bg-(--primary-color)/10 px-3 py-1 text-xs font-bold text-(--primary-color)">
          {selectedSeats.length} vé
        </span>
      </div>

      <div className="space-y-2">
        {selectedSeats.length === 0 ? (
          <div className="rounded-xl border border-dashed border-(--text-primary)/15 bg-black/10 px-4 py-5 text-center">
            <p className="text-sm text-(--text-primary)/45">Chưa chọn vé</p>
          </div>
        ) : (
          selectedSeats.map((seat) => {
            const ticketName = seat.ticketType?.name ?? 'Vé';
            const ticketColor =
              seat.ticketType?.color || 'var(--primary-color)';
            const seatLabel = getSeatLabel(seat);
            const price = seat.ticketType?.price;

            return (
              <div
                key={seat.id}
                className="
                  group relative overflow-hidden rounded-xl border
                  border-(--text-primary)/10 bg-black/20 px-4 py-3
                  transition hover:border-(--primary-color)/30 hover:bg-(--primary-color)/5
                "
              >
                <div
                  className="absolute inset-y-0 left-0 w-1 pointer-events-none"
                  style={{ backgroundColor: ticketColor }}
                />

                <div className="flex items-center justify-between gap-4 pl-2">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className="rounded-md border px-2 py-0.5 text-xs font-black uppercase"
                        style={{
                          color: ticketColor,
                          borderColor: `color-mix(in srgb, ${ticketColor} 55%, transparent)`,
                          backgroundColor: `color-mix(in srgb, ${ticketColor} 16%, transparent)`,
                        }}
                      >
                        {ticketName}
                      </span>

                      <span className="text-sm font-bold text-(--text-primary)">
                        {seatLabel}
                      </span>
                    </div>

                    <p className="mt-1 text-xs text-(--text-primary)/45">
                      Ghế {seatLabel}
                    </p>
                  </div>

                  <p className="shrink-0 text-sm font-semibold text-(--text-primary)">
                    {formatCurrency(price)}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="mt-4 border-t border-(--text-primary)/10 pt-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-(--text-primary)">
              Tổng cộng
            </p>

            <p className="mt-1 text-xs text-(--text-primary)/45">
              Đã bao gồm tổng giá vé đã chọn
            </p>
          </div>

          <p className="shrink-0 text-lg font-black text-(--primary-color) md:text-xl">
            {formatCurrency(total)}
          </p>
        </div>
      </div>
    </div>
  );
}

export default SelectedTicketsList;
