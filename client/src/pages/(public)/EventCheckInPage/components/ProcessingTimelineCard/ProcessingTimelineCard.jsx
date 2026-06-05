import {
  formatDateTime,
  hasCompletedPayment,
  isPaidOrder,
} from '../../helpers';
import TimelineItem from '../TimelineItem/TimelineItem';

function ProcessingTimelineCard({
  order,
  hasTickets,
  tickets,
  selectedTicket,
  orderStatus,
}) {
  const paymentCompleted = hasCompletedPayment(order);
  const orderStatusKey = order?.status;

  const paymentDescription = isPaidOrder(order)
    ? orderStatus.description
    : paymentCompleted
      ? order?.paidAt
        ? `Đơn hàng đã thanh toán lúc ${formatDateTime(order.paidAt)}.`
        : 'Đơn hàng đã được thanh toán thành công.'
      : orderStatus.description;

  const showRefundStep =
    orderStatusKey === 'REFUND_PENDING' || orderStatusKey === 'REFUNDED';

  return (
    <section className="rounded-3xl border border-(--text-primary)/10 bg-(--text-primary)/4 p-5 backdrop-blur-xl">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-(--primary-color)">
        Trạng thái xử lý
      </p>

      <div className="mt-5 space-y-4">
        <TimelineItem
          active={paymentCompleted}
          tone={paymentCompleted ? 'success' : orderStatus.tone}
          label="Thanh toán"
          description={paymentDescription}
        />

        <TimelineItem
          active={hasTickets}
          tone={
            hasTickets ? 'success' : paymentCompleted ? 'warning' : 'destructive'
          }
          label="Phát hành vé"
          description={
            hasTickets
              ? `${tickets.length} vé đã được phát hành.`
              : paymentCompleted
                ? 'Đơn hàng đã thanh toán nhưng chưa có vé.'
                : 'Đơn hàng không thành công nên không phát hành vé.'
          }
        />

        <TimelineItem
          active={Boolean(selectedTicket?.isCheckedIn)}
          tone={selectedTicket?.isCheckedIn ? 'destructive' : 'neutral'}
          label="Check-in"
          description={
            orderStatusKey === 'REFUNDED'
              ? 'Vé không còn hiệu lực do đơn hàng đã hoàn tiền.'
              : orderStatusKey === 'REFUND_PENDING'
                ? 'Vé tạm thời không thể check-in trong khi chờ hoàn tiền.'
                : selectedTicket?.isCheckedIn
                  ? selectedTicket.checkedInAt
                    ? `Đã check-in lúc ${formatDateTime(selectedTicket.checkedInAt)}`
                    : 'Vé đã được sử dụng.'
                  : hasTickets
                    ? 'Vé chưa được check-in.'
                    : 'Không có vé để check-in.'
          }
        />

        {showRefundStep ? (
          <TimelineItem
            active
            tone={
              orderStatusKey === 'REFUNDED' ? 'destructive' : 'warning'
            }
            label="Hoàn tiền"
            description={
              orderStatusKey === 'REFUNDED'
                ? 'Đã hoàn tiền thành công. Vé không còn sử dụng được.'
                : 'Yêu cầu hoàn vé đang chờ quản trị viên xử lý.'
            }
          />
        ) : null}
      </div>
    </section>
  );
}

export default ProcessingTimelineCard;
