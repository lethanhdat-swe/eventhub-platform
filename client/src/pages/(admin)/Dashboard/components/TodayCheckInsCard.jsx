import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  formatCheckInTime,
  MOCK_TODAY_CHECKINS,
} from '@/pages/(admin)/Dashboard/data';

function TodayCheckInsCard() {
  return (
    <Card className="gap-0 py-0">
      <CardHeader className="border-b border-border px-4 py-3">
        <CardTitle className="text-base">Check-in hôm nay</CardTitle>
        <CardDescription>5 lượt check-in gần nhất</CardDescription>
      </CardHeader>
      <CardContent className="px-0 py-0">
        <ul>
          {MOCK_TODAY_CHECKINS.map((item, index) => (
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
      </CardContent>
    </Card>
  );
}

export default TodayCheckInsCard;
