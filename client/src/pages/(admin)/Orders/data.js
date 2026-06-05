export const ORDER_STATUS_LABELS = {
    PENDING: 'Đang chờ',
    PAID: 'Đã thanh toán',
    REFUNDED: 'Đã hoàn tiền',
    CANCELLED: 'Đã hủy',
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

export const ORDER_PAYMENT_LABELS = {
    SEPAY: 'SePay',
};

export function formatPaymentMethod(method) {
    if (!method) return '—';
    return ORDER_PAYMENT_LABELS[method] ?? method;
}

export function formatCouponLabel(coupon) {
    if (!coupon) return '—';
    if (typeof coupon === 'string') return coupon;
    return coupon.code ?? coupon.id ?? '—';
}

export function mapOrderRow(row) {
    return {
        id: row.id,
        userId: row.userId,
        orderCode: row.orderCode ?? '—',
        customerName: row.customerName,
        customerEmail: row.customerEmail,
        customerPhone: row.customerPhone,
        totalAmount: row.totalAmount,
        status: row.status,
        paymentMethod: row.paymentMethod,
        sepayTransactionId: row.sepayTransactionId,
        couponId: row.couponId,
        couponCode: row.coupon?.code ?? null,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
    };
}

export function formatOrderSeatLines(order) {
    const items = order.orderSeats?.length ? order.orderSeats : order.tickets;

    if (items?.length) {
        return items.map((item) => {
            const eventSeat = item.eventSeat;
            const seat = eventSeat?.seat ?? eventSeat;
            const type = eventSeat?.ticketType;
            const label =
                [seat?.rowLabel, seat?.seatNumber]
                    .filter((v) => v != null && v !== '')
                    .join('') ||
                seat?.id?.slice(0, 8) ||
                '—';

            return `${label} · ${type?.name ?? '—'}`;
        });
    }

    return [];
}
