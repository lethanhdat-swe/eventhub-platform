export const PAYMENT_TRANSACTION_STATUS_LABELS = {
  PENDING: 'Đang xử lý',
  MATCHED: 'Đã khớp',
  UNMATCHED: 'Chưa khớp',
  FAILED: 'Thất bại',
};

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

export function mapPaymentTransactionRow(row) {
  return {
    id: row.id,
    orderId: row.orderId ?? row.order?.id ?? null,
    transactionId: row.transactionId ?? '—',
    orderCode: row.orderCode ?? null,
    amount: row.amount,
    content: row.content,
    gateway: row.gateway,
    status: row.status,
    order: row.order ?? null,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}
