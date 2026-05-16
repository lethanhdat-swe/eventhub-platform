import {
  Eye,
  MoreHorizontal,
  Pencil,
  RotateCcw,
  Ticket,
  Trash2,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import AdminTableWrapper from '@/pages/(admin)/components/table/AdminTableWrapper';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import OrderStatusBadge from '@/pages/(admin)/Orders/components/OrderStatusBadge';
import { formatCreatedAt, formatPriceVnd } from '@/pages/(admin)/Orders/data';

function OrderTable({
  orders,
  selectedIds,
  onSelectAll,
  onSelectRow,
  onView,
  onEdit,
  onViewTickets,
  onRefund,
  onDelete,
}) {
  const selectedCount = selectedIds.size;
  const allSelected = orders.length > 0 && selectedCount === orders.length;
  const someSelected = selectedCount > 0 && selectedCount < orders.length;

  const headerChecked = allSelected
    ? true
    : someSelected
      ? 'indeterminate'
      : false;

  const canRefund = (order) =>
    order.status !== 'refunded' && order.status !== 'cancelled';

  return (
    <AdminTableWrapper>
      <Table className="min-w-[1100px]">
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            <TableHead className="h-9 w-10 px-2">
              <Checkbox
                checked={headerChecked}
                onCheckedChange={(checked) => onSelectAll(Boolean(checked))}
                aria-label="Chọn tất cả đơn hàng"
              />
            </TableHead>
            <TableHead className="h-9 px-2">Mã đơn hàng</TableHead>
            <TableHead className="h-9 px-2">Khách hàng</TableHead>
            <TableHead className="h-9 px-2">Email</TableHead>
            <TableHead className="h-9 px-2">Số điện thoại</TableHead>
            <TableHead className="h-9 px-2">Tổng tiền</TableHead>
            <TableHead className="h-9 px-2">Phương thức</TableHead>
            <TableHead className="h-9 px-2">Trạng thái</TableHead>
            <TableHead className="h-9 px-2">Ngày tạo</TableHead>
            <TableHead className="h-9 w-12 px-2 text-right">Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
              <TableRow
                key={order.id}
                data-state={selectedIds.has(order.id) ? 'selected' : undefined}
              >
                <TableCell className="px-2 py-1.5">
                  <Checkbox
                    checked={selectedIds.has(order.id)}
                    onCheckedChange={(checked) =>
                      onSelectRow(order.id, Boolean(checked))
                    }
                    aria-label={`Chọn đơn ${order.orderCode}`}
                  />
                </TableCell>
                <TableCell className="px-2 py-1.5 font-medium tabular-nums">
                  {order.orderCode}
                </TableCell>
                <TableCell className="px-2 py-1.5">
                  {order.customerName ?? '—'}
                </TableCell>
                <TableCell className="max-w-[160px] truncate px-2 py-1.5 text-muted-foreground">
                  {order.customerEmail}
                </TableCell>
                <TableCell className="px-2 py-1.5 tabular-nums text-muted-foreground">
                  {order.customerPhone}
                </TableCell>
                <TableCell className="px-2 py-1.5 text-muted-foreground">
                  {formatPriceVnd(order.totalAmount)}
                </TableCell>
                <TableCell className="px-2 py-1.5 text-muted-foreground">
                  {order.paymentMethod}
                </TableCell>
                <TableCell className="px-2 py-1.5">
                  <OrderStatusBadge status={order.status} />
                </TableCell>
                <TableCell className="px-2 py-1.5 text-muted-foreground">
                  {formatCreatedAt(order.createdAt)}
                </TableCell>
                <TableCell className="px-2 py-1.5 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="cursor-pointer"
                          aria-label={`Hành động cho ${order.orderCode}`}
                        >
                          <MoreHorizontal className="size-4" />
                        </Button>
                      }
                    />
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => onView(order)}
                      >
                        <Eye className="size-4" />
                        Xem chi tiết
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => onEdit(order)}
                      >
                        <Pencil className="size-4" />
                        Chỉnh sửa
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => onViewTickets(order)}
                      >
                        <Ticket className="size-4" />
                        Xem vé
                      </DropdownMenuItem>
                      {canRefund(order) ? (
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={() => onRefund(order)}
                        >
                          <RotateCcw className="size-4" />
                          Hoàn tiền
                        </DropdownMenuItem>
                      ) : null}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        variant="destructive"
                        className="cursor-pointer"
                        onClick={() => onDelete(order)}
                      >
                        <Trash2 className="size-4" />
                        Xóa
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
          ))}
        </TableBody>
      </Table>
    </AdminTableWrapper>
  );
}

export default OrderTable;
