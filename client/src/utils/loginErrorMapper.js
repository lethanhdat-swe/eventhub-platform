import { parseApiError } from '@/lib/http/apiError';

function normalizeMessage(message) {
  return String(message || '')
    .trim()
    .toLowerCase();
}

export function mapLoginApiError(error) {
  const parsed = parseApiError(error);

  const status = parsed.status;
  const rawMessage = parsed.message || '';
  const msg = normalizeMessage(rawMessage);

  if (status === 400) {
    if (msg.includes('email') && msg.includes('required')) {
      return 'Vui lòng nhập email.';
    }

    if (msg.includes('password') && msg.includes('required')) {
      return 'Vui lòng nhập mật khẩu.';
    }

    if (msg.includes('does not support password login')) {
      return 'Tài khoản này không hỗ trợ đăng nhập bằng mật khẩu. Vui lòng đăng nhập bằng Google.';
    }

    return 'Thông tin đăng nhập không hợp lệ. Vui lòng kiểm tra lại.';
  }

  if (status === 401) {
    if (msg.includes('invalid email or password')) {
      return 'Email hoặc mật khẩu không đúng.';
    }

    if (msg.includes('invalid password')) {
      return 'Mật khẩu không đúng.';
    }

    if (
      msg.includes('user not found') ||
      msg.includes('account not found')
    ) {
      return 'Tài khoản không tồn tại.';
    }

    return 'Email hoặc mật khẩu không đúng.';
  }

  if (status === 403) {
    if (
      msg.includes('verify your email') ||
      msg.includes('email is not verified') ||
      msg.includes('email not verified')
    ) {
      return 'Vui lòng xác thực email trước khi đăng nhập. Kiểm tra hộp thư và bấm liên kết kích hoạt tài khoản.';
    }

    if (
      msg.includes('blocked') ||
      msg.includes('disabled')
    ) {
      return 'Tài khoản của bạn đang bị khóa hoặc không còn hoạt động.';
    }

    return 'Bạn không có quyền đăng nhập vào hệ thống.';
  }

  if (status === 404) {
    return 'Tài khoản không tồn tại.';
  }

  if (status >= 500) {
    return 'Hệ thống đang gặp sự cố. Vui lòng thử lại sau.';
  }

  return rawMessage || 'Đăng nhập thất bại. Vui lòng thử lại.';
}

export function mapGoogleLoginError(error) {
  const code = error?.code || '';

  if (code === 'auth/popup-closed-by-user') {
    return 'Bạn đã đóng cửa sổ đăng nhập Google.';
  }

  if (code === 'auth/cancelled-popup-request') {
    return 'Yêu cầu đăng nhập Google đã bị hủy.';
  }

  if (code === 'auth/popup-blocked') {
    return 'Trình duyệt đã chặn cửa sổ đăng nhập Google. Vui lòng cho phép popup và thử lại.';
  }

  if (code === 'auth/network-request-failed') {
    return 'Không thể kết nối tới Google. Vui lòng kiểm tra mạng và thử lại.';
  }

  const parsed = parseApiError(error);

  const status = parsed.status;
  const rawMessage = parsed.message || '';
  const msg = normalizeMessage(rawMessage);

  if (status === 400) {
    if (msg.includes('id token')) {
      return 'Phiên đăng nhập Google không hợp lệ. Vui lòng thử lại.';
    }

    return 'Đăng nhập Google không hợp lệ. Vui lòng thử lại.';
  }

  if (status === 401) {
    return 'Không thể xác thực tài khoản Google. Vui lòng thử lại.';
  }

  if (status === 403) {
    if (msg.includes('mismatch')) {
      return 'Tài khoản Google không khớp với tài khoản đã liên kết.';
    }

    if (
      msg.includes('blocked') ||
      msg.includes('disabled')
    ) {
      return 'Tài khoản của bạn đang bị khóa hoặc không còn hoạt động.';
    }

    return 'Bạn không có quyền đăng nhập bằng Google.';
  }

  if (status >= 500) {
    return 'Hệ thống đang gặp sự cố. Vui lòng thử lại sau.';
  }

  if (msg.includes('google account mismatch')) {
    return 'Tài khoản Google không khớp với tài khoản đã liên kết.';
  }

  return rawMessage || 'Đăng nhập Google thất bại. Vui lòng thử lại.';
}