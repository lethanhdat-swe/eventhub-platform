export const TICKET_TYPE_OPTIONS = [
  { id: 'tt-vip', name: 'VIP', price: 2_500_000 },
  { id: 'tt-std', name: 'Standard', price: 800_000 },
  { id: 'tt-early', name: 'Early Bird', price: 500_000 },
  { id: 'tt-fan', name: 'Fan Zone', price: 1_200_000 },
  { id: 'tt-couple', name: 'Couple', price: 1_500_000 },
];

export const SEAT_STATUS_OPTIONS = [
  { value: 'active', label: 'Đang hoạt động' },
  { value: 'draft', label: 'Bản nháp' },
];

const ticketTypeById = Object.fromEntries(
  TICKET_TYPE_OPTIONS.map((type) => [type.id, type])
);

export function buildSeatLabel(rowLabel, seatNumber) {
  return `${rowLabel}-${String(seatNumber).padStart(2, '0')}`;
}

function createSeat(id, rowLabel, seatNumber, ticketTypeId, status = 'active') {
  const ticketType = ticketTypeById[ticketTypeId];
  return {
    id,
    rowLabel,
    seatNumber,
    seatLabel: buildSeatLabel(rowLabel, seatNumber),
    defaultTicketTypeId: ticketTypeId,
    defaultTicketType: {
      id: ticketType.id,
      name: ticketType.name,
      price: ticketType.price,
    },
    price: ticketType.price,
    status,
  };
}

export const MOCK_SEATS = [
  createSeat('seat-001', 'A', 1, 'tt-vip'),
  createSeat('seat-002', 'A', 2, 'tt-vip'),
  createSeat('seat-003', 'B', 1, 'tt-std'),
  createSeat('seat-004', 'B', 2, 'tt-std'),
  createSeat('seat-005', 'C', 1, 'tt-early'),
];

const priceFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0,
});

export function formatPriceVnd(price) {
  if (price == null) return '—';
  return priceFormatter.format(price);
}

export function filterSeats(seats, searchQuery, facets = {}) {
  let list = seats;
  const query = (searchQuery ?? '').trim().toLowerCase();
  if (query) {
    list = list.filter((seat) => {
      const haystack = [
        seat.seatLabel,
        seat.rowLabel,
        seat.defaultTicketType?.name,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return haystack.includes(query);
    });
  }

  const { rowLabel, ticketTypeId } = facets;
  if (rowLabel && rowLabel !== 'all') {
    list = list.filter((seat) => seat.rowLabel === rowLabel);
  }
  if (ticketTypeId && ticketTypeId !== 'all') {
    list = list.filter((seat) => seat.defaultTicketTypeId === ticketTypeId);
  }

  return list;
}

export function getTicketTypeById(id) {
  return ticketTypeById[id];
}
