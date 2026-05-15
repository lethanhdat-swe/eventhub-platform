import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  formatEventDate,
  MOCK_FEATURED_EVENTS,
} from '@/pages/(admin)/Dashboard/data';

function FeaturedEventsCard() {
  return (
    <Card className="gap-0 py-0">
      <CardHeader className="border-b border-border px-4 py-3">
        <CardTitle className="text-base">Sự kiện nổi bật</CardTitle>
        <CardDescription>Theo lượt vé đã bán</CardDescription>
      </CardHeader>
      <CardContent className="px-0 py-0">
        <ul>
          {MOCK_FEATURED_EVENTS.map((event, index) => (
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
      </CardContent>
    </Card>
  );
}

export default FeaturedEventsCard;
