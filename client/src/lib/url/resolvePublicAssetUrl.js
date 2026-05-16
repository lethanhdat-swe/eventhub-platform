/**
 * Chuẩn hóa URL ảnh tĩnh (/uploads/...) khi FE chạy domain/port khác API.
 * @param {string | null | undefined} urlOrPath
 * @returns {string}
 */
export function resolvePublicAssetUrl(urlOrPath) {
  if (urlOrPath == null || urlOrPath === '') return '';
  if (/^https?:\/\//i.test(urlOrPath)) return urlOrPath;
  const base = import.meta.env.VITE_API_URL ?? '';
  const origin = base.replace(/\/api\/?$/i, '');
  const path = urlOrPath.startsWith('/') ? urlOrPath : `/${urlOrPath}`;
  if (!origin) return path;
  return `${origin.replace(/\/$/, '')}${path}`;
}
