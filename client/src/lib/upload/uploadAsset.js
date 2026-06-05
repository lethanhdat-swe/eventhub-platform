import { resolvePublicAssetUrl } from '@/lib/url/resolvePublicAssetUrl';

/**
 * Chuẩn hóa giá trị lưu DB (filename, `/uploads/...`, hoặc URL cũ) → filename.
 * @param {string | null | undefined} stored
 * @returns {string}
 */
export function normalizeStoredUploadFilename(stored) {
  if (stored == null || stored === '') return '';
  const value = String(stored).trim();
  if (!value) return '';

  if (value.startsWith('/uploads/')) {
    return value.slice('/uploads/'.length);
  }

  if (/^https?:\/\//i.test(value)) {
    try {
      const pathname = new URL(value).pathname;
      if (pathname.startsWith('/uploads/')) {
        return pathname.slice('/uploads/'.length);
      }
    } catch {
      /* ignore */
    }
  }

  return value;
}

/**
 * URL hiển thị preview từ filename / path / URL đầy đủ.
 * @param {string | null | undefined} stored
 * @returns {string}
 */
/** @deprecated Dùng resolvePublicAssetUrl trực tiếp khi render ảnh. */
export function getUploadPreviewSrc(stored) {
  if (stored == null || String(stored).trim() === '') return '';
  return resolvePublicAssetUrl(stored, '');
}
