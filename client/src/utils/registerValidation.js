function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function validateRegisterForm(form) {
  const errors = {};

  if (!form.fullName.trim()) {
    errors.fullName = 'Vui lòng nhập họ và tên.';
  } else if (form.fullName.trim().length < 2) {
    errors.fullName = 'Họ và tên cần ít nhất 2 ký tự.';
  }

  if (!form.email.trim()) {
    errors.email = 'Vui lòng nhập email.';
  } else if (!isValidEmail(form.email)) {
    errors.email = 'Email không hợp lệ.';
  }

  if (!form.phoneNumber.trim()) {
    errors.phoneNumber = 'Vui lòng nhập số điện thoại.';
  } else if (!/^[0-9]{10,15}$/.test(form.phoneNumber.trim())) {
    errors.phoneNumber = 'Số điện thoại cần từ 10 đến 15 chữ số.';
  }

  if (!form.password) {
    errors.password = 'Vui lòng nhập mật khẩu.';
  } else if (form.password.length < 6) {
    errors.password = 'Mật khẩu cần ít nhất 6 ký tự.';
  }

  if (!form.confirmPassword) {
    errors.confirmPassword = 'Vui lòng xác nhận mật khẩu.';
  } else if (form.password !== form.confirmPassword) {
    errors.confirmPassword = 'Mật khẩu xác nhận không khớp.';
  }

  return errors;
}