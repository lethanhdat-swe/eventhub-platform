import { TAKEN } from "@/constants/seatConfig";
import { fmt, isVip, seatPrice } from "@/utils/seatUtils";

function SeatCell({ id, row, selected, onToggle }) {
  const taken = TAKEN.has(id);
  const isSelected = selected.has(id);
  const vip = isVip(row);
 
  const base =
    "w-7 h-6 rounded-t-md rounded-b-sm text-[9px] font-medium flex items-center justify-center border transition-transform duration-100 select-none flex-shrink-0";
 
  const style = taken
    ? "bg-gray-100 border-gray-200 opacity-40 cursor-not-allowed"
    : isSelected
    ? vip
      ? "bg-amber-500 border-amber-700 text-white cursor-pointer scale-105"
      : "bg-blue-500 border-blue-700 text-white cursor-pointer scale-105"
    : vip
    ? "bg-amber-50 border-amber-400 text-amber-800 cursor-pointer hover:scale-110"
    : "bg-blue-50 border-blue-400 text-blue-800 cursor-pointer hover:scale-110";
 
  return (
    <div
      role="checkbox"
      aria-checked={isSelected}
      aria-disabled={taken}
      aria-label={`Ghế ${id}${vip ? " VIP" : ""}${taken ? " – Đã đặt" : ""}`}
      title={taken ? `${id} – Đã đặt` : `${id} – ${fmt(seatPrice(row))}`}
      className={`${base} ${style}`}
      onClick={() => !taken && onToggle(id, row)}
    />
  );
}

export default SeatCell