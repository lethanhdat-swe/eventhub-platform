import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { formatEventDate } from '@/pages/(admin)/Dashboard/data';

function FeaturedEventsCard({
  periodLabel = '30 ngày qua',
  events = [],
  isLoading = false,
  isEmpty = false,
}) {
  return (
    <Card className="gap-0 py-0">
      <CardHeader className="border-b border-border px-4 py-3">
        <CardTitle className="text-base">Sự kiện nổi bật</CardTitle>
        <CardDescription>Theo vé đã bán · {periodLabel}</CardDescription>
      </CardHeader>
      <CardContent className="px-0 py-0">
        {isLoading ? (
          <ul className="px-4 py-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <li key={index} className="py-2.5">
                <Skeleton className="mb-1.5 h-4 w-48" />
                <Skeleton className="h-3 w-20" />
              </li>
            ))}
          </ul>
        ) : isEmpty ? (
          <p className="px-4 py-6 text-center text-sm text-muted-foreground">
            Chưa có dữ liệu
          </p>
        ) : (
          <ul>
            {events.map((event, index) => (
              <li key={event.id}>
                {index > 0 ? <Separator /> : null}
                <div className="flex flex-wrap items-start justify-between gap-2 px-4 py-2.5">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{event.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatEventDate(event.startDate)}
                    </p>
                  </div>
                  <p className="shrink-0 text-xs tabular-nums text-muted-foreground">
                    {event.ticketsSold.toLocaleString('vi-VN')} vé đã bán
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

export default FeaturedEventsCard;
