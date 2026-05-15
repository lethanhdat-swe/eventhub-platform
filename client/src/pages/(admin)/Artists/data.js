export const ARTIST_ROLE_OPTIONS = [
  { value: 'SINGER', label: 'Ca sĩ' },
  { value: 'DJ', label: 'DJ' },
  { value: 'GUEST', label: 'Khách mời' },
  { value: 'HOST', label: 'MC' },
];

const ROLE_LABEL_MAP = Object.fromEntries(
  ARTIST_ROLE_OPTIONS.map((option) => [option.value, option.label])
);

export function getRoleLabel(role) {
  return ROLE_LABEL_MAP[role] ?? role;
}

export const MOCK_ARTISTS = [
  {
    id: 'art-001',
    name: 'Sơn Tùng M-TP',
    slug: 'son-tung-m-tp',
    avatarUrl: 'https://picsum.photos/seed/son-tung/80/80',
    description: 'Ca sĩ, nhạc sĩ V-Pop.',
    role: 'SINGER',
    roleLabel: 'Ca sĩ',
    eventCount: 12,
    createdAt: '2025-10-15T08:00:00.000Z',
    updatedAt: '2026-03-01T10:00:00.000Z',
    status: 'active',
  },
  {
    id: 'art-002',
    name: 'Low G',
    slug: 'low-g',
    avatarUrl: 'https://picsum.photos/seed/low-g/80/80',
    description: 'Rapper, producer.',
    role: 'SINGER',
    roleLabel: 'Ca sĩ',
    eventCount: 8,
    createdAt: '2025-11-20T09:30:00.000Z',
    updatedAt: '2026-02-18T14:20:00.000Z',
    status: 'active',
  },
  {
    id: 'art-003',
    name: 'DJ Mie',
    slug: 'dj-mie',
    avatarUrl: 'https://picsum.photos/seed/dj-mie/80/80',
    description: 'DJ / Producer điện tử.',
    role: 'DJ',
    roleLabel: 'DJ',
    eventCount: 15,
    createdAt: '2025-12-01T11:00:00.000Z',
    updatedAt: '2026-03-10T16:45:00.000Z',
    status: 'active',
  },
  {
    id: 'art-004',
    name: 'Mỹ Tâm',
    slug: 'my-tam',
    avatarUrl: 'https://picsum.photos/seed/my-tam/80/80',
    description: 'Ca sĩ nhạc pop ballad.',
    role: 'SINGER',
    roleLabel: 'Ca sĩ',
    eventCount: 10,
    createdAt: '2026-01-05T07:15:00.000Z',
    updatedAt: '2026-03-05T09:00:00.000Z',
    status: 'active',
  },
  {
    id: 'art-005',
    name: 'Da LAB',
    slug: 'da-lab',
    avatarUrl: null,
    description: 'Nhóm nhạc indie.',
    role: 'SINGER',
    roleLabel: 'Ca sĩ',
    eventCount: 5,
    createdAt: '2026-02-10T13:40:00.000Z',
    updatedAt: '2026-02-28T11:30:00.000Z',
    status: 'draft',
  },
  {
    id: 'art-006',
    name: 'Hà Anh Tuấn',
    slug: 'ha-anh-tuan',
    avatarUrl: 'https://picsum.photos/seed/ha-anh-tuan/80/80',
    description: 'Ca sĩ, khách mời sự kiện đặc biệt.',
    role: 'GUEST',
    roleLabel: 'Khách mời',
    eventCount: 6,
    createdAt: '2026-02-25T15:20:00.000Z',
    updatedAt: '2026-03-12T08:10:00.000Z',
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

export function filterArtists(artists, searchQuery) {
  const query = searchQuery.trim().toLowerCase();
  if (!query) return artists;

  return artists.filter((artist) => {
    const haystack = [artist.name, artist.slug]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    return haystack.includes(query);
  });
}
