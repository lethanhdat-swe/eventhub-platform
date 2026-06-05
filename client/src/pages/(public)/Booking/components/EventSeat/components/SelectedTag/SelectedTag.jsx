import { isVip } from "@/utils/seatUtils";

function SelectedTag({ id, row, onRemove }) {
  return (
    <span className="flex items-center gap-1 bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-full border border-blue-200">
      {id}
      {isVip(row) && (
        <span className="text-amber-500 text-[9px] font-bold">VIP</span>
      )}
      <button
        onClick={() => onRemove(id, row)}
        className="ml-0.5 text-blue-400 hover:text-blue-700 leading-none"
        aria-label={`Bỏ chọn ${id}`}
      >
        ×
      </button>
    </span>
  );
}

export default SelectedTag