export const COUPON_STATUS_OPTIONS = [
  { value: 'ACTIVE', label: 'Đang hoạt động' },
  { value: 'INACTIVE', label: 'Tạm dừng' },
];

const dateFormatter = new Intl.DateTimeFormat('vi-VN', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

export function formatValidUntil(date) {
  if (!date) return 'Không giới hạn';
  return dateFormatter.format(new Date(date));
}

export function formatDiscount(percent) {
  if (percent == null) return '—';
  return `${percent}%`;
}

export function mapCouponRow(row) {
  return {
    id: row.id,
    code: row.code,
    description: row.description ?? '',
    discountPercent: row.discountPercent,
    usageLimit: row.usageLimit,
    validUntil: row.validUntil,
    status: row.status,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export function toDatetimeLocalValue(iso) {
  if (!iso) return '';
  const date = new Date(iso);
  const pad = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function buildCouponPayload({
  code,
  description,
  discountPercent,
  usageLimit,
  validUntil,
  status,
}) {
  const payload = {
    code,
    discountPercent,
    status,
  };
  if (description) payload.description = description;
  if (usageLimit != null) payload.usageLimit = usageLimit;
  if (validUntil) payload.validUntil = validUntil;
  return payload;
}
