const dateFormatter = new Intl.DateTimeFormat('vi-VN', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

export function formatCreatedAt(date) {
  if (!date) return '—';
  return dateFormatter.format(new Date(date));
}
