import { CheckCircle2, Circle } from 'lucide-react';

function TimelineItem({ active, tone = 'neutral', label, description }) {
  const Icon = active ? CheckCircle2 : Circle;

  const activeToneClassName = {
    success: 'text-emerald-300',
    warning: 'text-yellow-300',
    destructive: 'text-red-300',
    neutral: 'text-emerald-300',
  };

  const iconClassName = active
    ? (activeToneClassName[tone] ?? activeToneClassName.neutral)
    : 'text-(--text-primary)/30';

  return (
    <div className="flex gap-3">
      <Icon className={`mt-0.5 size-5 shrink-0 ${iconClassName}`} />

      <div>
        <p className="text-sm font-semibold text-(--text-primary)">{label}</p>
        <p className="mt-0.5 text-xs leading-5 text-(--text-primary)/50">
          {description}
        </p>
      </div>
    </div>
  );
}

export default TimelineItem;
