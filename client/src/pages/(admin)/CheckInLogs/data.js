const checkInTimeFormatter = new Intl.DateTimeFormat('vi-VN', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

export const CHECKIN_LOG_STATUS_LABELS = {
  success: 'Hợp lệ',
  duplicate: 'Quét trùng',
  invalid: 'Không hợp lệ',
};

export const MOCK_CHECKIN_LOGS = [
  {
    id: 'cil-001',
    ticketCode: 'V-2026-001',
    customerName: 'Nguyễn Văn An',
    eventTitle: 'Concert Anh Trai Say Hi',
    seatLabel: 'A-01',
    scannedBy: 'Nguyễn Minh Gate',
    status: 'success',
    checkedInAt: '2026-06-15T18:45:00.000Z',
  },
  {
    id: 'cil-002',
    ticketCode: 'V-2026-002',
    customerName: 'Trần Thị Bình',
    eventTitle: 'Workshop Thiết kế UI/UX',
    seatLabel: 'B-02',
    scannedBy: 'Lê Hương Gate',
    status: 'success',
    checkedInAt: '2026-07-20T09:12:00.000Z',
  },
  {
    id: 'cil-003',
    ticketCode: 'V-2026-003',
    customerName: 'Lê Minh Châu',
    eventTitle: 'Đêm nhạc Acoustic Đà Lạt',
    seatLabel: 'C-01',
    scannedBy: 'Nguyễn Minh Gate',
    status: 'duplicate',
    checkedInAt: '2026-05-08T19:15:00.000Z',
  },
  {
    id: 'cil-004',
    ticketCode: 'V-2026-004',
    customerName: 'Phạm Hoàng Dũng',
    eventTitle: 'Tech Summit 2026',
    seatLabel: 'A-02',
    scannedBy: 'Trần Văn Gate',
    status: 'invalid',
    checkedInAt: '2026-08-10T14:30:00.000Z',
  },
  {
    id: 'cil-005',
    ticketCode: 'V-2026-005',
    customerName: 'Võ Thị Em',
    eventTitle: 'Marathon City Run',
    seatLabel: 'B-01',
    scannedBy: 'Lê Hương Gate',
    status: 'success',
    checkedInAt: '2026-09-05T06:55:00.000Z',
  },
  {
    id: 'cil-006',
    ticketCode: 'V-2026-006',
    customerName: 'Đặng Quốc Phong',
    eventTitle: 'Food Festival Mùa Thu',
    seatLabel: 'Fan-12',
    scannedBy: 'Nguyễn Minh Gate',
    status: 'success',
    checkedInAt: '2026-10-03T10:30:00.000Z',
  },
];

export function formatCheckInTime(date) {
  if (!date) return '—';
  return checkInTimeFormatter.format(new Date(date));
}

export function filterCheckInLogs(logs, searchQuery) {
  const query = searchQuery.trim().toLowerCase();
  if (!query) return logs;

  return logs.filter((log) => {
    const haystack = [
      log.ticketCode,
      log.customerName,
      log.eventTitle,
      log.seatLabel,
      log.scannedBy,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    return haystack.includes(query);
  });
}
