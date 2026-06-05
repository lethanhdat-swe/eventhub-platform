const LEGEND = [
  { label: "Còn trống", cls: "bg-blue-50 border-blue-400" },
  { label: "VIP", cls: "bg-amber-50 border-amber-400" },
  { label: "Đang chọn", cls: "bg-blue-500 border-blue-700" },
  { label: "Đã đặt", cls: "bg-gray-100 border-gray-200 opacity-40" },
];
 
function Legend() {
  return (
    <div className="flex flex-wrap justify-center gap-3 mb-4">
      {LEGEND.map(({ label, cls }) => (
        <div key={label} className="flex items-center gap-1.5">
          <div className={`w-3.5 h-3 rounded border ${cls}`} />
          <span className="text-xs text-gray-500">{label}</span>
        </div>
      ))}
    </div>
  );
}

export default Legend