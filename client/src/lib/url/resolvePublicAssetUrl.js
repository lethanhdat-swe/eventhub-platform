/**
 * Chuẩn hóa URL ảnh tĩnh khi FE chạy domain/port khác API.
 * @param {string | null | undefined} urlOrPath
 * @param {string} fallbackUrl
 * @returns {string}
 */
export function resolvePublicAssetUrl(
  urlOrPath,
  fallbackUrl = '/default-avatar.jpg'
) {
  if (urlOrPath == null || String(urlOrPath).trim() === '') {
    return fallbackUrl;
  }

  const value = String(urlOrPath).trim();

  const embeddedDataUrl = value.match(/(data:image\/[^;\s]+;base64,.+)$/i);
  if (embeddedDataUrl?.[1]) {
    return embeddedDataUrl[1];
  }

  if (/^(data|blob):/i.test(value)) return value;

  const duplicatedExternalUrl = value.match(/https?:\/\/.+?(https?:\/\/.+)$/i);
  if (duplicatedExternalUrl?.[1]) {
    return duplicatedExternalUrl[1];
  }

  if (/^(https?:)?\/\//i.test(value)) return value;

  const base = import.meta.env.VITE_API_URL ?? '';
  const origin = base.replace(/\/api\/?$/i, '');

  const path = value.startsWith('/uploads/')
    ? value
    : `/uploads/${value.replace(/^\/+/, '')}`;

  if (!origin) return path;

  return `${origin.replace(/\/$/, '')}${path}`;
}
