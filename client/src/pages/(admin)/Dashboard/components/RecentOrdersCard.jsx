import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { MOCK_RECENT_ORDERS } from '@/pages/(admin)/Dashboard/data';
import OrderStatusBadge from '@/pages/(admin)/Orders/components/OrderStatusBadge';
import { formatPriceVnd } from '@/pages/(admin)/Orders/data';

function RecentOrdersCard() {
  return (
    <Card className="gap-0 py-0">
      <CardHeader className="border-b border-border px-4 py-3">
        <CardTitle className="text-base">Đơn hàng gần đây</CardTitle>
        <CardDescription>5 đơn hàng mới nhất</CardDescription>
      </CardHeader>
      <CardContent className="px-0 py-0">
        <ul>
          {MOCK_RECENT_ORDERS.map((order, index) => (
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
      </CardContent>
    </Card>
  );
}

export default RecentOrdersCard;
