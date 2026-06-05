export function isEventEnded(event) {
  if (!event) return false;

  const now = new Date();
  const end = event.endDate ? new Date(event.endDate) : null;
  const start = event.startDate ? new Date(event.startDate) : null;

  if (end) return end < now;
  if (start) return start < now;

  return false;
}
