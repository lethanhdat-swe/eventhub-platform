import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Skeleton } from '@/components/ui/skeleton';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

const chartConfig = {
  revenue: {
    label: 'Doanh thu',
    color: 'var(--chart-1)',
  },
};

function RevenueChartCard({
  periodLabel = '30 ngày qua',
  chartData = [],
  isLoading = false,
  isEmpty = false,
}) {
  return (
    <Card className="gap-0 py-0">
      <CardHeader className="border-b border-border px-4 py-3">
        <CardTitle className="text-base">Doanh thu gần đây</CardTitle>
        <CardDescription>{periodLabel} · đơn vị triệu VNĐ</CardDescription>
      </CardHeader>
      <CardContent className="px-4 py-4">
        {isLoading ? (
          <Skeleton className="aspect-video w-full rounded-md" />
        ) : isEmpty ? (
          <p className="flex aspect-video items-center justify-center text-sm text-muted-foreground">
            Chưa có dữ liệu
          </p>
        ) : (
          <ChartContainer config={chartConfig} className="aspect-video w-full">
            <AreaChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) =>
                  typeof value === 'string' && value.length > 3
                    ? value.slice(0, 3)
                    : value
                }
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <Area
                dataKey="revenue"
                type="natural"
                fill="var(--color-revenue)"
                fillOpacity={0.4}
                stroke="var(--color-revenue)"
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}

export default RevenueChartCard;
