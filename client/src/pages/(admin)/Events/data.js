export const MOCK_CATEGORIES = [
  { id: 'cat-001', name: 'Âm nhạc' },
  { id: 'cat-002', name: 'Workshop' },
  { id: 'cat-003', name: 'Hội thảo' },
  { id: 'cat-004', name: 'Thể thao' },
  { id: 'cat-005', name: 'Lễ hội' },
];

export const EVENT_STATUS_OPTIONS = [
  { value: 'DRAFT', label: 'Bản nháp' },
  { value: 'PUBLISHED', label: 'Đã xuất bản' },
  { value: 'CANCELLED', label: 'Đã hủy' },
];

export const MOCK_EVENTS = [
  {
    id: 'evt-001',
    title: 'Concert Anh Trai Say Hi',
    slug: 'concert-anh-trai-say-hi',
    description: 'Đêm nhạc đặc biệt với dàn nghệ sĩ Anh Trai Say Hi.',
    location: 'Nhà thi đấu Nguyễn Du, TP.HCM',
    startDate: '2026-06-15T19:00:00.000Z',
    endDate: '2026-06-15T23:00:00.000Z',
    thumbnailUrl: 'https://picsum.photos/seed/anh-trai-say-hi/80/80',
    status: 'PUBLISHED',
    categoryId: 'cat-001',
    category: { id: 'cat-001', name: 'Âm nhạc', slug: 'am-nhac' },
    createdAt: '2026-01-10T08:00:00.000Z',
    updatedAt: '2026-03-01T10:30:00.000Z',
  },
  {
    id: 'evt-002',
    title: 'Workshop Thiết kế UI/UX',
    slug: 'workshop-thiet-ke-ui-ux',
    description: 'Khóa học thực hành thiết kế giao diện và trải nghiệm người dùng.',
    location: 'EventHub Studio, Hà Nội',
    startDate: '2026-04-20T09:00:00.000Z',
    endDate: '2026-04-20T17:00:00.000Z',
    thumbnailUrl: 'https://picsum.photos/seed/ui-ux-workshop/80/80',
    status: 'DRAFT',
    categoryId: 'cat-002',
    category: { id: 'cat-002', name: 'Workshop', slug: 'workshop' },
    createdAt: '2026-02-05T14:20:00.000Z',
    updatedAt: '2026-02-28T09:15:00.000Z',
  },
  {
    id: 'evt-003',
    title: 'Đêm nhạc Acoustic Đà Lạt',
    slug: 'dem-nhac-acoustic-da-lat',
    description: 'Không gian acoustic ấm áp giữa thành phố ngàn hoa.',
    location: 'The Garden Venue, Đà Lạt',
    startDate: '2026-05-08T18:30:00.000Z',
    endDate: '2026-05-08T22:00:00.000Z',
    thumbnailUrl: 'https://picsum.photos/seed/acoustic-dalat/80/80',
    status: 'PUBLISHED',
    categoryId: 'cat-001',
    category: { id: 'cat-001', name: 'Âm nhạc', slug: 'am-nhac' },
    createdAt: '2026-01-22T11:00:00.000Z',
    updatedAt: '2026-03-10T16:45:00.000Z',
  },
  {
    id: 'evt-004',
    title: 'Tech Summit 2026',
    slug: 'tech-summit-2026',
    description: 'Hội nghị công nghệ với các diễn giả trong và ngoài nước.',
    location: 'GEM Center, TP.HCM',
    startDate: '2026-08-01T08:00:00.000Z',
    endDate: '2026-08-02T18:00:00.000Z',
    thumbnailUrl: null,
    status: 'CANCELLED',
    categoryId: 'cat-003',
    category: { id: 'cat-003', name: 'Hội thảo', slug: 'hoi-thao' },
    createdAt: '2025-12-01T07:30:00.000Z',
    updatedAt: '2026-02-15T12:00:00.000Z',
  },
  {
    id: 'evt-005',
    title: 'Marathon City Run',
    slug: 'marathon-city-run',
    description: 'Giải chạy marathon đường phố dành cho mọi lứa tuổi.',
    location: 'Công viên Bách Thảo, Hà Nội',
    startDate: '2026-09-14T05:00:00.000Z',
    endDate: '2026-09-14T11:00:00.000Z',
    thumbnailUrl: 'https://picsum.photos/seed/marathon-run/80/80',
    status: 'DRAFT',
    categoryId: 'cat-004',
    category: { id: 'cat-004', name: 'Thể thao', slug: 'the-thao' },
    createdAt: '2026-03-01T09:00:00.000Z',
    updatedAt: '2026-03-12T08:20:00.000Z',
  },
  {
    id: 'evt-006',
    title: 'Food Festival Mùa Thu',
    slug: 'food-festival-mua-thu',
    description: 'Lễ hội ẩm thực với hơn 50 gian hàng địa phương.',
    location: 'Phố đi bộ Nguyễn Huệ, TP.HCM',
    startDate: '2026-10-03T10:00:00.000Z',
    endDate: '2026-10-05T22:00:00.000Z',
    thumbnailUrl: 'https://picsum.photos/seed/food-festival/80/80',
    status: 'PUBLISHED',
    categoryId: 'cat-005',
    category: { id: 'cat-005', name: 'Lễ hội', slug: 'le-hoi' },
    createdAt: '2026-02-18T13:40:00.000Z',
    updatedAt: '2026-03-08T11:10:00.000Z',
  },
];

const dateFormatter = new Intl.DateTimeFormat('vi-VN', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

export function formatEventDateRange(startDate, endDate) {
  if (!startDate && !endDate) return '—';

  const start = startDate ? dateFormatter.format(new Date(startDate)) : null;
  const end = endDate ? dateFormatter.format(new Date(endDate)) : null;

  if (start && end && start !== end) {
    return `${start} – ${end}`;
  }

  return start || end || '—';
}

export function formatCreatedAt(date) {
  if (!date) return '—';
  return dateFormatter.format(new Date(date));
}

export function filterEvents(events, searchQuery, facets = {}) {
  let list = events;
  const query = (searchQuery ?? '').trim().toLowerCase();
  if (query) {
    list = list.filter((event) => {
      const haystack = [event.title, event.slug, event.location]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return haystack.includes(query);
    });
  }

  const { status, categoryId } = facets;
  if (status && status !== 'all') {
    list = list.filter((event) => event.status === status);
  }
  if (categoryId && categoryId !== 'all') {
    list = list.filter((event) => event.categoryId === categoryId);
  }

  return list;
}

export function getEventStats(events) {
  return {
    total: events.length,
    published: events.filter((e) => e.status === 'PUBLISHED').length,
    draft: events.filter((e) => e.status === 'DRAFT').length,
    cancelled: events.filter((e) => e.status === 'CANCELLED').length,
  };
}
