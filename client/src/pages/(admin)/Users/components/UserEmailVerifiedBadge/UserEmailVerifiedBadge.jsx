import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

function UserEmailVerifiedBadge({ isEmailVerified, className }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        'h-5 rounded-md px-1.5 text-xs font-medium',
        isEmailVerified
          ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
          : 'border-border bg-muted text-muted-foreground',
        className
      )}
    >
      {isEmailVerified ? 'Đã xác thực' : 'Chưa xác thực'}
    </Badge>
  );
}

export default UserEmailVerifiedBadge;
