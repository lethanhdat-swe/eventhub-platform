export function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function validateLoginForm(email, password) {
  const errors = {
    email: '',
    password: '',
  };

  if (!email.trim()) {
    errors.email = 'Vui lòng nhập email.';
  } else if (!isValidEmail(email)) {
    errors.email = 'Email không hợp lệ.';
  }

  if (!password) {
    errors.password = 'Vui lòng nhập mật khẩu.';
  }

  return errors;
}