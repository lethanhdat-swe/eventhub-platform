import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

function AdminErrorState({
  message,
  onRetry,
  retryLabel = 'Thử lại',
  compact = false,
  className,
}) {
  if (!message) return null;

  return (
    <div
      className={cn(
        'border border-destructive/25 bg-destructive/5 text-destructive',
        compact
          ? 'space-y-2 rounded-xl p-4 text-sm'
          : 'flex flex-col gap-2 rounded-lg px-3 py-2 sm:flex-row sm:items-center sm:justify-between',
        className
      )}
      role="alert"
    >
      <p className={compact ? undefined : 'text-sm text-destructive'}>
        {message}
      </p>

      {onRetry ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className={cn(
            'shrink-0',
            compact
              ? 'h-8 border-destructive/30 text-destructive hover:bg-destructive/10'
              : 'h-8'
          )}
          onClick={onRetry}
        >
          {retryLabel}
        </Button>
      ) : null}
    </div>
  );
}

export default AdminErrorState;
