import { fmt, seatPrice, isVip } from "@/utils/seatUtils";

function BookingPanel({ selected, onRemove }) {
  const seats = [...selected].sort();
  const total = seats.reduce((sum, id) => sum + seatPrice(id[0]), 0);

  return (
    <div className="space-y-3">

      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <p className="text-(--text-primary) font-semibold uppercase tracking-wider text-sm">
          Ghế đã chọn ({seats.length})
        </p>
        {seats.length > 0 && (
          <button
            onClick={() => seats.forEach((id) => onRemove(id, id[0]))}
            className="flex items-center gap-1 text-xs text-pink-500 transition-colors hover:text-pink-400"
          >
            🗑 Xóa tất cả
          </button>
        )}
      </div>

      {/* Seat list */}
      {seats.length === 0 ? (
        <p className="text-(--text-primary)/40 text-sm py-4 text-center">
          Chưa chọn ghế nào
        </p>
      ) : (
        <div className="space-y-2">
          {seats.map((id) => (
            <div
              key={id}
              className="flex items-center justify-between bg-(--background-color) border border-(--text-primary)/10 rounded-xl px-4 py-3"
            >
              <div className="flex flex-col">
                <span className="text-xs font-medium" style={{ color: "var(--primary-color)" }}>
                  {isVip(id[0]) ? "VIP" : "GA"}
                </span>
                <span className="text-(--text-primary) text-xl font-bold">{id}</span>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-(--text-primary) font-medium">
                  {fmt(seatPrice(id[0]))}
                </span>
                <button
                  onClick={() => onRemove(id, id[0])}
                  className="text-lg leading-none text-pink-500 transition-colors hover:text-pink-400"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Total */}
      {seats.length > 0 && (
        <div className="bg-(--background-color) border border-(--text-primary)/10 rounded-xl px-4 py-4 mt-2">
          <p className="text-(--text-primary)/60 text-sm mb-1">
            Tổng tiền ({seats.length} vé)
          </p>
          <p className="text-3xl font-bold" style={{ color: "var(--primary-color)" }}>
            {fmt(total)}
          </p>
        </div>
      )}

    </div>
  );
}

export default BookingPanel;