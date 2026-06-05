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

export const MOCK_TICKETS_LOOKUP = [
  {
    id: 'tkt-001',
    orderCode: 'ORD-2026-001',
    customerName: 'Nguyễn Văn An',
    qrSecureToken: 'qr_live_8f3b7a9c1d2e',
    isCheckedIn: true,
    checkedInAt: '2026-06-15T18:45:00.000Z',
    eventTitle: 'Concert Anh Trai Say Hi',
    seatLabel: 'A-01',
    ticketType: 'VIP',
  },
  {
    id: 'tkt-002',
    orderCode: 'ORD-2026-002',
    customerName: 'Trần Thị Bình',
    qrSecureToken: 'qr_live_4a6c2f0b9d1a',
    isCheckedIn: false,
    checkedInAt: null,
    eventTitle: 'Workshop Thiết kế UI/UX',
    seatLabel: 'B-02',
    ticketType: 'Standard',
  },
];

export const MOCK_RECENT_CHECKIN_LOGS = [
  {
    id: 'ci-001',
    token: 'qr_live_8f3b7a9c1d2e',
    status: 'VALID',
    message: 'Check-in thành công.',
    scannedAt: '2026-06-15T18:45:00.000Z',
    ticketId: 'tkt-001',
    orderCode: 'ORD-2026-001',
    customerName: 'Nguyễn Văn An',
    eventTitle: 'Concert Anh Trai Say Hi',
    seatLabel: 'A-01',
    ticketType: 'VIP',
  },
  {
    id: 'ci-002',
    token: 'qr_unknown_9172',
    status: 'INVALID',
    message: 'Mã QR không hợp lệ.',
    scannedAt: '2026-06-15T18:40:00.000Z',
    ticketId: null,
    orderCode: null,
    customerName: null,
    eventTitle: null,
    seatLabel: null,
    ticketType: null,
  },
  {
    id: 'ci-003',
    token: 'qr_live_8f3b7a9c1d2e',
    status: 'DUPLICATE',
    message: 'Vé đã được quét trước đó.',
    scannedAt: '2026-06-15T18:52:00.000Z',
    ticketId: 'tkt-001',
    orderCode: 'ORD-2026-001',
    customerName: 'Nguyễn Văn An',
    eventTitle: 'Concert Anh Trai Say Hi',
    seatLabel: 'A-01',
    ticketType: 'VIP',
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
      (ticket) => ticket.qrSecureToken.toLowerCase() === normalized
    ) ?? null
  );
}

export function cloneTicketsLookup() {
  return MOCK_TICKETS_LOOKUP.map((ticket) => ({ ...ticket }));
}

export function getShortToken(token) {
  if (!token) return '-';
  if (token.length <= 16) return token;
  return `${token.slice(0, 10)}...${token.slice(-6)}`;
}

export function createLogFromTicket({ ticket, token, status, message, scannedAt }) {
  return {
    token,
    status,
    message,
    scannedAt,
    ticketId: ticket?.id ?? null,
    orderCode: ticket?.orderCode ?? null,
    customerName: ticket?.customerName ?? null,
    eventTitle: ticket?.eventTitle ?? null,
    seatLabel: ticket?.seatLabel ?? null,
    ticketType: ticket?.ticketType ?? null,
  };
}
