const checkInTimeFormatter = new Intl.DateTimeFormat('vi-VN', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

export const MOCK_TICKETS_LOOKUP = [
  {
    id: 'tkt-001',
    ticketCode: 'V-2026-001',
    qrSecureToken: 'qr-son-tung-a01-8f3a2c',
    isCheckedIn: true,
    checkedInAt: '2026-06-15T18:45:00.000Z',
    customerName: 'Nguyễn Văn An',
    eventTitle: 'Concert Anh Trai Say Hi',
    seatLabel: 'A-01',
  },
  {
    id: 'tkt-002',
    ticketCode: 'V-2026-002',
    qrSecureToken: 'qr-workshop-b02-91bd4e',
    isCheckedIn: false,
    checkedInAt: null,
    customerName: 'Trần Thị Bình',
    eventTitle: 'Workshop Thiết kế UI/UX',
    seatLabel: 'B-02',
  },
  {
    id: 'tkt-003',
    ticketCode: 'V-2026-003',
    qrSecureToken: 'qr-dj-mie-c01-7ac91f',
    isCheckedIn: true,
    checkedInAt: '2026-05-08T19:10:00.000Z',
    customerName: 'Lê Minh Châu',
    eventTitle: 'Đêm nhạc Acoustic Đà Lạt',
    seatLabel: 'C-01',
  },
  {
    id: 'tkt-004',
    ticketCode: 'V-2026-004',
    qrSecureToken: 'qr-tech-summit-a02-55e0ab',
    isCheckedIn: false,
    checkedInAt: null,
    customerName: 'Phạm Hoàng Dũng',
    eventTitle: 'Tech Summit 2026',
    seatLabel: 'A-02',
  },
  {
    id: 'tkt-005',
    ticketCode: 'V-2026-005',
    qrSecureToken: 'qr-marathon-b01-3c82de',
    isCheckedIn: false,
    checkedInAt: null,
    customerName: 'Võ Thị Em',
    eventTitle: 'Marathon City Run',
    seatLabel: 'B-01',
  },
  {
    id: 'tkt-006',
    ticketCode: 'V-2026-006',
    qrSecureToken: 'qr-food-fest-fan-2a19ff',
    isCheckedIn: true,
    checkedInAt: '2026-10-03T10:30:00.000Z',
    customerName: 'Đặng Quốc Phong',
    eventTitle: 'Food Festival Mùa Thu',
    seatLabel: 'Fan-12',
  },
];

export const MOCK_RECENT_CHECKINS = [
  {
    id: 'ci-001',
    ticketCode: 'V-2026-001',
    customerName: 'Nguyễn Văn An',
    checkedInAt: '2026-06-15T18:45:00.000Z',
    success: true,
  },
  {
    id: 'ci-002',
    ticketCode: 'V-2026-003',
    customerName: 'Lê Minh Châu',
    checkedInAt: '2026-05-08T19:10:00.000Z',
    success: true,
  },
  {
    id: 'ci-003',
    ticketCode: 'V-2026-006',
    customerName: 'Đặng Quốc Phong',
    checkedInAt: '2026-10-03T10:30:00.000Z',
    success: true,
  },
  {
    id: 'ci-004',
    ticketCode: 'INVALID-CODE',
    customerName: '—',
    checkedInAt: '2026-05-14T09:20:00.000Z',
    success: false,
  },
];

export function formatCheckInTime(date) {
  if (!date) return '—';
  return checkInTimeFormatter.format(new Date(date));
}

export function lookupTicket(tickets, code) {
  const normalized = code.trim().toLowerCase();
  if (!normalized) return null;

  return (
    tickets.find(
      (ticket) =>
        ticket.ticketCode.toLowerCase() === normalized ||
        ticket.qrSecureToken.toLowerCase() === normalized
    ) ?? null
  );
}

export function cloneTicketsLookup() {
  return MOCK_TICKETS_LOOKUP.map((ticket) => ({ ...ticket }));
}
