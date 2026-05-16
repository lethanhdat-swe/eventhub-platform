const dateFormatter = new Intl.DateTimeFormat('vi-VN', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

const dateTimeFormatter = new Intl.DateTimeFormat('vi-VN', {
  day: '2-digit',
  month: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
});

export const DASHBOARD_STATS = [
  {
    key: 'revenue',
    title: 'Tổng doanh thu',
    value: '12,8 tỷ',
    description: 'VNĐ tháng này',
    trend: '+15%',
  },
  {
    key: 'tickets',
    title: 'Vé đã bán',
    value: '3.420',
    description: 'trong 30 ngày qua',
    trend: '+8%',
  },
  {
    key: 'events',
    title: 'Sự kiện đang hoạt động',
    value: '12',
    description: 'đang mở bán vé',
    trend: '+2',
  },
  {
    key: 'checkin',
    title: 'Tỷ lệ check-in',
    value: '87%',
    description: 'trung bình 7 ngày',
    trend: '+4%',
  },
];

export const MOCK_REVENUE_BARS = [
  { label: 'T2', value: 420 },
  { label: 'T3', value: 580 },
  { label: 'T4', value: 390 },
  { label: 'T5', value: 720 },
  { label: 'T6', value: 650 },
  { label: 'T7', value: 890 },
  { label: 'CN', value: 760 },
];

export const MOCK_RECENT_ORDERS = [
  {
    id: 'ord-001',
    orderCode: 'EH-2026-0001',
    customerName: 'Nguyễn Văn An',
    totalAmount: 2_500_000,
    status: 'PAID',
  },
  {
    id: 'ord-002',
    orderCode: 'EH-2026-0002',
    customerName: 'Trần Thị Bình',
    totalAmount: 800_000,
    status: 'PENDING',
  },
  {
    id: 'ord-003',
    orderCode: 'EH-2026-0003',
    customerName: 'Lê Minh Châu',
    totalAmount: 500_000,
    status: 'PAID',
  },
  {
    id: 'ord-004',
    orderCode: 'EH-2026-0004',
    customerName: 'Phạm Hoàng Dũng',
    totalAmount: 1_200_000,
    status: 'CANCELLED',
  },
  {
    id: 'ord-005',
    orderCode: 'EH-2026-0005',
    customerName: 'Võ Thị Em',
    totalAmount: 350_000,
    status: 'PAID',
  },
];

export const MOCK_FEATURED_EVENTS = [
  {
    id: 'evt-001',
    title: 'Concert Anh Trai Say Hi',
    startDate: '2026-06-15T19:00:00.000Z',
    ticketsSold: 1840,
  },
  {
    id: 'evt-003',
    title: 'Đêm nhạc Acoustic Đà Lạt',
    startDate: '2026-05-08T18:30:00.000Z',
    ticketsSold: 620,
  },
  {
    id: 'evt-004',
    title: 'Tech Summit 2026',
    startDate: '2026-08-01T08:00:00.000Z',
    ticketsSold: 950,
  },
  {
    id: 'evt-005',
    title: 'Marathon City Run',
    startDate: '2026-09-20T06:00:00.000Z',
    ticketsSold: 2100,
  },
  {
    id: 'evt-002',
    title: 'Workshop Thiết kế UI/UX',
    startDate: '2026-04-20T09:00:00.000Z',
    ticketsSold: 48,
  },
];

export const MOCK_TODAY_CHECKINS = [
  {
    id: 'ci-1',
    customerName: 'Nguyễn Văn An',
    ticketCode: 'V-2026-001',
    checkedInAt: '2026-05-15T08:12:00.000Z',
  },
  {
    id: 'ci-2',
    customerName: 'Trần Thị Bình',
    ticketCode: 'V-2026-002',
    checkedInAt: '2026-05-15T09:05:00.000Z',
  },
  {
    id: 'ci-3',
    customerName: 'Lê Minh Châu',
    ticketCode: 'V-2026-003',
    checkedInAt: '2026-05-15T09:42:00.000Z',
  },
  {
    id: 'ci-4',
    customerName: 'Phạm Hoàng Dũng',
    ticketCode: 'V-2026-004',
    checkedInAt: '2026-05-15T10:18:00.000Z',
  },
  {
    id: 'ci-5',
    customerName: 'Võ Thị Em',
    ticketCode: 'V-2026-005',
    checkedInAt: '2026-05-15T11:30:00.000Z',
  },
];

export function formatEventDate(date) {
  if (!date) return '—';
  return dateFormatter.format(new Date(date));
}

export function formatCheckInTime(date) {
  if (!date) return '—';
  return dateTimeFormatter.format(new Date(date));
}
