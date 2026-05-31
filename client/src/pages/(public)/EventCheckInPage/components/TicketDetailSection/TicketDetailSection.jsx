import {
  Armchair,
  Clock3,
  Crown,
  ShieldCheck,
  Ticket,
  User,
} from 'lucide-react';
import StatusBadge from '../StatusBadge/StatusBadge';
import InfoRow from '../InfoRow/InfoRow';
import { formatDateTime, getShortCode } from '../../helpers';

function TicketDetailSection({
  order,
  selectedTicket,
  selectedTicketStatus,
  selectedSeatLabel,
  selectedTicketTypeName,
}) {
  return (
    <section className="rounded-3xl border border-(--text-primary)/10 bg-(--text-primary)/4 p-5 backdrop-blur-xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-(--primary-color)">
            Thông tin vé
          </p>

          <p className="mt-2 text-sm leading-6 text-(--text-primary)/55">
            Chi tiết của vé đang được chọn.
          </p>
        </div>

        <StatusBadge tone={selectedTicketStatus.tone}>
          {selectedTicketStatus.label}
        </StatusBadge>
      </div>

      <div className="mt-4">
        <InfoRow
          icon={<Crown className="size-4" />}
          label="Hạng vé"
          value={selectedTicketTypeName}
        />

        <InfoRow
          icon={<Armchair className="size-4" />}
          label="Số ghế"
          value={selectedSeatLabel}
        />

        <InfoRow
          icon={<User className="size-4" />}
          label="Người đặt"
          value={order.user?.name ?? '—'}
        />

        <InfoRow
          icon={<Ticket className="size-4" />}
          label="Mã vé"
          value={getShortCode(selectedTicket?.id)}
        />

        <InfoRow icon={<ShieldCheck className="size-4" />} label="Trạng thái">
          <StatusBadge tone={selectedTicketStatus.tone}>
            {selectedTicketStatus.label}
          </StatusBadge>
        </InfoRow>

        <InfoRow
          icon={<Clock3 className="size-4" />}
          label="Check-in"
          value={formatDateTime(selectedTicket?.checkedInAt)}
        />
      </div>
    </section>
  );
}

export default TicketDetailSection;
