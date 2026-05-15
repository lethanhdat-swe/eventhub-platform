import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { formatCheckInTime } from '@/pages/(admin)/CheckIn/data';

function getInitials(name) {
  if (!name || name === '—') return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase();
}

function RecentCheckInList({ items }) {
  return (
    <Card className="gap-0 py-0 lg:h-full">
      <CardHeader className="border-b border-border px-4 py-3">
        <CardTitle className="text-base">Check-in gần đây</CardTitle>
        <CardDescription>
          {items.length} lượt ghi nhận gần nhất tại cổng vào.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0 py-0">
        {items.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-muted-foreground">
            Chưa có lượt check-in nào.
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/30"
              >
                <div
                  className={cn(
                    'flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold',
                    item.success
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-muted text-muted-foreground'
                  )}
                  aria-hidden
                >
                  {getInitials(item.customerName)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {item.customerName}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {item.ticketCode}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <Badge
                    variant="outline"
                    className={cn(
                      'mb-1 h-5 rounded-md px-1.5 text-xs font-medium',
                      item.success
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'border-destructive/30 bg-destructive/10 text-destructive'
                    )}
                  >
                    {item.success ? 'Thành công' : 'Thất bại'}
                  </Badge>
                  <p className="text-xs tabular-nums text-muted-foreground">
                    {formatCheckInTime(item.checkedInAt)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

export default RecentCheckInList;
