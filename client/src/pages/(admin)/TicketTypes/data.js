export const MOCK_TICKET_TYPES = [
  {
    id: 'tt-vip',
    name: 'VIP',
    price: 2_500_000,
    defaultSeatCount: 2,
    eventSeatCount: 8,
    status: 'active',
    description: 'Khu vực VIP gần sân khấu, ưu tiên check-in.',
  },
  {
    id: 'tt-std',
    name: 'Standard',
    price: 800_000,
    defaultSeatCount: 2,
    eventSeatCount: 24,
    status: 'active',
    description: 'Ghế tiêu chuẩn với tầm nhìn tốt.',
  },
  {
    id: 'tt-early',
    name: 'Early Bird',
    price: 500_000,
    defaultSeatCount: 1,
    eventSeatCount: 12,
    status: 'active',
    description: 'Giá ưu đãi cho người mua sớm.',
  },
  {
    id: 'tt-fan',
    name: 'Fan Zone',
    price: 1_200_000,
    defaultSeatCount: 0,
    eventSeatCount: 6,
    status: 'active',
    description: 'Khu vực dành cho fan cứng.',
  },
  {
    id: 'tt-couple',
    name: 'Couple',
    price: 1_500_000,
    defaultSeatCount: 0,
    eventSeatCount: 4,
    status: 'draft',
    description: 'Gói vé đôi, ghế cạnh nhau.',
  },
];

export const TICKET_TYPE_STATUS_OPTIONS = [
  { value: 'active', label: 'Đang hoạt động' },
  { value: 'draft', label: 'Bản nháp' },
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

const PRICE_BUCKET = {
  all: () => true,
  lt1m: (price) => price < 1_000_000,
  mid: (price) => price >= 1_000_000 && price < 2_000_000,
  gte2m: (price) => price >= 2_000_000,
};

export function filterTicketTypes(ticketTypes, searchQuery, facets = {}) {
  let list = ticketTypes;
  const query = (searchQuery ?? '').trim().toLowerCase();
  if (query) {
    list = list.filter((type) => type.name.toLowerCase().includes(query));
  }

  const { priceBucket } = facets;
  if (priceBucket && priceBucket !== 'all' && PRICE_BUCKET[priceBucket]) {
    const match = PRICE_BUCKET[priceBucket];
    list = list.filter((type) => match(type.price));
  }

  return list;
}
