export const COUPON_STATUS_OPTIONS = [
  { value: 'ACTIVE', label: 'Đang hoạt động' },
  { value: 'INACTIVE', label: 'Tạm dừng' },
];

export const MOCK_COUPONS = [
  {
    id: 'cpn-001',
    code: 'EVENTHUB10',
    description: 'Giảm 10% cho đơn đầu tiên trên EventHub.',
    discountPercent: 10,
    usageLimit: 500,
    validUntil: '2026-12-31T23:59:00.000Z',
    status: 'ACTIVE',
    createdAt: '2026-01-15T08:00:00.000Z',
    updatedAt: '2026-03-01T10:00:00.000Z',
  },
  {
    id: 'cpn-002',
    code: 'SUMMER20',
    description: 'Ưu đãi mùa hè — giảm 20% tối đa cho sự kiện ngoài trời.',
    discountPercent: 20,
    usageLimit: 200,
    validUntil: '2026-08-31T23:59:00.000Z',
    status: 'ACTIVE',
    createdAt: '2026-04-01T09:00:00.000Z',
    updatedAt: '2026-04-01T09:00:00.000Z',
  },
  {
    id: 'cpn-003',
    code: 'STUDENT15',
    description: 'Dành cho sinh viên có mã xác thực.',
    discountPercent: 15,
    usageLimit: 1000,
    validUntil: '2026-06-30T23:59:00.000Z',
    status: 'ACTIVE',
    createdAt: '2026-02-10T11:30:00.000Z',
    updatedAt: '2026-05-12T14:00:00.000Z',
  },
  {
    id: 'cpn-004',
    code: 'VIP30',
    description: 'Giảm 30% cho khách VIP và thành viên premium.',
    discountPercent: 30,
    usageLimit: 50,
    validUntil: '2026-12-31T23:59:00.000Z',
    status: 'INACTIVE',
    createdAt: '2025-12-20T16:00:00.000Z',
    updatedAt: '2026-06-01T08:00:00.000Z',
  },
  {
    id: 'cpn-005',
    code: 'WELCOME5',
    description: 'Chào mừng thành viên mới — giảm 5%.',
    discountPercent: 5,
    usageLimit: null,
    validUntil: null,
    status: 'ACTIVE',
    createdAt: '2026-03-08T10:00:00.000Z',
    updatedAt: '2026-03-08T10:00:00.000Z',
  },
];

const dateFormatter = new Intl.DateTimeFormat('vi-VN', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

export function formatValidUntil(date) {
  if (!date) return 'Không giới hạn';
  return dateFormatter.format(new Date(date));
}

export function formatDiscount(percent) {
  return `${percent}%`;
}

export function filterCoupons(coupons, searchQuery) {
  const query = searchQuery.trim().toLowerCase();
  if (!query) return coupons;

  return coupons.filter((coupon) => {
    const haystack = [coupon.code, coupon.description]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    return haystack.includes(query);
  });
}
