import {
  CalendarDays,
  Clock3,
  MapPin,
  ReceiptText,
  Ticket,
  User,
} from 'lucide-react';

import {
  formatDateTime,
  formatEventDate,
  formatMoney,
  getOrderStatusMeta,
  getSeatLabel,
} from '@/pages/(public)/EventCheckInPage/helpers';
import StatusBadge from '@/pages/(public)/EventCheckInPage/components/StatusBadge/StatusBadge';

const REFUND_STATUS_LABELS = {
  PENDING: 'Đang chờ xử lý',
  COMPLETED: 'Đã hoàn tiền',
  REJECTED: 'Từ chối',
};

function DetailRow({ icon, label, value, children }) {
  return (
    <div className="flex gap-2 border-b border-(--border-color)/40 py-2 last:border-0">
      <span className="mt-0.5 shrink-0 text-(--muted-text)">{icon}</span>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-medium uppercase tracking-wide text-(--muted-text)">
          {label}
        </p>
        <div className="mt-0.5 text-xs text-(--text-primary)">
          {children ?? value ?? '—'}
        </div>
      </div>
    </div>
  );
}

function OrderLookupResultPanel({ order }) {
  if (!order) return null;

  const orderStatus = getOrderStatusMeta(order);
  const tickets = order.tickets ?? [];
  const refundRequests = order.refundRequests ?? [];

  return (
    <div className="max-h-64 overflow-y-auto rounded-lg border border-(--border-color)/70 bg-(--soft-surface-color) px-2.5 py-2">
      <div className="mb-2 flex items-center justify-between gap-2 border-b border-(--border-color)/50 pb-2">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-(--primary-color)">
            Kết quả tra cứu
          </p>
          <p className="mt-0.5 text-xs font-medium text-(--text-primary)">
            {order.orderCode ?? '—'}
          </p>
        </div>
        <StatusBadge tone={orderStatus.tone}>{orderStatus.label}</StatusBadge>
      </div>

      <DetailRow
        icon={<User className="size-3.5" />}
        label="Khách hàng"
        value={order.customerName}
      />
      <DetailRow
        icon={<ReceiptText className="size-3.5" />}
        label="Email"
        value={order.customerEmail}
      />
      <DetailRow
        icon={<ReceiptText className="size-3.5" />}
        label="Số điện thoại"
        value={order.customerPhone}
      />

      {order.event ? (
        <>
          <DetailRow
            icon={<Ticket className="size-3.5" />}
            label="Sự kiện"
            value={order.event.title}
          />
          <DetailRow
            icon={<MapPin className="size-3.5" />}
            label="Địa điểm"
            value={order.event.location}
          />
          <DetailRow
            icon={<CalendarDays className="size-3.5" />}
            label="Thời gian"
            value={formatEventDate(
              order.event.startDate,
              order.event.endDate
            )}
          />
        </>
      ) : null}

      <DetailRow
        icon={<ReceiptText className="size-3.5" />}
        label="Tổng tiền"
        value={formatMoney(order.totalAmount)}
      />
      <DetailRow
        icon={<CalendarDays className="size-3.5" />}
        label="Ngày đặt"
        value={formatDateTime(order.createdAt)}
      />
      <DetailRow
        icon={<Clock3 className="size-3.5" />}
        label="Ngày thanh toán"
        value={formatDateTime(order.paidAt)}
      />

      {tickets.length > 0 ? (
        <div className="py-2">
          <p className="text-[10px] font-medium uppercase tracking-wide text-(--muted-text)">
            Vé ({tickets.length})
          </p>
          <ul className="mt-1.5 space-y-1">
            {tickets.map((ticket) => (
              <li
                key={ticket.id}
                className="flex items-center justify-between gap-2 rounded-md border border-(--border-color)/50 bg-(--surface-color) px-2 py-1 text-xs"
              >
                <span className="font-medium text-(--text-primary)">
                  {getSeatLabel(ticket)}
                </span>
                <span className="text-[10px] text-(--muted-text)">
                  {ticket.ticketType?.name ?? '—'}
                  {ticket.isCheckedIn ? ' · Đã check-in' : ''}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {refundRequests.length > 0 ? (
        <div className="py-2">
          <p className="text-[10px] font-medium uppercase tracking-wide text-(--muted-text)">
            Yêu cầu hoàn vé
          </p>
          <ul className="mt-1.5 space-y-1">
            {refundRequests.map((refund) => (
              <li
                key={refund.id}
                className="rounded-md border border-(--border-color)/50 bg-(--surface-color) px-2 py-1.5 text-xs"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-(--text-primary)">
                    {REFUND_STATUS_LABELS[refund.status] ?? refund.status}
                  </span>
                  <span className="text-[10px] text-(--muted-text)">
                    {formatDateTime(refund.createdAt)}
                  </span>
                </div>
                <p className="mt-0.5 text-[10px] text-(--muted-text)">
                  Hoàn {refund.refundPercent}% ·{' '}
                  {formatMoney(refund.refundAmount)}
                </p>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

export default OrderLookupResultPanel;
