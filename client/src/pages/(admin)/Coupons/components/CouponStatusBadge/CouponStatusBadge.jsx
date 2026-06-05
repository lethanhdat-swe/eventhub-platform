import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const statusConfig = {
  ACTIVE: {
    label: 'Đang hoạt động',
    className:
      'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
  },
  INACTIVE: {
    label: 'Tạm dừng',
    className: 'border-border bg-muted text-muted-foreground',
  },
};

function CouponStatusBadge({ status, className }) {
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

export default CouponStatusBadge;
