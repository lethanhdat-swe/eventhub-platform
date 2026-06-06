export const PAYMENT_TRANSACTION_STATUS_LABELS = {
  PENDING: 'Đang xử lý',
  MATCHED: 'Đã khớp',
  UNMATCHED: 'Chưa khớp',
  FAILED: 'Thất bại',
};

export {
  formatCreatedAt,
  formatPriceVnd,
} from '@/utils/formatters';

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
