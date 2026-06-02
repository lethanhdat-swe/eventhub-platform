import { Button } from '@/components/ui/button';

function RefundErrorAlert({
  error,
  hasData,
  onRetry,
}) {
  if (!error || !hasData) return null;

  return (
    <div
      className="flex flex-col gap-2 px-3 py-2 border rounded-lg border-destructive/25 bg-destructive/5 sm:flex-row sm:items-center sm:justify-between"
      role="alert"
    >
      <p className="text-sm text-destructive">
        {error}
      </p>

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-8 shrink-0"
        onClick={onRetry}
      >
        Thử lại
      </Button>
    </div>
  );
}

export default RefundErrorAlert;