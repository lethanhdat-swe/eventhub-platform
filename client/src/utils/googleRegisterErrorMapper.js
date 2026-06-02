import { parseApiError } from '@/lib/http/apiError';

function normalizeMessage(message) {
  return String(message || '')
    .trim()
    .toLowerCase();
}

export function mapGoogleRegisterError(error) {
  const code = error?.code || '';

  if (code === 'auth/popup-closed-by-user') {
    return 'Bạn đã đóng cửa sổ đăng nhập Google.';
  }

  if (code === 'auth/cancelled-popup-request') {
    return 'Yêu cầu đăng nhập Google đã bị hủy.';
  }

  if (code === 'auth/popup-blocked') {
    return 'Trình duyệt đã chặn popup Google.';
  }

  if (code === 'auth/network-request-failed') {
    return 'Không thể kết nối tới Google.';
  }

  const parsed = parseApiError(error);

  const status = parsed.status;
  const rawMessage = parsed.message || '';
  const msg = normalizeMessage(rawMessage);

  if (status >= 500) {
    return 'Hệ thống đang gặp sự cố. Vui lòng thử lại sau.';
  }

  if (msg.includes('google account mismatch')) {
    return 'Tài khoản Google không khớp.';
  }

  return rawMessage || 'Đăng ký bằng Google thất bại.';
}