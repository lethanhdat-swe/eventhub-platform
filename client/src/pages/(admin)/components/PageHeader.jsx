import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

function PageHeader({
  title,
  description,
  actionLabel,
  onAction,
  actionIcon,
  actions,
  className,
}) {
  const showLegacyAction = actionLabel && onAction && !actions;

  return (
    <div
      className={cn(
        'flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between',
        className
      )}
    >
      <div className="min-w-0">
        <h1 className="text-lg font-semibold leading-tight tracking-tight truncate sm:text-xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-0.5 line-clamp-2 text-sm text-muted-foreground sm:line-clamp-none">
            {description}
          </p>
        ) : null}
      </div>

      {actions ? (
        <div className="flex flex-wrap items-center gap-2 shrink-0 sm:justify-end">
          {actions}
        </div>
      ) : null}

      {showLegacyAction ? (
        <Button
          type="button"
          onClick={onAction}
          className="h-9 w-full shrink-0 gap-1.5 px-3 text-sm sm:w-auto"
        >
          {actionIcon}
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}

export default PageHeader;