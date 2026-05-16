const dateTimeFormatter = new Intl.DateTimeFormat('vi-VN', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

export function formatCheckedInAt(date) {
  if (!date) return '—';
  return dateTimeFormatter.format(new Date(date));
}

export function formatSeatLabel(seat) {
  if (!seat) return '—';
  const label = [seat.rowLabel, seat.seatNumber]
    .filter((v) => v != null && v !== '')
    .join('');
  return label || '—';
}

export function mapTicketRow(row) {
  const seat = row.eventSeat?.seat;
  return {
    id: row.id,
    orderId: row.orderId,
    orderCode: row.order?.orderCode ?? '—',
    eventSeatId: row.eventSeatId,
    qrSecureToken: row.qrSecureToken,
    ticketCode: row.qrSecureToken,
    isCheckedIn: row.isCheckedIn,
    checkedInAt: row.checkedInAt,
    customerName: row.order?.customerName ?? '—',
    customerEmail: row.order?.customerEmail ?? '—',
    eventTitle: row.eventSeat?.event?.title ?? '—',
    eventId: row.eventSeat?.event?.id ?? null,
    seatLabel: formatSeatLabel(seat),
    ticketTypeName: row.eventSeat?.ticketType?.name ?? '—',
  };
}

export function getTicketQrImageUrl(qrSecureToken) {
  if (!qrSecureToken) return null;
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrSecureToken)}`;
}
