import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { MOCK_REVENUE_BARS } from '@/pages/(admin)/Dashboard/data';

function RevenueChartCard() {
  const maxValue = Math.max(...MOCK_REVENUE_BARS.map((bar) => bar.value));

  return (
    <Card className="gap-0 py-0">
      <CardHeader className="border-b border-border px-4 py-3">
        <CardTitle className="text-base">Doanh thu gần đây</CardTitle>
        <CardDescription>7 ngày qua (đơn vị: triệu VNĐ)</CardDescription>
      </CardHeader>
      <CardContent className="px-4 py-4">
        <div className="flex h-32 items-end justify-between gap-1.5">
          {MOCK_REVENUE_BARS.map((bar) => {
            const heightPercent =
              maxValue > 0 ? Math.round((bar.value / maxValue) * 100) : 0;

            return (
              <div
                key={bar.label}
                className="flex min-w-0 flex-1 flex-col items-center gap-1"
              >
                <div
                  className="w-full rounded-t bg-primary/80 transition-[height]"
                  style={{ height: `${Math.max(heightPercent, 8)}%` }}
                  title={`${bar.value} triệu`}
                />
                <span className="text-xs text-muted-foreground">{bar.label}</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

export default RevenueChartCard;
