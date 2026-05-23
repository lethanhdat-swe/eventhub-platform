
function formatCurrency(value) {
  return Number(value || 0).toLocaleString("vi-VN") + " đ";
}

function TicketTable({ items = [] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-(--text-primary)/10 bg-(--surface-color)/20">
      <div className="grid grid-cols-5 px-4 py-3 border-b border-(--text-primary)/10">
        <div className="text-xs font-medium uppercase text-(--text-primary)/60">
          Loại vé
        </div>

        <div className="text-xs font-medium uppercase text-(--text-primary)/60">
          Số lượng
        </div>

        <div className="text-xs font-medium uppercase text-(--text-primary)/60">
          Vị trí ghế
        </div>

        <div className="text-xs font-medium uppercase text-(--text-primary)/60">
          Đơn giá
        </div>

        <div className="text-right text-xs font-medium uppercase text-(--text-primary)/60">
          Thành tiền
        </div>
      </div>

      <div>
        {items.length === 0 ? (
          <p className="px-4 py-4 text-sm text-(--text-primary)/50">
            Chưa có vé nào được chọn.
          </p>
        ) : (
        items.map((item, index) => (
          <div
            key={index}
            className="grid items-center grid-cols-5 px-4 py-3 text-sm transition-all duration-200 hover:bg-(--text-primary)/3"
          >
            <div className="font-medium text-(--text-primary)">
              {item.ticketType}
            </div>

            <div className="text-(--text-primary)">
              {item.quantity}
            </div>

            <div className="text-(--text-primary)/70">
              {item.seats.join(", ")}
            </div>

            <div className="text-(--text-primary)">
              {formatCurrency(item.price)}
            </div>

            <div className="font-semibold text-right text-(--text-primary)">
              {formatCurrency(item.total)}
            </div>
          </div>
        )))}
      </div>
    </div>
  );
}

export default TicketTable;