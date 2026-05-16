export const ORDER_STATUS_LABELS = {
  pending: 'Đang chờ',
  paid: 'Đã thanh toán',
  cancelled: 'Đã hủy',
  refunded: 'Đã hoàn tiền',
};

export const MOCK_ORDERS = [
  {
    id: 'ord-001',
    userId: 'user-001',
    orderCode: 'EH-2026-0001',
    customerName: 'Nguyễn Văn An',
    customerEmail: 'an.nguyen@email.com',
    customerPhone: '0901234567',
    totalAmount: 2_500_000,
    status: 'paid',
    paymentMethod: 'SEPAY',
    sepayTransactionId: 'SEPAY-TX-88421',
    couponId: null,
    createdAt: '2026-06-10T14:30:00.000Z',
    updatedAt: '2026-06-10T14:32:00.000Z',
  },
  {
    id: 'ord-002',
    userId: 'user-002',
    orderCode: 'EH-2026-0002',
    customerName: 'Trần Thị Bình',
    customerEmail: 'binh.tran@email.com',
    customerPhone: '0912345678',
    totalAmount: 800_000,
    status: 'pending',
    paymentMethod: 'SEPAY',
    sepayTransactionId: null,
    couponId: 'cpn-001',
    createdAt: '2026-06-12T09:15:00.000Z',
    updatedAt: '2026-06-12T09:15:00.000Z',
  },
  {
    id: 'ord-003',
    userId: 'user-003',
    orderCode: 'EH-2026-0003',
    customerName: 'Lê Minh Châu',
    customerEmail: 'chau.le@email.com',
    customerPhone: '0923456789',
    totalAmount: 500_000,
    status: 'paid',
    paymentMethod: 'SEPAY',
    sepayTransactionId: 'SEPAY-TX-88455',
    couponId: 'cpn-002',
    createdAt: '2026-05-05T11:00:00.000Z',
    updatedAt: '2026-05-05T11:02:00.000Z',
  },
  {
    id: 'ord-004',
    userId: 'user-004',
    orderCode: 'EH-2026-0004',
    customerName: 'Phạm Hoàng Dũng',
    customerEmail: 'dung.pham@email.com',
    customerPhone: '0934567890',
    totalAmount: 2_500_000,
    status: 'cancelled',
    paymentMethod: 'SEPAY',
    sepayTransactionId: null,
    couponId: null,
    createdAt: '2026-06-01T16:45:00.000Z',
    updatedAt: '2026-06-02T08:00:00.000Z',
  },
  {
    id: 'ord-005',
    userId: 'user-005',
    orderCode: 'EH-2026-0005',
    customerName: 'Võ Thị Em',
    customerEmail: 'em.vo@email.com',
    customerPhone: '0945678901',
    totalAmount: 800_000,
    status: 'refunded',
    paymentMethod: 'SEPAY',
    sepayTransactionId: 'SEPAY-TX-88301',
    couponId: null,
    createdAt: '2026-05-20T10:20:00.000Z',
    updatedAt: '2026-05-22T15:00:00.000Z',
  },
  {
    id: 'ord-006',
    userId: 'user-006',
    orderCode: 'EH-2026-0006',
    customerName: 'Đặng Quốc Phong',
    customerEmail: 'phong.dang@email.com',
    customerPhone: '0956789012',
    totalAmount: 1_200_000,
    status: 'paid',
    paymentMethod: 'SEPAY',
    sepayTransactionId: 'SEPAY-TX-88512',
    couponId: 'cpn-003',
    createdAt: '2026-06-08T13:10:00.000Z',
    updatedAt: '2026-06-08T13:12:00.000Z',
  },
];

const priceFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat('vi-VN', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

export function formatPriceVnd(price) {
  if (price == null) return '—';
  return priceFormatter.format(price);
}

export function formatCreatedAt(date) {
  if (!date) return '—';
  return dateFormatter.format(new Date(date));
}

export const ORDER_PAYMENT_LABELS = {
  SEPAY: 'SePay',
};

export function filterOrders(orders, searchQuery, facets = {}) {
  let list = orders;
  const query = (searchQuery ?? '').trim().toLowerCase();
  if (query) {
    list = list.filter((order) => {
      const haystack = [
        order.orderCode,
        order.customerName,
        order.customerEmail,
        order.customerPhone,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return haystack.includes(query);
    });
  }

  const { status, paymentMethod } = facets;
  if (status && status !== 'all') {
    list = list.filter((order) => order.status === status);
  }
  if (paymentMethod && paymentMethod !== 'all') {
    list = list.filter((order) => order.paymentMethod === paymentMethod);
  }

  return list;
}
