import EmptyQrState from '../EmptyQrState/EmptyQrState';
import ExportPdf from '../ExportPdf/ExportPdf';
import StatusBadge from '../StatusBadge/StatusBadge';

function QrCheckInCard({
  order,
  isPaid,
  hasTickets,
  qrUrl,
  selectedTicketStatus,
  selectedSeatLabel,
  selectedTicketTypeName,
}) {
  return (
    <section className="overflow-hidden rounded-3xl border border-(--primary-color)/25 bg-[#080B16]/90 p-5 shadow-[0_0_42px_rgba(168,85,247,0.14)] backdrop-blur-xl">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-(--primary-color)">
            Mã check-in
          </p>

          <h2 className="mt-1 text-2xl font-bold text-(--text-primary)">
            {selectedTicketStatus.title}
          </h2>

          <p className="mt-2 text-sm leading-6 text-(--text-primary)/55">
            {selectedTicketStatus.description}
          </p>
        </div>

        <StatusBadge tone={selectedTicketStatus.tone}>
          {selectedTicketStatus.label}
        </StatusBadge>
      </div>

      <div
        className={`rounded-3xl p-4 ${
          qrUrl
            ? 'bg-white'
            : 'border border-(--text-primary)/10 bg-(--text-primary)/5'
        }`}
      >
        {qrUrl ? (
          <img
            src={qrUrl}
            alt="QR check-in"
            className="mx-auto aspect-square w-full max-w-[320px] rounded-2xl object-contain"
          />
        ) : (
          <EmptyQrState status={selectedTicketStatus} />
        )}
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 rounded-2xl border border-(--text-primary)/10 bg-(--text-primary)/5 p-4">
        <div>
          <p className="text-xs text-(--text-primary)/45">Ghế</p>

          <p className="mt-1 text-lg font-bold text-(--text-primary)">
            {selectedSeatLabel}
          </p>
        </div>

        <div>
          <p className="text-xs text-(--text-primary)/45">Hạng vé</p>

          <p className="mt-1 text-lg font-bold text-(--text-primary)">
            {selectedTicketTypeName}
          </p>
        </div>
      </div>

      <ExportPdf
        orderId={order?.id}
        orderCode={order?.orderCode}
        disabled={!isPaid || !hasTickets}
      />
    </section>
  );
}

export default QrCheckInCard;
