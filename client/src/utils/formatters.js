const vndPriceFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0,
});

const dateOnlyFormatter = new Intl.DateTimeFormat('vi-VN', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

const dateTimeFormatter = new Intl.DateTimeFormat('vi-VN', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

const timeFormatter = new Intl.DateTimeFormat('vi-VN', {
  hour: '2-digit',
  minute: '2-digit',
});

/**
 * Admin price format: null/undefined → '—', Intl currency style.
 * @param {number|null|undefined} price
 * @returns {string}
 */
export function formatPriceVnd(price) {
  if (price == null) return '—';
  return vndPriceFormatter.format(price);
}

/**
 * Intl currency style (same as formatPriceVnd but accepts 0 explicitly).
 * null/undefined → '—'.
 * @param {number|null|undefined} value
 * @returns {string}
 */
export function formatMoney(value) {
  if (value == null) return '—';
  return vndPriceFormatter.format(Number(value || 0));
}

/**
 * Public suffix-based VND amount format.
 * @param {number|null|undefined} value
 * @param {{ suffix?: string, nullDisplay?: string }} [options]
 * @returns {string}
 */
export function formatVndAmount(value, options = {}) {
  const { suffix = ' ₫', nullDisplay } = options;

  if (value == null && nullDisplay !== undefined) {
    return nullDisplay;
  }

  return Number(value || 0).toLocaleString('vi-VN') + suffix;
}

/**
 * Intl currency style without null guard (Refunds admin).
 * @param {number|null|undefined} value
 * @returns {string}
 */
export function formatCurrencyIntl(value) {
  return vndPriceFormatter.format(Number(value || 0));
}

/**
 * @param {string|Date|null|undefined} value
 * @param {{ emptyText?: string, layout?: 'default' | 'time-first' }} [options]
 * @returns {string}
 */
export function formatDateTime(value, options = {}) {
  const { emptyText = '—', layout = 'default' } = options;

  if (!value) return emptyText;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return emptyText;

  if (layout === 'time-first') {
    const time = timeFormatter.format(date);
    const day = dateOnlyFormatter.format(date);
    return `${time} ${day}`;
  }

  return dateTimeFormatter.format(date);
}

/**
 * @param {string|Date|null|undefined} value
 * @param {{ emptyText?: string }} [options]
 * @returns {string}
 */
export function formatDateOnly(value, options = {}) {
  const { emptyText = '—' } = options;

  if (!value) return emptyText;

  return dateOnlyFormatter.format(new Date(value));
}

/**
 * @param {string|Date|null|undefined} startDate
 * @param {string|Date|null|undefined} endDate
 * @param {{
 *   emptyText?: string,
 *   separator?: string,
 *   sameDayMode?: 'formatted' | 'dateString',
 * }} [options]
 * @returns {string}
 */
export function formatDateRange(startDate, endDate, options = {}) {
  const {
    emptyText = 'Chưa cập nhật thời gian',
    separator = ' - ',
    sameDayMode = 'formatted',
  } = options;

  if (!startDate) return emptyText;

  if (sameDayMode === 'dateString') {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : null;

    if (!end || start.toDateString() === end.toDateString()) {
      return dateOnlyFormatter.format(start);
    }

    return `${dateOnlyFormatter.format(start)}${separator}${dateOnlyFormatter.format(end)}`;
  }

  const start = dateOnlyFormatter.format(new Date(startDate));
  if (!endDate) return start;

  const end = dateOnlyFormatter.format(new Date(endDate));
  return start === end ? start : `${start}${separator}${end}`;
}

/**
 * Booking flow time range (empty string when no startDate).
 * @param {string|Date|null|undefined} startDate
 * @param {string|Date|null|undefined} endDate
 * @returns {string}
 */
export function formatTimeRange(startDate, endDate) {
  if (!startDate) return '';

  const start = timeFormatter.format(new Date(startDate));
  const end = endDate ? timeFormatter.format(new Date(endDate)) : null;

  return end ? `${start} - ${end}` : start;
}

/**
 * Admin Events date range (en dash separator, '—' empty).
 * @param {string|Date|null|undefined} startDate
 * @param {string|Date|null|undefined} endDate
 * @returns {string}
 */
export function formatEventDateRange(startDate, endDate) {
  if (!startDate && !endDate) return '—';

  const start = startDate ? dateOnlyFormatter.format(new Date(startDate)) : null;
  const end = endDate ? dateOnlyFormatter.format(new Date(endDate)) : null;

  if (start && end && start !== end) {
    return `${start} – ${end}`;
  }

  return start || end || '—';
}

/**
 * Event check-in page event date with validation messages.
 * @param {string|Date|null|undefined} startDate
 * @param {string|Date|null|undefined} endDate
 * @returns {string}
 */
export function formatEventDate(startDate, endDate) {
  if (!startDate) return 'Chưa cập nhật thời gian';

  const startDateObj = new Date(startDate);

  if (Number.isNaN(startDateObj.getTime())) {
    return 'Thời gian không hợp lệ';
  }

  const start = dateOnlyFormatter.format(startDateObj);

  if (!endDate) return start;

  const endDateObj = new Date(endDate);

  if (Number.isNaN(endDateObj.getTime())) return start;

  const end = dateOnlyFormatter.format(endDateObj);

  return start === end ? start : `${start} - ${end}`;
}

/**
 * Admin datetime format (Orders, PaymentTransactions).
 * @param {string|Date|null|undefined} date
 * @returns {string}
 */
export function formatCreatedAt(date) {
  return formatDateTime(date);
}

export { dateOnlyFormatter, dateTimeFormatter, vndPriceFormatter as moneyFormatter };
