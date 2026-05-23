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
    <div className="p-1">
      <p className="text-(--text-primary)/70 text-base mb-3">Chi tiết vé</p>

      <div className="flex flex-col gap-2 border-b border-(--text-primary)/20 pb-3 text-sm">
        {selectedSeats.length === 0 ? (
          <p className="text-(--text-primary)/45">Chưa chọn vé</p>
        ) : (
          selectedSeats.map((seat) => (
            <div
              key={seat.id}
              className="text-(--text-primary) flex items-center justify-between"
            >
              <p className="uppercase">
                {seat.ticketType?.name ?? 'Ticket'} - {getSeatLabel(seat)}
              </p>
              <p>{formatCurrency(seat.ticketType?.price)}</p>
            </div>
          ))
        )}
      </div>

      <div className="text-(--text-primary) flex items-center justify-between py-3">
        <p className="uppercase">Tổng cộng</p>
        <p className="text-lg text-(--primary-color)">
          {formatCurrency(total)}
        </p>
      </div>
    </div>
  );
}

export default SelectedTicketsList;
