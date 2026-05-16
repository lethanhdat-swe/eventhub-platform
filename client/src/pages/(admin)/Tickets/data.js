const dateTimeFormatter = new Intl.DateTimeFormat('vi-VN', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

export const MOCK_TICKETS = [
  {
    id: 'tkt-001',
    ticketCode: 'V-2026-001',
    orderId: 'ord-001',
    eventSeatId: 'es-001',
    qrSecureToken: 'qr-son-tung-a01-8f3a2c',
    isCheckedIn: true,
    checkedInAt: '2026-06-15T18:45:00.000Z',
    customerName: 'Nguyễn Văn An',
    customerEmail: 'an.nguyen@email.com',
    eventTitle: 'Concert Anh Trai Say Hi',
    seatLabel: 'A-01',
    ticketTypeName: 'VIP',
  },
  {
    id: 'tkt-002',
    ticketCode: 'V-2026-002',
    orderId: 'ord-002',
    eventSeatId: 'es-002',
    qrSecureToken: 'qr-workshop-b02-91bd4e',
    isCheckedIn: false,
    checkedInAt: null,
    customerName: 'Trần Thị Bình',
    customerEmail: 'binh.tran@email.com',
    eventTitle: 'Workshop Thiết kế UI/UX',
    seatLabel: 'B-02',
    ticketTypeName: 'Standard',
  },
  {
    id: 'tkt-003',
    ticketCode: 'V-2026-003',
    orderId: 'ord-003',
    eventSeatId: 'es-003',
    qrSecureToken: 'qr-dj-mie-c01-7ac91f',
    isCheckedIn: true,
    checkedInAt: '2026-05-08T19:10:00.000Z',
    customerName: 'Lê Minh Châu',
    customerEmail: 'chau.le@email.com',
    eventTitle: 'Đêm nhạc Acoustic Đà Lạt',
    seatLabel: 'C-01',
    ticketTypeName: 'Early Bird',
  },
  {
    id: 'tkt-004',
    ticketCode: 'V-2026-004',
    orderId: 'ord-004',
    eventSeatId: 'es-004',
    qrSecureToken: 'qr-tech-summit-a02-55e0ab',
    isCheckedIn: false,
    checkedInAt: null,
    customerName: 'Phạm Hoàng Dũng',
    customerEmail: 'dung.pham@email.com',
    eventTitle: 'Tech Summit 2026',
    seatLabel: 'A-02',
    ticketTypeName: 'VIP',
  },
  {
    id: 'tkt-005',
    ticketCode: 'V-2026-005',
    orderId: 'ord-005',
    eventSeatId: 'es-005',
    qrSecureToken: 'qr-marathon-b01-3c82de',
    isCheckedIn: false,
    checkedInAt: null,
    customerName: 'Võ Thị Em',
    customerEmail: 'em.vo@email.com',
    eventTitle: 'Marathon City Run',
    seatLabel: 'B-01',
    ticketTypeName: 'Standard',
  },
  {
    id: 'tkt-006',
    ticketCode: 'V-2026-006',
    orderId: 'ord-006',
    eventSeatId: 'es-006',
    qrSecureToken: 'qr-food-fest-fan-2a19ff',
    isCheckedIn: true,
    checkedInAt: '2026-10-03T10:30:00.000Z',
    customerName: 'Đặng Quốc Phong',
    customerEmail: 'phong.dang@email.com',
    eventTitle: 'Food Festival Mùa Thu',
    seatLabel: 'Fan-12',
    ticketTypeName: 'Fan Zone',
  },
];

export function formatCheckedInAt(date) {
  if (!date) return '—';
  return dateTimeFormatter.format(new Date(date));
}

export function filterTickets(tickets, searchQuery, facets = {}) {
  let list = tickets;
  const query = (searchQuery ?? '').trim().toLowerCase();
  if (query) {
    list = list.filter((ticket) => {
      const haystack = [
        ticket.ticketCode,
        ticket.orderId,
        ticket.customerName,
        ticket.customerEmail,
        ticket.eventTitle,
        ticket.seatLabel,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return haystack.includes(query);
    });
  }

  const { checkIn, eventTitle } = facets;
  if (checkIn && checkIn !== 'all') {
    if (checkIn === 'checked') {
      list = list.filter((t) => t.isCheckedIn);
    } else if (checkIn === 'unchecked') {
      list = list.filter((t) => !t.isCheckedIn);
    }
  }
  if (eventTitle && eventTitle !== 'all') {
    list = list.filter((t) => t.eventTitle === eventTitle);
  }

  return list;
}
