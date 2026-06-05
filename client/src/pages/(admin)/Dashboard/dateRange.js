const dateFormatter = new Intl.DateTimeFormat('vi-VN', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

export const DASHBOARD_DATE_PRESETS = [
  { id: 'today', label: 'Hôm nay' },
  { id: '7d', label: '7 ngày qua' },
  { id: '30d', label: '30 ngày qua' },
  { id: 'month', label: 'Tháng này' },
  { id: 'custom', label: 'Tùy chỉnh' },
];

export const DEFAULT_DASHBOARD_DATE_RANGE = {
  preset: '30d',
  from: toInputDate(addDays(new Date(), -29)),
  to: toInputDate(new Date()),
};

function addDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function toInputDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function parseInputDate(value) {
  if (!value) return null;
  const [year, month, day] = value.split('-').map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
}

export function formatDisplayDate(value) {
  const date = parseInputDate(value);
  if (!date) return '—';
  return dateFormatter.format(date);
}

export function getPresetLabel(presetId) {
  return (
    DASHBOARD_DATE_PRESETS.find((preset) => preset.id === presetId)?.label ??
    'Chọn khoảng thời gian'
  );
}

export function getDateRangeLabel({ preset, from, to }) {
  if (preset !== 'custom') {
    return getPresetLabel(preset);
  }

  if (from && to) {
    return `${formatDisplayDate(from)} – ${formatDisplayDate(to)}`;
  }

  return 'Tùy chỉnh';
}

export function getStatPeriodDescription(statKey, dateRange) {
  const period = getDateRangeLabel(dateRange);

  const descriptions = {
    revenue: `VNĐ · ${period}`,
    tickets: `vé đã bán · ${period}`,
    events: 'đang mở bán vé',
    checkin: `tỷ lệ · ${period}`,
  };

  return descriptions[statKey] ?? period;
}

export function createCustomDateRange(from, to) {
  return { preset: 'custom', from, to };
}

export function createPresetDateRange(presetId) {
  const today = new Date();
  const ranges = {
    today: { from: today, to: today },
    '7d': { from: addDays(today, -6), to: today },
    '30d': { from: addDays(today, -29), to: today },
    month: {
      from: new Date(today.getFullYear(), today.getMonth(), 1),
      to: today,
    },
  };

  const range = ranges[presetId];
  if (!range) {
    return { ...DEFAULT_DASHBOARD_DATE_RANGE };
  }

  return {
    preset: presetId,
    from: toInputDate(range.from),
    to: toInputDate(range.to),
  };
}
