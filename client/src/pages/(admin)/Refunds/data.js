import { ORDER_STATUS_LABELS } from '@/pages/(admin)/Orders/data';

export const REFUND_ORDER_STATUS_LABELS = {
    ...ORDER_STATUS_LABELS,
    REFUND_PENDING: 'Đang chờ hoàn tiền',
    REFUNDED: 'Đã hoàn tiền',
};

export const REFUND_STATUS_LABELS = {
    PENDING: 'Đang chờ',
    COMPLETED: 'Đã hoàn',
    REJECTED: 'Từ chối',
};

export const REFUND_STATUS_STYLES = {
    PENDING:
        'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300',
    COMPLETED:
        'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
    REJECTED:
        'border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300',
};

import { formatCurrencyIntl, formatDateTime as formatDateTimeBase } from '@/utils/formatters';

export function formatCurrency(value) {
    return formatCurrencyIntl(value);
}

export function formatDateTime(value) {
    return formatDateTimeBase(value, { layout: 'time-first' });
}

export function mapRefundRow(item) {
    return {
        id: item.id,
        orderCode: item.order?.orderCode ?? '-',
        orderStatus: item.order?.status ?? '-',
        orderTotalAmount: item.order?.totalAmount ?? 0,

        customerName: item.customerName ?? '-',
        customerEmail: item.customerEmail ?? '-',
        customerPhone: item.customerPhone ?? '-',

        bankName: item.bankName ?? '-',
        bankAccountNumber: item.bankAccountNumber ?? '-',
        bankAccountHolder: item.bankAccountHolder ?? '-',

        note: item.note ?? '',
        refundPercent: item.refundPercent ?? 0,
        refundAmount: item.refundAmount ?? 0,

        status: item.status,

        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
    };
}
