const displayFormatter = new Intl.DateTimeFormat('vi-VN', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

const monthFormatter = new Intl.DateTimeFormat('vi-VN', {
  month: 'long',
  year: 'numeric',
});

export const WEEKDAY_LABELS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

export function parseInputDate(value) {
  if (!value) return null;

  const [year, month, day] = value.split('-').map(Number);
  if (!year || !month || !day) return null;

  return new Date(year, month - 1, day);
}

export function toInputDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function formatDisplayDate(value) {
  const date = parseInputDate(value);
  if (!date) return '';

  return displayFormatter.format(date);
}

export function formatMonthYear(year, month) {
  return monthFormatter.format(new Date(year, month, 1));
}

export function getCalendarDays(year, month) {
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startOffset = firstDay.getDay();
  const days = [];

  for (let index = 0; index < startOffset; index += 1) {
    days.push(null);
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    days.push(day);
  }

  return days;
}

export function isDateDisabled(value, { min, max } = {}) {
  if (!value) return true;
  if (min && value < min) return true;
  if (max && value > max) return true;

  return false;
}
