import { ROWS } from "@/constants/seatConfig";
import SeatRow from "../SeatRow/SeatRow";

function SeatGrid({ selected, onToggle }) {
  return (
    <div className="pb-2">
      <div className="flex flex-col gap-1.5">
        {ROWS.map((row) => (
          <span key={row}>
            {row === "A" && (
              <p className="text-center text-[10px] text-amber-600 tracking-widest mb-1 font-medium">
                ★ KHU VIP ★
              </p>
            )}
            {row === "C" && (
              <p className="text-center text-[10px] text-gray-400 tracking-widest mb-1 mt-1">
                ── HÀNG THƯỜNG ──
              </p>
            )}
            <SeatRow row={row} selected={selected} onToggle={onToggle} />
          </span>
        ))}
      </div>
    </div>
  );
}

export default SeatGrid