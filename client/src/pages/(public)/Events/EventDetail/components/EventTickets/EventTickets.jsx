function EventTickets({ tickets = [], isEnded = false }) {
  if (!tickets.length) return null;

  return (
    <section
      className={`mt-4 rounded-2xl border border-(--border-color) bg-(--card-surface-color) p-4 shadow-xl shadow-black/10 backdrop-blur-xl ${
        isEnded ? 'opacity-80' : ''
      }`}
    >
      <div className="mb-3">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-(--muted-text)">
          Vé tham dự
        </p>

        <h2 className="mt-1 text-sm font-bold text-(--text-primary)">
          Loại vé hiện có
        </h2>

        {isEnded ? (
          <p className="mt-1 text-xs text-(--muted-text)">Chỉ xem tham khảo</p>
        ) : null}
      </div>

      <div className="space-y-2.5">
        {tickets.map((ticket) => (
          <div
            key={ticket.id}
            className={`flex items-start justify-between gap-3 rounded-xl border border-(--border-color) bg-(--soft-surface-color) p-3 ${
              isEnded ? 'opacity-70' : 'transition-colors hover:bg-(--card-hover-color)'
            }`}
          >
            <div className="flex min-w-0 items-start gap-3">
              <span
                className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: ticket.color }}
              />

              <div className="min-w-0">
                <h3 className="truncate text-sm font-bold text-(--text-primary)">
                  {ticket.name}
                </h3>
              </div>
            </div>

            <p className="shrink-0 text-sm font-black text-(--text-primary)">
              {Number(ticket.price ?? 0).toLocaleString('vi-VN')} ₫
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default EventTickets;
