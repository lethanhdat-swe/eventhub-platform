import { parseApiError } from '@/lib/http/apiError';

function normalizeMessage(message) {
  return String(message || '')
    .trim()
    .toLowerCase();
}

export function mapRegisterError(error) {
  const parsed = parseApiError(error);

  const status = parsed.status;
  const rawMessage = parsed.message || '';
  const msg = normalizeMessage(rawMessage);

  if (status === 400 || status === 409) {
    if (
      msg.includes('email already exists') ||
      msg.includes('email already used') ||
      msg.includes('email is already taken') ||
      msg.includes('email exists')
    ) {
      return 'Email đã được sử dụng. Vui lòng đăng nhập hoặc dùng email khác.';
    }

    if (msg.includes('phone number already exists')) {
      return 'Số điện thoại đã được sử dụng.';
    }

    return 'Thông tin đăng ký không hợp lệ. Vui lòng kiểm tra lại.';
  }

  if (status >= 500) {
    return 'Hệ thống đang gặp sự cố. Vui lòng thử lại sau.';
  }

  return rawMessage || 'Đăng ký thất bại.';
}