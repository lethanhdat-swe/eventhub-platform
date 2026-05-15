import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const statusConfig = {
  active: {
    label: 'Đang hoạt động',
    className:
      'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
  },
  pending: {
    label: 'Chờ xử lý',
    className:
      'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300',
  },
  cancelled: {
    label: 'Đã hủy',
    className:
      'border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300',
  },
  paid: {
    label: 'Đã thanh toán',
    className:
      'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300',
  },
  refunded: {
    label: 'Đã hoàn tiền',
    className:
      'border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-800 dark:bg-violet-950 dark:text-violet-300',
  },
  draft: {
    label: 'Bản nháp',
    className: 'border-border bg-muted text-muted-foreground',
  },
};

function StatusBadge({ status, className }) {
  const config = statusConfig[status];

  return (
    <Badge
      variant="outline"
      className={cn(
        'h-5 rounded-md px-1.5 text-xs font-medium',
        config?.className ??
          'border-border bg-background text-foreground capitalize',
        className
      )}
    >
      {config?.label ?? status}
    </Badge>
  );
}

export default StatusBadge;
