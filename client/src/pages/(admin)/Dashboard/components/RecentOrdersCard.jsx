import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import OrderStatusBadge from '@/pages/(admin)/Orders/components/OrderStatusBadge/OrderStatusBadge';
import { formatPriceVnd } from '@/pages/(admin)/Orders/data';

function RecentOrdersCard({
  periodLabel = '30 ngày qua',
  orders = [],
  isLoading = false,
  isEmpty = false,
}) {
  return (
    <Card className="gap-0 py-0">
      <CardHeader className="border-b border-border px-4 py-3">
        <CardTitle className="text-base">Đơn hàng gần đây</CardTitle>
        <CardDescription>5 đơn mới nhất · {periodLabel}</CardDescription>
      </CardHeader>
      <CardContent className="px-0 py-0">
        {isLoading ? (
          <ul className="px-4 py-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <li key={index} className="py-2.5">
                <Skeleton className="mb-1.5 h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </li>
            ))}
          </ul>
        ) : isEmpty ? (
          <p className="px-4 py-6 text-center text-sm text-muted-foreground">
            Chưa có dữ liệu
          </p>
        ) : (
          <ul>
            {orders.map((order, index) => (
              <li key={order.id}>
                {index > 0 ? <Separator /> : null}
                <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5">
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{order.orderCode}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {order.customerName}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="text-sm font-medium tabular-nums">
                      {formatPriceVnd(order.totalAmount)}
                    </span>
                    <OrderStatusBadge status={order.status} />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

export default RecentOrdersCard;


