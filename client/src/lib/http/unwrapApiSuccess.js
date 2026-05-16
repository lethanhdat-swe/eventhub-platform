/**
 * Lấy `data` từ body backend sau interceptor (đã unwrap một tầng).
 * @param {{ message?: string, data?: unknown }} body
 */
export function getApiData(body) {
  if (body.data === undefined || body.data === null) {
    throw new Error(body.message || 'Thiếu dữ liệu phản hồi');
  }
  return body.data;
}
