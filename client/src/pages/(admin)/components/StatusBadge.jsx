import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

/** Khớp EventStatus / OrderStatus (backend enum UPPER_CASE) */
const statusConfig = {
  DRAFT: {
    label: 'Bản nháp',
    className: 'border-border bg-muted text-muted-foreground',
  },
  PUBLISHED: {
    label: 'Đã xuất bản',
    className:
      'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
  },
  CANCELLED: {
    label: 'Đã hủy',
    className:
      'border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300',
  },
  PENDING: {
    label: 'Chờ xử lý',
    className:
      'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300',
  },
  PAID: {
    label: 'Đã thanh toán',
    className:
      'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300',
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
