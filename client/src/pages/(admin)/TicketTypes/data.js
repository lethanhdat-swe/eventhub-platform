const priceFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0,
});

export function formatPriceVnd(price) {
  if (price == null) return '—';
  return priceFormatter.format(price);
}

export function mapTicketTypeRow(row) {
  return {
    id: row.id,
    name: row.name,
    price: row.price,
    defaultSeatCount: row.defaultSeatCount ?? 0,
    eventSeatCount: row.eventSeatCount ?? 0,
  };
}
