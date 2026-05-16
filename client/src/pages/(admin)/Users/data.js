const dateTimeFormatter = new Intl.DateTimeFormat('vi-VN', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

export const USER_ROLE_OPTIONS = [
  { value: 'USER', label: 'Người dùng' },
  { value: 'ADMIN', label: 'Quản trị viên' },
];

export function formatRoleLabel(role) {
  return role === 'ADMIN' ? 'Quản trị viên' : 'Người dùng';
}

export function formatProviderLabel(provider) {
  if (provider === 'google') return 'Google';
  return 'Email';
}

export function formatLastLogin(date) {
  if (!date) return '—';
  return dateTimeFormatter.format(new Date(date));
}

export function formatCreatedAt(date) {
  if (!date) return '—';
  return dateTimeFormatter.format(new Date(date));
}
