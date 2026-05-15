function OrderFilter() {
  const tabs = [
    {
      label: "Tất cả",
      value: "all",
      count: 24,
      style:
        "border-purple-500/30 bg-purple-500/10 text-purple-400",
      badge:
        "bg-purple-500/20 text-(--text-primary)",
    },
    {
      label: "Đã đặt",
      value: "booked",
      count: 8,
      style:
        "border-green-500/30 bg-green-500/10 text-green-400",
      badge:
        "bg-green-500/20 text-(--text-primary)",
    },
    {
      label: "Đang xử lý",
      value: "processing",
      count: 3,
      style:
        "border-yellow-500/30 bg-yellow-500/10 text-yellow-400",
      badge:
        "bg-yellow-500/20 text-(--text-primary)",
    },
    {
      label: "Đã huỷ",
      value: "cancelled",
      count: 2,
      style:
        "border-red-500/30 bg-red-500/10 text-red-400",
      badge:
        "bg-red-500/20 text-(--text-primary)",
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-3">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          className={`
            group relative overflow-hidden rounded-full border px-4 py-2
            transition-all duration-300 
            hover:scale-[1.03]
            ${tab.style}
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
              {tab.count}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}

export default OrderFilter;