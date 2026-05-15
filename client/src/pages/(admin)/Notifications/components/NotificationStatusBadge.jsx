import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const statusConfig = {
  draft: {
    label: 'Bản nháp',
    className: 'border-border bg-muted text-muted-foreground',
  },
  sent: {
    label: 'Đã gửi',
    className:
      'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
  },
  scheduled: {
    label: 'Đã lên lịch',
    className:
      'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300',
  },
};

function NotificationStatusBadge({ status, className }) {
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
      {config?.label ?? status}
    </Badge>
  );
}

export default NotificationStatusBadge;
