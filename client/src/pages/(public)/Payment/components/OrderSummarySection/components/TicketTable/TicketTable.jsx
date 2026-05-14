
function TicketTable({ items }) {
  return (
    <div className="overflow-hidden rounded-xl border border-(--primary-color)/20 bg-[linear-gradient(135deg,rgba(255,255,255,0.03),rgba(168,85,247,0.08))] backdrop-blur-2xl shadow-[0_0_40px_rgba(168,85,247,0.15)]">
      {/* Header */}
      <div className="grid grid-cols-5 px-8 py-5 border-b border-(--text-primary)/10">
        <div className="text-sm font-medium uppercase text-(--text-primary)">
          Loại vé
        </div>

        <div className="text-sm font-medium uppercase text-(--text-primary)">
          Số lượng
        </div>

        <div className="text-sm font-medium uppercase text-(--text-primary)">
          Vị trí ghế
        </div>

        <div className="text-sm font-medium uppercase text-(--text-primary)">
          Đơn giá
        </div>

        <div className="text-right text-sm font-medium uppercase text-(--text-primary)">
          Thành tiền
        </div>
      </div>

      {/* Body */}
      <div>
        {items.map((item, index) => (
          <div
            key={index}
            className="grid items-center grid-cols-5 px-8 transition-all duration-300 py-2 hover:bg-(--text-primary)/3"
          >
            {/* Ticket Type */}
            <div className="text-[18px] font-semibold text-(--text-primary)">
              {item.ticketType}
            </div>

            {/* Quantity */}
            <div className="text-[18px] font-medium text-(--text-primary)">
              {item.quantity}
            </div>

            {/* Seats */}
            <div className="text-[18px] font-medium text-(--text-primary)">
              {item.seats.join(", ")}
            </div>

            {/* Price */}
            <div className="text-[18px] font-medium text-(--text-primary)">
              {item.price.toLocaleString("vi-VN")} đ
            </div>

            {/* Total */}
            <div className="text-[18px] font-bold text-right text-(--primary-color)">
              {item.total.toLocaleString("vi-VN")} đ
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TicketTable;