import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { CHECKIN_LOG_STATUS_LABELS } from '@/pages/(admin)/CheckInLogs/data';

const statusConfig = {
  VALID: {
    className:
      'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
  },
  DUPLICATE: {
    className:
      'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300',
  },
  INVALID: {
    className:
      'border-destructive/30 bg-destructive/10 text-destructive dark:border-destructive/40',
  },
};

function CheckInLogStatusBadge({ status, className }) {
  const config = statusConfig[status];

  return (
    <Badge
      variant="outline"
      className={cn(
        'h-5 rounded-md px-1.5 text-xs font-medium',
        config?.className,
        className
      )}
    >
      {CHECKIN_LOG_STATUS_LABELS[status] ?? status}
    </Badge>
  );
}

export default CheckInLogStatusBadge;
