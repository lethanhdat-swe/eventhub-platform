import { cn } from '@/lib/utils';

function getTrendClassName(trend) {
  if (!trend) return 'text-muted-foreground';

  const trimmed = String(trend).trim();
  if (trimmed.startsWith('+')) return 'text-emerald-600 dark:text-emerald-400';
  if (trimmed.startsWith('-')) return 'text-red-600 dark:text-red-400';

  return 'text-muted-foreground';
}

function StatsCard({ title, value, description, icon: Icon, trend, className }) {
  return (
    <div
      className={cn(
        'rounded-lg border border-border bg-card p-4',
        className
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground">{title}</p>
        {Icon ? (
          <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
            <Icon className="size-4" />
          </span>
        ) : null}
      </div>

      <p className="mt-2 truncate text-2xl leading-none font-semibold tabular-nums">
        {value}
      </p>

      {description || trend ? (
        <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs">
          {description ? (
            <span className="text-muted-foreground">{description}</span>
          ) : null}
          {trend ? (
            <span className={cn('font-medium', getTrendClassName(trend))}>
              {trend}
            </span>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export default StatsCard;
