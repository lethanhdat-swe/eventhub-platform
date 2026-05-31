function StatusBadge({ children, tone = 'neutral' }) {
  const toneClassName = {
    success: 'border-emerald-400/25 bg-emerald-400/10 text-emerald-300',
    warning: 'border-yellow-400/25 bg-yellow-400/10 text-yellow-300',
    destructive: 'border-red-400/25 bg-red-400/10 text-red-300',
    neutral:
      'border-(--text-primary)/15 bg-(--text-primary)/5 text-(--text-primary)',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${
        toneClassName[tone] ?? toneClassName.neutral
      }`}
    >
      {children}
    </span>
  );
}

export default StatusBadge;
