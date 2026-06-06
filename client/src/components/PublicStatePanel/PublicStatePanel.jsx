import { AlertCircle, Inbox } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

function PublicStatePanel({
  variant = 'empty',
  title,
  description,
  onRetry,
  className,
  children,
}) {
  const isError = variant === 'error';
  const Icon = isError ? AlertCircle : Inbox;

  const defaultTitle = isError
    ? 'Không thể tải dữ liệu'
    : 'Chưa có nội dung';
  const defaultDescription = isError
    ? 'Vui lòng thử lại sau.'
    : undefined;

  return (
    <div
      className={cn(
        'flex min-h-55 flex-col items-center justify-center rounded-[24px] px-5 py-8 text-center',
        isError
          ? 'border border-red-500/25 bg-red-500/5'
          : 'border border-dashed border-(--border-color) bg-(--soft-surface-color)',
        className
      )}
    >
      <Icon
        className={cn(
          'mb-3 size-8',
          isError ? 'text-red-400' : 'text-(--muted-text)'
        )}
        aria-hidden
      />

      <p
        className={cn(
          'text-sm font-semibold',
          isError ? 'text-red-300' : 'text-(--text-primary)'
        )}
      >
        {title ?? defaultTitle}
      </p>

      {(description ?? defaultDescription) ? (
        <p className="mt-2 max-w-md text-sm text-(--muted-text)">
          {description ?? defaultDescription}
        </p>
      ) : null}

      {children}

      {onRetry ? (
        <Button
          type="button"
          variant={isError ? 'outline' : 'default'}
          size="sm"
          className="mt-4"
          onClick={onRetry}
        >
          Thử lại
        </Button>
      ) : null}
    </div>
  );
}

export default PublicStatePanel;
