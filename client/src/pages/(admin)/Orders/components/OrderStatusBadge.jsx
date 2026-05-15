import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ORDER_STATUS_LABELS } from '@/pages/(admin)/Orders/data';

const statusStyles = {
  pending:
    'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300',
  paid: 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300',
  cancelled:
    'border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300',
  refunded:
    'border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-800 dark:bg-violet-950 dark:text-violet-300',
};

function OrderStatusBadge({ status, className }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        'h-5 rounded-md px-1.5 text-xs font-medium',
        statusStyles[status] ?? 'border-border bg-muted text-muted-foreground',
        className
      )}
    >
      {ORDER_STATUS_LABELS[status] ?? status}
    </Badge>
  );
}

export default OrderStatusBadge;
