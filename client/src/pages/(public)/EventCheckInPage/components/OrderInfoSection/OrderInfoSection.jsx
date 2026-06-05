import {
  CalendarDays,
  Clock3,
  ReceiptText,
  ShieldCheck,
  Ticket,
} from 'lucide-react';
import StatusBadge from '../StatusBadge/StatusBadge';
import InfoRow from '../InfoRow/InfoRow';
import { formatDateTime, formatMoney } from '../../helpers';

function OrderInfoSection({ order, tickets, orderStatus }) {
  return (
    <section className="rounded-3xl border border-(--text-primary)/10 bg-(--text-primary)/4 p-5 backdrop-blur-xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-(--primary-color)">
            Thông tin đơn hàng
          </p>

          <p className="mt-2 text-sm leading-6 text-(--text-primary)/55">
            Tổng quan thanh toán và thời gian tạo đơn.
          </p>
        </div>

        <StatusBadge tone={orderStatus.tone}>{orderStatus.label}</StatusBadge>
      </div>

      <div className="mt-4">
        <InfoRow
          icon={<ReceiptText className="size-4" />}
          label="Mã đơn"
          value={order.orderCode}
        />

        <InfoRow icon={<ShieldCheck className="size-4" />} label="Thanh toán">
          <StatusBadge tone={orderStatus.tone}>{orderStatus.label}</StatusBadge>
        </InfoRow>

        <InfoRow
          icon={<Ticket className="size-4" />}
          label="Số lượng"
          value={`${tickets.length} vé`}
        />

        <InfoRow
          icon={<ReceiptText className="size-4" />}
          label="Tổng tiền"
          value={formatMoney(order.totalAmount)}
        />

        <InfoRow
          icon={<ReceiptText className="size-4" />}
          label="Thành tiền"
          value={formatMoney(order.finalAmount)}
        />

        <InfoRow
          icon={<CalendarDays className="size-4" />}
          label="Ngày đặt"
          value={formatDateTime(order.createdAt)}
        />

        <InfoRow
          icon={<Clock3 className="size-4" />}
          label="Ngày thanh toán"
          value={formatDateTime(order.paidAt)}
        />
      </div>
    </section>
  );
}

export default OrderInfoSection;
