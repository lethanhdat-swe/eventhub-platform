function formatCurrency(value) {
  return Number(value || 0).toLocaleString('vi-VN') + ' đ';
}

function getTicketColor(item) {
  return item.color || 'var(--primary-color)';
}

// Mobile card view per ticket
function TicketCard({ item }) {
  const ticketColor = getTicketColor(item);

  return (
    <div className="relative space-y-2 border-b border-(--text-primary)/10 px-4 py-3 text-sm last:border-0">
      <div
        className="absolute inset-y-3 left-0 w-1 rounded-r-full"
        style={{ backgroundColor: ticketColor }}
      />

      <div className="flex items-center justify-between gap-3 pl-2">
        <span
          className="rounded-full border px-2.5 py-1 text-xs font-black uppercase"
          style={{
            color: ticketColor,
            borderColor: `color-mix(in srgb, ${ticketColor} 45%, transparent)`,
            backgroundColor: `color-mix(in srgb, ${ticketColor} 14%, transparent)`,
          }}
        >
          {item.ticketType}
        </span>

        <span className="shrink-0 font-semibold text-(--text-primary)">
          {formatCurrency(item.total)}
        </span>
      </div>

      <div className="flex items-center gap-4 pl-2 text-xs text-(--text-primary)/60">
        <span>SL: {item.quantity}</span>
        <span>Đơn giá: {formatCurrency(item.price)}</span>
      </div>

      {item.seats?.length > 0 && (
        <p className="truncate pl-2 text-xs text-(--text-primary)/50">
          Ghế: {item.seats.join(', ')}
        </p>
      )}
    </div>
  );
}

function TicketTable({ items = [] }) {
  if (items.length === 0) {
    return (
      <div className="overflow-hidden rounded-xl border border-(--text-primary)/10 bg-(--surface-color)/20">
        <p className="px-4 py-4 text-sm text-(--text-primary)/50">
          Chưa có vé nào được chọn.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-(--text-primary)/10 bg-(--surface-color)/20">
      {/* Mobile: card layout */}
      <div className="sm:hidden">
        {items.map((item, index) => (
          <TicketCard key={index} item={item} />
        ))}
      </div>

      {/* Desktop: table layout */}
      <div className="hidden sm:block">
        <div className="grid grid-cols-5 border-b border-(--text-primary)/10 px-4 py-3">
          {['Loại vé', 'Số lượng', 'Vị trí ghế', 'Đơn giá', 'Thành tiền'].map(
            (label, i) => (
              <div
                key={i}
                className={`text-xs font-medium uppercase text-(--text-primary)/60 ${
                  i === 4 ? 'text-right' : ''
                }`}
              >
                {label}
              </div>
            )
          )}
        </div>

        <div>
          {items.map((item, index) => {
            const ticketColor = getTicketColor(item);

            return (
              <div
                key={index}
                className="grid grid-cols-5 items-center px-4 py-3 text-sm transition-all duration-200 hover:bg-(--text-primary)/3"
              >
                <div>
                  <span
                    className="inline-flex rounded-full border px-2.5 py-1 text-xs font-black uppercase"
                    style={{
                      color: ticketColor,
                      borderColor: `color-mix(in srgb, ${ticketColor} 45%, transparent)`,
                      backgroundColor: `color-mix(in srgb, ${ticketColor} 14%, transparent)`,
                    }}
                  >
                    {item.ticketType}
                  </span>
                </div>

                <div className="text-(--text-primary)">{item.quantity}</div>

                <div className="truncate pr-2 text-(--text-primary)/70">
                  {item.seats.join(', ')}
                </div>

                <div className="text-(--text-primary)">
                  {formatCurrency(item.price)}
                </div>

                <div className="text-right font-semibold text-(--text-primary)">
                  {formatCurrency(item.total)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default TicketTable;
