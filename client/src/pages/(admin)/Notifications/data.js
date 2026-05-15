const dateTimeFormatter = new Intl.DateTimeFormat('vi-VN', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

export const NOTIFICATION_AUDIENCE_OPTIONS = [
  { value: 'all', label: 'Tất cả người dùng' },
  { value: 'ticket_buyers', label: 'Người đã mua vé' },
  { value: 'admin', label: 'Admin' },
];

export const NOTIFICATION_CHANNEL_OPTIONS = [
  { value: 'in_app', label: 'In-app' },
  { value: 'email', label: 'Email' },
  { value: 'both', label: 'Cả hai' },
];

export const NOTIFICATION_STATUS_OPTIONS = [
  { value: 'draft', label: 'Bản nháp' },
  { value: 'sent', label: 'Đã gửi' },
  { value: 'scheduled', label: 'Đã lên lịch' },
];

export const MOCK_NOTIFICATIONS = [
  {
    id: 'ntf-001',
    title: 'Chào mừng đến với EventHub',
    shortContent: 'Cảm ơn bạn đã đăng ký. Khám phá sự kiện hot tuần này.',
    audience: 'all',
    channel: 'both',
    status: 'sent',
    createdAt: '2026-01-10T08:00:00.000Z',
    updatedAt: '2026-01-10T08:05:00.000Z',
  },
  {
    id: 'ntf-002',
    title: 'Nhắc nhở: Concert Anh Trai Say Hi',
    shortContent: 'Sự kiện diễn ra sau 3 ngày. Vui lòng mang vé QR khi check-in.',
    audience: 'ticket_buyers',
    channel: 'in_app',
    status: 'sent',
    createdAt: '2026-06-12T09:00:00.000Z',
    updatedAt: '2026-06-12T09:00:00.000Z',
  },
  {
    id: 'ntf-003',
    title: 'Mã giảm giá SUMMER20 sắp hết hạn',
    shortContent: 'Ưu đãi 20% cho sự kiện ngoài trời — dùng trước 31/08.',
    audience: 'all',
    channel: 'email',
    status: 'scheduled',
    createdAt: '2026-07-01T10:00:00.000Z',
    updatedAt: '2026-07-01T10:00:00.000Z',
  },
  {
    id: 'ntf-004',
    title: 'Bảo trì hệ thống đêm 20/05',
    shortContent: 'EventHub tạm ngưng 02:00–04:00 để nâng cấp máy chủ.',
    audience: 'admin',
    channel: 'in_app',
    status: 'draft',
    createdAt: '2026-05-18T14:30:00.000Z',
    updatedAt: '2026-05-18T14:30:00.000Z',
  },
  {
    id: 'ntf-005',
    title: 'Workshop UI/UX: tài liệu đã sẵn sàng',
    shortContent: 'Người đã đặt vé có thể tải slide trong mục Đơn hàng.',
    audience: 'ticket_buyers',
    channel: 'both',
    status: 'sent',
    createdAt: '2026-07-18T16:00:00.000Z',
    updatedAt: '2026-07-18T16:00:00.000Z',
  },
  {
    id: 'ntf-006',
    title: 'Tech Summit 2026: mở đăng ký sớm',
    shortContent: 'Giảm 15% cho 100 vé đầu tiên — đăng ký ngay trên EventHub.',
    audience: 'all',
    channel: 'email',
    status: 'draft',
    createdAt: '2026-08-01T11:00:00.000Z',
    updatedAt: '2026-08-01T11:00:00.000Z',
  },
];

const audienceLabels = Object.fromEntries(
  NOTIFICATION_AUDIENCE_OPTIONS.map((o) => [o.value, o.label])
);

const channelLabels = Object.fromEntries(
  NOTIFICATION_CHANNEL_OPTIONS.map((o) => [o.value, o.label])
);

export function formatAudience(audience) {
  return audienceLabels[audience] ?? audience;
}

export function formatChannel(channel) {
  return channelLabels[channel] ?? channel;
}

export function formatCreatedAt(date) {
  if (!date) return '—';
  return dateTimeFormatter.format(new Date(date));
}

export function filterNotifications(notifications, searchQuery) {
  const query = searchQuery.trim().toLowerCase();
  if (!query) return notifications;

  return notifications.filter((item) => {
    const haystack = [item.title, item.shortContent]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    return haystack.includes(query);
  });
}
