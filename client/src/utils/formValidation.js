export function isValidEmail(value) {
  const trimmed = typeof value === 'string' ? value.trim() : '';
  if (!trimmed) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
}

export function isValidPhone(value, { min = 10, max = 11 } = {}) {
  const trimmed = typeof value === 'string' ? value.trim() : '';
  if (!trimmed) return false;
  const pattern = new RegExp(`^[0-9]{${min},${max}}$`);
  return pattern.test(trimmed);
}

/**
 * @param {{ name?: string, email?: string, phone?: string }} info
 * @returns {Record<string, string>}
 */
export function validateCustomerInfo(info = {}) {
  const errors = {};
  const name = info.name?.trim() ?? '';
  const email = info.email?.trim() ?? '';
  const phone = info.phone?.trim() ?? '';

  if (!name) {
    errors.name = 'Vui lòng nhập họ và tên.';
  }

  if (!email) {
    errors.email = 'Vui lòng nhập email.';
  } else if (!isValidEmail(email)) {
    errors.email = 'Email không hợp lệ.';
  }

  if (!phone) {
    errors.phone = 'Vui lòng nhập số điện thoại.';
  } else if (!isValidPhone(phone)) {
    errors.phone = 'Số điện thoại cần 10–11 chữ số.';
  }

  return errors;
}
