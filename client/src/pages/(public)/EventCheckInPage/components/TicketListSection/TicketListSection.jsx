import StatusBadge from '../StatusBadge/StatusBadge';

function TicketListSection({
  tickets,
  ticketItems,
  selectedTicket,
  hasTickets,
  isPaid,
  onSelectTicket,
}) {
  return (
    <section className="rounded-3xl border border-(--text-primary)/10 bg-(--text-primary)/4 p-4 backdrop-blur-xl sm:p-5">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-(--primary-color)">
            Danh sách vé
          </p>

          <h2 className="mt-1 text-xl font-bold text-(--text-primary)">
            {hasTickets
              ? `${tickets.length} vé trong đơn hàng`
              : isPaid
                ? 'Chưa phát hành vé'
                : 'Không có vé được phát hành'}
          </h2>
        </div>
      </div>

      {hasTickets ? (
        <div className="flex gap-3 pb-1 overflow-x-auto lg:grid lg:grid-cols-2 lg:overflow-visible">
          {ticketItems.map(({ ticket, index, seatLabel, status }) => {
            const isActive = selectedTicket?.id === ticket.id;

            return (
              <button
                key={ticket.id}
                type="button"
                onClick={() => onSelectTicket(ticket.id)}
                className={`min-w-57.5 cursor-pointer rounded-2xl border p-4 text-left transition-all ${
                  isActive
                    ? 'border-(--primary-color)/60 bg-(--primary-color)/12 shadow-[0_0_28px_rgba(168,85,247,0.18)]'
                    : 'border-(--text-primary)/10 bg-black/15 hover:border-(--primary-color)/30'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-(--text-primary)">
                    Vé {index + 1}
                  </p>

                  <StatusBadge tone={status.tone}>{status.label}</StatusBadge>
                </div>

                <p className="mt-4 text-2xl font-bold text-(--text-primary)">
                  Ghế {seatLabel}
                </p>

                <div className="mt-2 flex items-center gap-2 text-sm text-(--text-primary)/55">
                  {ticket.ticketType?.color ? (
                    <span
                      className="size-2.5 rounded-full"
                      style={{
                        backgroundColor: ticket.ticketType.color,
                      }}
                    />
                  ) : null}

                  <span>{ticket.ticketType?.name ?? '—'}</span>
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <div
          className={`rounded-2xl border p-5 text-sm leading-6 ${
            isPaid
              ? 'border-yellow-400/20 bg-yellow-400/10 text-yellow-200'
              : 'border-red-400/20 bg-red-400/10 text-red-400'
          }`}
        >
          {isPaid
            ? 'Đơn hàng đã thanh toán nhưng chưa có dữ liệu vé. Đây có thể là lỗi phát hành vé, vui lòng thử tải lại hoặc liên hệ hỗ trợ.'
            : 'Đơn hàng chưa thanh toán thành công nên hệ thống không phát hành vé check-in.'}
        </div>
      )}
    </section>
  );
}

export default TicketListSection;
