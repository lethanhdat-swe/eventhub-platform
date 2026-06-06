import { Loader2 } from 'lucide-react';

import { cn } from '@/lib/utils';

function PublicLoadingState({
  label = 'Đang tải...',
  minHeight = 'min-h-[60vh]',
  className,
}) {
  return (
    <div
      className={cn('flex items-center justify-center px-5', minHeight, className)}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="flex items-center gap-3 rounded-2xl border border-(--border-color) bg-(--card-surface-color) px-6 py-4 text-sm text-(--muted-text)">
        <Loader2
          className="size-4 shrink-0 animate-spin text-(--primary-color)"
          aria-hidden
        />
        <span>{label}</span>
      </div>
    </div>
  );
}

export default PublicLoadingState;
