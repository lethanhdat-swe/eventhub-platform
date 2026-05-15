import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

function PageHeader({
  title,
  description,
  actionLabel,
  onAction,
  actionIcon,
  className,
}) {
  const showAction = actionLabel && onAction;

  return (
    <div
      className={cn(
        'flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between',
        className
      )}
    >
      <div className="min-w-0">
        <h1 className="text-xl leading-tight font-semibold tracking-tight">
          {title}
        </h1>
        {description ? (
          <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>

      {showAction ? (
        <Button
          type="button"
          onClick={onAction}
          className="h-9 shrink-0 gap-1.5 px-3 text-sm"
        >
          {actionIcon}
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}

export default PageHeader;
