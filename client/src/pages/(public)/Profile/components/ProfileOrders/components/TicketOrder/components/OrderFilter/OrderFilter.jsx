function OrderFilter({ value = "all", counts = {}, onChange }) {
  const tabs = [
    {
      label: "Tất cả",
      value: "all",
      style:
        "border-purple-500/30 bg-purple-500/10 text-purple-400",
      badge:
        "bg-purple-500/20 text-(--text-primary)",
    },
    {
      label: "Đã đặt",
      value: "PAID",
      style:
        "border-green-500/30 bg-green-500/10 text-green-400",
      badge:
        "bg-green-500/20 text-(--text-primary)",
    },
    {
      label: "Đang xử lý",
      value: "PENDING",
      style:
        "border-yellow-500/30 bg-yellow-500/10 text-yellow-400",
      badge:
        "bg-yellow-500/20 text-(--text-primary)",
    },
    {
      label: "Đã hủy",
      value: "CANCELLED",
      style:
        "border-red-500/30 bg-red-500/10 text-red-400",
      badge:
        "bg-red-500/20 text-(--text-primary)",
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-3">
      {tabs.map((tab) => {
        const isActive = value === tab.value;

        return (
          <button
            key={tab.value}
            type="button"
            onClick={() => onChange?.(tab.value)}
            className={`
            group relative overflow-hidden rounded-full border px-4 py-2
            transition-all duration-300 
            hover:scale-[1.03]
            ${tab.style}
            ${isActive ? "ring-1 ring-(--primary-color)/50" : "opacity-75 hover:opacity-100"}
          `}
          >
            <div className="flex items-center gap-3">
              <span className="font-medium">
                {tab.label}
              </span>

              <div
                className={`
                min-w-6 rounded-full px-2 py-0.5 text-xs font-semibold
                transition-all duration-300
                ${tab.badge}
              `}
              >
                {counts[tab.value] ?? 0}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

export default OrderFilter;