import { SEATS_PER_ROW } from "@/constants/seatConfig";
import SeatCell from "../SeatCell/SeatCell";

function SeatRow({ row, selected, onToggle }) {
  return (
    <div className="flex items-center gap-1.5 justify-center">
      <span className="w-4 text-right text-[11px] text-gray-400 shrink-0">
        {row}
      </span>
      {Array.from({ length: SEATS_PER_ROW }, (_, i) => {
        const seatNum = i + 1;
        const id = `${row}${seatNum}`;
        return (
          <span key={id} className="flex items-center gap-1.5">
            {seatNum === 7 && <span className="w-4 shrink-0" />}
            <SeatCell id={id} row={row} selected={selected} onToggle={onToggle} />
          </span>
        );
      })}
    </div>
  );
}

export default SeatRow