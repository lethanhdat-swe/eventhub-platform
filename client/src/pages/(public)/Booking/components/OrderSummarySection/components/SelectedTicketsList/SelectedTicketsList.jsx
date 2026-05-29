function formatCurrency(value) {
    return Number(value || 0).toLocaleString('vi-VN') + ' ₫';
}

function getSeatLabel(seat) {
    return `${seat.seat?.rowLabel ?? ''}${seat.seat?.seatNumber ?? ''}`;
}

function SelectedTicketsList({ selectedSeats = [] }) {
    const total = selectedSeats.reduce(
        (sum, seat) => sum + Number(seat.ticketType?.price ?? 0), 0
    );

    return (
        <div className="p-1">
            <p className="text-(--text-primary)/70 text-sm sm:text-base mb-3">Chi tiết vé</p>

            <div className="flex flex-col gap-2 border-b border-(--text-primary)/20 pb-3 text-xs sm:text-sm">
                {selectedSeats.length === 0 ? (
                    <p className="text-(--text-primary)/45">Chưa chọn vé</p>
                ) : (
                    selectedSeats.map((seat) => (
                        <div key={seat.id} className="text-(--text-primary) flex items-center justify-between gap-3 min-w-0">
                            <p className="uppercase truncate">
                                {seat.ticketType?.name ?? 'Ticket'} - {getSeatLabel(seat)}
                            </p>
                            <p className="shrink-0">{formatCurrency(seat.ticketType?.price)}</p>
                        </div>
                    ))
                )}
            </div>

            <div className="text-(--text-primary) flex items-center justify-between py-3">
                <p className="text-sm uppercase sm:text-base">Tổng cộng</p>
                <p className="text-base sm:text-lg text-(--primary-color)">
                    {formatCurrency(total)}
                </p>
            </div>
        </div>
    );
}

export default SelectedTicketsList;