export const MOCK_CATEGORIES = [
  {
    id: 'cat-001',
    name: 'Âm nhạc',
    slug: 'am-nhac',
    eventCount: 18,
    createdAt: '2025-11-10T08:00:00.000Z',
    status: 'active',
  },
  {
    id: 'cat-002',
    name: 'Workshop',
    slug: 'workshop',
    eventCount: 12,
    createdAt: '2025-12-05T10:30:00.000Z',
    status: 'active',
  },
  {
    id: 'cat-003',
    name: 'Hội thảo',
    slug: 'hoi-thao',
    eventCount: 9,
    createdAt: '2026-01-15T14:00:00.000Z',
    status: 'active',
  },
  {
    id: 'cat-004',
    name: 'Thể thao',
    slug: 'the-thao',
    eventCount: 6,
    createdAt: '2026-02-01T09:15:00.000Z',
    status: 'draft',
  },
  {
    id: 'cat-005',
    name: 'Lễ hội',
    slug: 'le-hoi',
    eventCount: 14,
    createdAt: '2026-02-20T11:45:00.000Z',
    status: 'active',
  },
  {
    id: 'cat-006',
    name: 'Sân khấu',
    slug: 'san-khau',
    eventCount: 7,
    createdAt: '2026-03-08T16:20:00.000Z',
    status: 'active',
  },
];

const dateFormatter = new Intl.DateTimeFormat('vi-VN', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

export function formatCreatedAt(date) {
  if (!date) return '—';
  return dateFormatter.format(new Date(date));
}

export function filterCategories(categories, searchQuery, facets = {}) {
  let list = categories;
  const query = (searchQuery ?? '').trim().toLowerCase();
  if (query) {
    list = list.filter((category) => {
      const haystack = [category.name, category.slug]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return haystack.includes(query);
    });
  }

  const { status } = facets;
  if (status && status !== 'all') {
    list = list.filter((category) => category.status === status);
  }

  return list;
}
