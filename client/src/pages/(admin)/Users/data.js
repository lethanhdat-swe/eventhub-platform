const dateTimeFormatter = new Intl.DateTimeFormat('vi-VN', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

export const USER_ROLE_OPTIONS = [
  { value: 'user', label: 'Người dùng' },
  { value: 'admin', label: 'Quản trị viên' },
];

export const MOCK_USERS = [
  {
    id: 'usr-001',
    email: 'an.nguyen@email.com',
    phoneNumber: '0901234567',
    fullName: 'Nguyễn Văn An',
    avatarUrl: null,
    role: 'user',
    provider: 'credentials',
    isEmailVerified: true,
    isLocked: false,
    lastLoginAt: '2026-05-14T08:30:00.000Z',
    createdAt: '2025-11-20T10:00:00.000Z',
    updatedAt: '2026-05-14T08:30:00.000Z',
  },
  {
    id: 'usr-002',
    email: 'binh.tran@email.com',
    phoneNumber: '0912345678',
    fullName: 'Trần Thị Bình',
    avatarUrl: null,
    role: 'user',
    provider: 'google',
    isEmailVerified: true,
    isLocked: false,
    lastLoginAt: '2026-05-13T19:45:00.000Z',
    createdAt: '2026-01-05T14:20:00.000Z',
    updatedAt: '2026-05-13T19:45:00.000Z',
  },
  {
    id: 'usr-003',
    email: 'chau.le@email.com',
    phoneNumber: '0923456789',
    fullName: 'Lê Minh Châu',
    avatarUrl: null,
    role: 'user',
    provider: 'credentials',
    isEmailVerified: false,
    isLocked: false,
    lastLoginAt: '2026-04-28T11:10:00.000Z',
    createdAt: '2026-02-18T09:15:00.000Z',
    updatedAt: '2026-04-28T11:10:00.000Z',
  },
  {
    id: 'usr-004',
    email: 'admin@eventhub.vn',
    phoneNumber: '0934567890',
    fullName: 'Phạm Hoàng Dũng',
    avatarUrl: null,
    role: 'admin',
    provider: 'credentials',
    isEmailVerified: true,
    isLocked: false,
    lastLoginAt: '2026-05-15T07:00:00.000Z',
    createdAt: '2025-08-01T08:00:00.000Z',
    updatedAt: '2026-05-15T07:00:00.000Z',
  },
  {
    id: 'usr-005',
    email: 'em.vo@email.com',
    phoneNumber: '0945678901',
    fullName: 'Võ Thị Em',
    avatarUrl: null,
    role: 'user',
    provider: 'google',
    isEmailVerified: true,
    isLocked: true,
    lastLoginAt: '2026-03-10T16:20:00.000Z',
    createdAt: '2026-03-01T12:00:00.000Z',
    updatedAt: '2026-05-01T10:00:00.000Z',
  },
  {
    id: 'usr-006',
    email: 'phong.dang@email.com',
    phoneNumber: '0956789012',
    fullName: 'Đặng Quốc Phong',
    avatarUrl: null,
    role: 'user',
    provider: 'credentials',
    isEmailVerified: true,
    isLocked: false,
    lastLoginAt: '2026-05-12T21:30:00.000Z',
    createdAt: '2025-12-15T17:45:00.000Z',
    updatedAt: '2026-05-12T21:30:00.000Z',
  },
];

export function formatRoleLabel(role) {
  return role === 'admin' ? 'Quản trị viên' : 'Người dùng';
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

export function filterUsers(users, searchQuery) {
  const query = searchQuery.trim().toLowerCase();
  if (!query) return users;

  return users.filter((user) => {
    const haystack = [user.fullName, user.email, user.phoneNumber]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    return haystack.includes(query);
  });
}
