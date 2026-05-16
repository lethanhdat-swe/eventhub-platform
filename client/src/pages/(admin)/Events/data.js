import { normalizeStoredUploadFilename } from '@/lib/upload/uploadAsset';

export const EVENT_STATUS_OPTIONS = [
  { value: 'DRAFT', label: 'Bản nháp' },
  { value: 'PUBLISHED', label: 'Đã xuất bản' },
  { value: 'CANCELLED', label: 'Đã hủy' },
];

export const ARTIST_ROLE_LABELS = {
  SINGER: 'Ca sĩ',
  DJ: 'DJ',
  GUEST: 'Khách mời',
  HOST: 'MC / Host',
};

const dateFormatter = new Intl.DateTimeFormat('vi-VN', {
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

export function formatEventDateRange(startDate, endDate) {
  if (!startDate && !endDate) return '—';

  const start = startDate ? dateFormatter.format(new Date(startDate)) : null;
  const end = endDate ? dateFormatter.format(new Date(endDate)) : null;

  if (start && end && start !== end) {
    return `${start} – ${end}`;
  }

  return start || end || '—';
}

export function formatCreatedAt(date) {
  if (!date) return '—';
  return dateFormatter.format(new Date(date));
}

export function formatDateTime(date) {
  if (!date) return '—';
  return dateTimeFormatter.format(new Date(date));
}

export function mapEventRow(row) {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    description: row.description ?? '',
    contentHtml: row.contentHtml ?? '',
    location: row.location ?? '',
    startDate: row.startDate,
    endDate: row.endDate,
    thumbnailUrl: row.thumbnailUrl,
    status: row.status,
    categoryId: row.categoryId ?? row.category?.id ?? null,
    category: row.category ?? null,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    eventArtists: row.eventArtists ?? [],
  };
}

export function mapEventToFormValues(event) {
  return {
    title: event?.title ?? '',
    slug: event?.slug ?? '',
    description: event?.description ?? '',
    contentHtml: event?.contentHtml ?? '',
    location: event?.location ?? '',
    startDate: toDatetimeLocalValue(event?.startDate),
    endDate: toDatetimeLocalValue(event?.endDate),
    thumbnailUrl: normalizeStoredUploadFilename(event?.thumbnailUrl),
    status: event?.status ?? 'DRAFT',
    categoryId: event?.categoryId ?? event?.category?.id ?? '',
  };
}

export function toDatetimeLocalValue(iso) {
  if (!iso) return '';
  const date = new Date(iso);
  const pad = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function datetimeLocalToIso(local) {
  if (!local) return undefined;
  return new Date(local).toISOString();
}

export function buildEventPayload(form) {
  const payload = {
    title: form.title.trim(),
    slug: form.slug.trim(),
    status: form.status || 'DRAFT',
  };

  const description = form.description?.trim();
  if (description) payload.description = description;

  const contentHtml = form.contentHtml?.trim();
  if (contentHtml) payload.contentHtml = contentHtml;

  const location = form.location?.trim();
  if (location) payload.location = location;

  const thumbnailUrl = form.thumbnailUrl?.trim();
  if (thumbnailUrl) payload.thumbnailUrl = thumbnailUrl;

  if (form.categoryId) payload.categoryId = form.categoryId;

  const startDate = datetimeLocalToIso(form.startDate);
  if (startDate) payload.startDate = startDate;

  const endDate = datetimeLocalToIso(form.endDate);
  if (endDate) payload.endDate = endDate;

  return payload;
}
