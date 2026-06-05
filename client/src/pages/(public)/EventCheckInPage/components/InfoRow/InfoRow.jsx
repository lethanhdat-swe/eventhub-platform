function InfoRow({ icon, label, value, children }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-(--text-primary)/10 py-3 last:border-0">
      <div className="flex min-w-0 items-center gap-3 text-(--text-primary)/55">
        <span className="shrink-0 rounded-xl bg-(--primary-color)/10 p-2 text-(--primary-color)">
          {icon}
        </span>

        <span className="text-xs font-semibold uppercase tracking-[0.18em]">
          {label}
        </span>
      </div>

      <div className="max-w-[58%] text-right text-sm font-semibold text-(--text-primary)">
        {children ?? value ?? '—'}
      </div>
    </div>
  );
}

export default InfoRow;
