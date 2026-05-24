const checkInTimeFormatter = new Intl.DateTimeFormat('vi-VN', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

export const CHECKIN_LOG_STATUS_LABELS = {
  VALID: 'Hợp lệ',
  DUPLICATE: 'Quét trùng',
  INVALID: 'Không hợp lệ',
};

export const MOCK_CHECKIN_LOGS = [
  {
    id: 'cil-001',
    scannedAt: '2026-06-15T18:45:00.000Z',
    token: 'qr_live_8f3b7a9c1d2e',
    status: 'VALID',
    message: 'Check-in thành công.',
    ticketId: 'ticket-001',
    customerName: 'Nguyễn Văn An',
    eventTitle: 'Concert Anh Trai Say Hi',
    seatLabel: 'A-01',
  },
  {
    id: 'cil-002',
    scannedAt: '2026-06-15T18:52:00.000Z',
    token: 'qr_live_8f3b7a9c1d2e',
    status: 'DUPLICATE',
    message: 'Vé đã được quét trước đó.',
    ticketId: 'ticket-001',
    customerName: 'Nguyễn Văn An',
    eventTitle: 'Concert Anh Trai Say Hi',
    seatLabel: 'A-01',
  },
  {
    id: 'cil-003',
    scannedAt: '2026-07-20T09:12:00.000Z',
    token: 'qr_live_4a6c2f0b9d1a',
    status: 'VALID',
    message: 'Check-in thành công.',
    ticketId: 'ticket-002',
    customerName: 'Trần Thị Bình',
    eventTitle: 'Workshop Thiết kế UI/UX',
    seatLabel: 'B-02',
  },
  {
    id: 'cil-004',
    scannedAt: '2026-08-10T14:30:00.000Z',
    token: 'qr_unknown_9172',
    status: 'INVALID',
    message: 'Không tìm thấy vé tương ứng với mã QR.',
    ticketId: null,
    customerName: null,
    eventTitle: null,
    seatLabel: null,
  },
  {
    id: 'cil-005',
    scannedAt: '2026-05-08T19:15:00.000Z',
    token: 'qr_live_b2d9f81a74cc',
    status: 'DUPLICATE',
    message: 'Vé đã được check-in lúc 19:02.',
    ticketId: 'ticket-003',
    customerName: 'Lê Minh Châu',
    eventTitle: 'Đêm nhạc Acoustic Đà Lạt',
    seatLabel: 'C-01',
  },
  {
    id: 'cil-006',
    scannedAt: '2026-10-03T10:30:00.000Z',
    token: 'qr_malformed_003',
    status: 'INVALID',
    message: 'Token không đúng định dạng.',
    ticketId: null,
    customerName: null,
    eventTitle: null,
    seatLabel: null,
  },
];

export function formatCheckInTime(date) {
  if (!date) return '—';
  return checkInTimeFormatter.format(new Date(date));
}

function startOfDayMs(daysAgo) {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - daysAgo);
  return d.getTime();
}

export function filterCheckInLogs(logs, searchQuery, facets = {}) {
  let list = logs;
  const query = (searchQuery ?? '').trim().toLowerCase();
  if (query) {
    list = list.filter((log) => {
      const haystack = [
        log.token,
        log.customerName,
        log.eventTitle,
        log.message,
        log.ticketId,
        log.seatLabel,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return haystack.includes(query);
    });
  }

  const { eventTitle, status, timeRange } = facets;
  if (eventTitle && eventTitle !== 'all') {
    list = list.filter((log) => log.ticketId && log.eventTitle === eventTitle);
  }
  if (status && status !== 'all') {
    list = list.filter((log) => log.status === status);
  }
  if (timeRange && timeRange !== 'all') {
    const cutoff =
      timeRange === '7d'
        ? startOfDayMs(7)
        : timeRange === '30d'
          ? startOfDayMs(30)
          : null;
    if (cutoff != null) {
      list = list.filter(
        (log) => log.scannedAt && new Date(log.scannedAt).getTime() >= cutoff
      );
    }
  }

  return list;
}
