import { Inbox } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

function AdminEmptyState({
  icon: Icon = Inbox,
  title,
  description,
  actionLabel,
  onAction,
  className,
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-lg border border-border bg-card px-6 py-12 text-center',
        className
      )}
    >
      <span className="mb-3 flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <Icon className="size-8" aria-hidden />
      </span>
      <h3 className="text-base font-semibold">{title}</h3>
      {description ? (
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          {description}
        </p>
      ) : null}
      {actionLabel && onAction ? (
        <Button
          type="button"
          className="mt-4 h-9 cursor-pointer"
          onClick={onAction}
        >
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}

export default AdminEmptyState;
