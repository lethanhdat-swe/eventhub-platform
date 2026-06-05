const priceFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0,
});

export function formatPriceVnd(price) {
  if (price == null) return '—';
  return priceFormatter.format(price);
}
