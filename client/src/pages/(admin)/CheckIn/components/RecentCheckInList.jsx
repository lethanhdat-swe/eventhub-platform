import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import {
  CHECKIN_LOG_STATUS_LABELS,
  formatCheckInTime,
  getShortToken,
} from '@/pages/(admin)/CheckIn/data';

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

function RecentCheckInList({ items, isLoading = false, error = null }) {
  return (
    <Card className="gap-0 py-0 lg:h-full">
      <CardHeader className="border-b border-border px-4 py-3">
        <CardTitle className="text-base">Nhật ký quét gần đây</CardTitle>
        <CardDescription>
          Các lượt quét QR mới nhất tại cổng vào.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0 py-0">
        {isLoading ? (
          <p className="px-4 py-8 text-center text-sm text-muted-foreground">
            Đang tải nhật ký quét...
          </p>
        ) : error ? (
          <p className="px-4 py-8 text-center text-sm text-destructive">
            {error}
          </p>
        ) : items.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-muted-foreground">
            Chưa có lượt quét QR nào.
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {items.map((item) => {
              const eventSeat = [item.eventTitle, item.seatLabel]
                .filter(Boolean)
                .join(' - ');

              return (
                <li
                  key={item.id}
                  className="flex items-start gap-3 px-4 py-3 transition-colors hover:bg-muted/30"
                >
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <p className="truncate font-mono text-sm font-medium">
                        {getShortToken(item.token)}
                      </p>
                      <Badge
                        variant="outline"
                        className={cn(
                          'h-5 rounded-md px-1.5 text-xs font-medium',
                          statusConfig[item.status]?.className
                        )}
                      >
                        {CHECKIN_LOG_STATUS_LABELS[item.status] ?? item.status}
                      </Badge>
                    </div>
                    <p className="truncate text-xs text-muted-foreground">
                      {item.message || 'Mã QR không hợp lệ'}
                    </p>
                    <p className="mt-1 truncate text-xs text-muted-foreground">
                      {eventSeat || '-'}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-xs tabular-nums text-muted-foreground">
                      {formatCheckInTime(item.scannedAt)}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

export default RecentCheckInList;
