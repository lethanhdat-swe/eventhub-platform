/**
 * Lấy `data` từ body backend sau interceptor (đã unwrap một tầng).
 * @param {{ message?: string, data?: unknown }} body
 * @param {{ allowEmptyData?: boolean }} options
 */
export function getApiData(body, options = {}) {
  const { allowEmptyData = false } = options;

  if (body.data === undefined || body.data === null) {
    if (allowEmptyData) {
      return body.data ?? null;
    }

    throw new Error(body.message || 'Thiếu dữ liệu phản hồi');
  }

  return body.data;
}
