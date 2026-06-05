import { parseApiError } from '@/lib/http/apiError';

export function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function mapForgotPasswordError(error) {
  const { message } = parseApiError(error);
  const msg = (message || '').trim();

  if (msg === 'Email not found') {
    return 'Không tìm thấy email trong hệ thống.';
  }

  return msg || 'Không gửi được liên kết. Vui lòng thử lại.';
}