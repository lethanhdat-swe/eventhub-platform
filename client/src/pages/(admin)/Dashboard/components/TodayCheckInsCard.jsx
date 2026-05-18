import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCheckInTime } from '@/pages/(admin)/Dashboard/data';

function TodayCheckInsCard({
  periodLabel = 'Hôm nay',
  dateRange,
  checkIns = [],
  isLoading = false,
  isEmpty = false,
}) {
  const title =
    dateRange?.preset === 'today' ? 'Check-in hôm nay' : 'Check-in gần đây';

  return (
    <Card className="gap-0 py-0">
      <CardHeader className="border-b border-border px-4 py-3">
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription>5 lượt gần nhất · {periodLabel}</CardDescription>
      </CardHeader>
      <CardContent className="px-0 py-0">
        {isLoading ? (
          <ul className="px-4 py-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <li key={index} className="py-2.5">
                <Skeleton className="mb-1.5 h-4 w-36" />
                <Skeleton className="h-3 w-28" />
              </li>
            ))}
          </ul>
        ) : isEmpty ? (
          <p className="px-4 py-6 text-center text-sm text-muted-foreground">
            Chưa có dữ liệu
          </p>
        ) : (
          <ul>
            {checkIns.map((item, index) => (
              <li key={item.id}>
                {index > 0 ? <Separator /> : null}
                <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {item.customerName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.ticketCode}
                    </p>
                  </div>
                  <p className="shrink-0 text-xs tabular-nums text-muted-foreground">
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

export default TodayCheckInsCard;
