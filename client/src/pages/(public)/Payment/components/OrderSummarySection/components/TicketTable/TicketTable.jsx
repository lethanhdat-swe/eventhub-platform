function formatCurrency(value) {
  return Number(value || 0).toLocaleString("vi-VN") + " đ";
}

// Mobile card view per ticket
function TicketCard({ item }) {
  return (
    <div className="px-4 py-3 space-y-2 border-b border-(--text-primary)/10 last:border-0 text-sm">
      <div className="flex items-center justify-between">
        <span className="font-medium text-(--text-primary)">{item.ticketType}</span>
        <span className="font-semibold text-(--text-primary)">{formatCurrency(item.total)}</span>
      </div>
      <div className="flex items-center gap-4 text-(--text-primary)/60 text-xs">
        <span>SL: {item.quantity}</span>
        <span>Đơn giá: {formatCurrency(item.price)}</span>
      </div>
      {item.seats?.length > 0 && (
        <p className="text-xs text-(--text-primary)/50 truncate">Ghế: {item.seats.join(", ")}</p>
      )}
    </div>
  );
}

function TicketTable({ items = [] }) {
  if (items.length === 0) {
    return (
      <div className="overflow-hidden rounded-xl border border-(--text-primary)/10 bg-(--surface-color)/20">
        <p className="px-4 py-4 text-sm text-(--text-primary)/50">Chưa có vé nào được chọn.</p>
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
        <div className="grid grid-cols-5 px-4 py-3 border-b border-(--text-primary)/10">
          {['Loại vé', 'Số lượng', 'Vị trí ghế', 'Đơn giá', 'Thành tiền'].map((label, i) => (
            <div key={i} className={`text-xs font-medium uppercase text-(--text-primary)/60 ${i === 4 ? 'text-right' : ''}`}>
              {label}
            </div>
          ))}
        </div>

        <div>
          {items.map((item, index) => (
            <div
              key={index}
              className="grid items-center grid-cols-5 px-4 py-3 text-sm transition-all duration-200 hover:bg-(--text-primary)/3"
            >
              <div className="font-medium text-(--text-primary)">{item.ticketType}</div>
              <div className="text-(--text-primary)">{item.quantity}</div>
              <div className="text-(--text-primary)/70 truncate pr-2">{item.seats.join(", ")}</div>
              <div className="text-(--text-primary)">{formatCurrency(item.price)}</div>
              <div className="font-semibold text-right text-(--text-primary)">{formatCurrency(item.total)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TicketTable;