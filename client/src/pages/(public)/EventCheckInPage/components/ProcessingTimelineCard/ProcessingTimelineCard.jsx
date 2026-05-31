import { formatDateTime } from '../../helpers';
import TimelineItem from '../TimelineItem/TimelineItem';

function ProcessingTimelineCard({
  isPaid,
  hasTickets,
  tickets,
  selectedTicket,
  orderStatus,
}) {
  return (
    <section className="rounded-3xl border border-(--text-primary)/10 bg-(--text-primary)/4 p-5 backdrop-blur-xl">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-(--primary-color)">
        Trạng thái xử lý
      </p>

      <div className="mt-5 space-y-4">
        <TimelineItem
          active={isPaid}
          tone={orderStatus.tone}
          label="Thanh toán"
          description={orderStatus.description}
        />

        <TimelineItem
          active={hasTickets}
          tone={hasTickets ? 'success' : isPaid ? 'warning' : 'destructive'}
          label="Phát hành vé"
          description={
            hasTickets
              ? `${tickets.length} vé đã được phát hành.`
              : isPaid
                ? 'Đơn hàng đã thanh toán nhưng chưa có vé.'
                : 'Đơn hàng không thành công nên không phát hành vé.'
          }
        />

        <TimelineItem
          active={Boolean(selectedTicket?.isCheckedIn)}
          tone={selectedTicket?.isCheckedIn ? 'destructive' : 'neutral'}
          label="Check-in"
          description={
            selectedTicket?.isCheckedIn
              ? selectedTicket.checkedInAt
                ? `Đã check-in lúc ${formatDateTime(selectedTicket.checkedInAt)}`
                : 'Vé đã được sử dụng.'
              : hasTickets
                ? 'Vé chưa được check-in.'
                : 'Không có vé để check-in.'
          }
        />
      </div>
    </section>
  );
}

export default ProcessingTimelineCard;
