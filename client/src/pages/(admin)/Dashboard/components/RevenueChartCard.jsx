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
import { formatDashboardRevenue } from '@/pages/(admin)/Dashboard/data';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';

const chartConfig = {
  revenue: {
    label: 'Doanh thu',
    color: 'var(--chart-1)',
  },
};

function formatAxisValue(value, unitLabel) {
  if (value == null || Number.isNaN(value)) return '0';

  if (unitLabel === 'triệu VNĐ') {
    return `${value.toLocaleString('vi-VN', { maximumFractionDigits: 1 })} tr`;
  }

  if (unitLabel === 'nghìn VNĐ') {
    return `${value.toLocaleString('vi-VN', { maximumFractionDigits: 0 })} n`;
  }

  return value.toLocaleString('vi-VN', { maximumFractionDigits: 0 });
}

function RevenueChartCard({
  periodLabel = '30 ngày qua',
  chartData = [],
  unitLabel = 'VNĐ',
  isLoading = false,
  isEmpty = false,
}) {
  return (
    <Card className="gap-0 py-0">
      <CardHeader className="border-b border-border px-4 py-3">
        <CardTitle className="text-base">Doanh thu gần đây</CardTitle>
        <CardDescription>
          {periodLabel} · đơn vị {unitLabel}
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4 py-4">
        {isLoading ? (
          <Skeleton className="aspect-video w-full rounded-md" />
        ) : isEmpty ? (
          <p className="flex aspect-video items-center justify-center text-sm text-muted-foreground">
            Chưa có dữ liệu
          </p>
        ) : (
          <ChartContainer config={chartConfig} className="aspect-video w-full min-w-0 overflow-hidden">
            <AreaChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: 4,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
              />
              <YAxis
                width={44}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                domain={[0, 'auto']}
                tickFormatter={(value) => formatAxisValue(value, unitLabel)}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    indicator="line"
                    formatter={(_value, _name, item) => (
                      <span className="font-medium tabular-nums">
                        {formatDashboardRevenue(item.payload?.rawRevenue ?? 0)} VNĐ
                      </span>
                    )}
                  />
                }
              />
              <Area
                dataKey="revenue"
                type="monotone"
                fill="var(--color-revenue)"
                fillOpacity={0.35}
                stroke="var(--color-revenue)"
                strokeWidth={2}
                isAnimationActive={false}
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}

export default RevenueChartCard;
