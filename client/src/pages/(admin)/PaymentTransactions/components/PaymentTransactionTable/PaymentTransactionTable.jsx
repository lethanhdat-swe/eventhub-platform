import { Eye, MoreHorizontal, RefreshCw } from 'lucide-react';

import { Button } from '@/components/ui/button';
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
import AdminTableWrapper from '@/pages/(admin)/components/table/AdminTableWrapper';
import PaymentTransactionStatusBadge from '@/pages/(admin)/PaymentTransactions/components/PaymentTransactionStatusBadge/PaymentTransactionStatusBadge';
import {
  formatCreatedAt,
  formatPriceVnd,
} from '@/pages/(admin)/PaymentTransactions/data';

function PaymentTransactionTable({
  transactions,
  selectedIds,
  onSelectAll,
  onSelectRow,
  onView,
  onManualConfirm,
}) {
  const selectedCount = selectedIds.size;
  const allSelected =
    transactions.length > 0 && selectedCount === transactions.length;
  const someSelected =
    selectedCount > 0 && selectedCount < transactions.length;

  const headerChecked = allSelected
    ? true
    : someSelected
      ? 'indeterminate'
      : false;

  return (
    <AdminTableWrapper>
      <Table className="min-w-7xl">
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            <TableHead className="w-10 px-2 h-9">
              <Checkbox
                checked={headerChecked}
                onCheckedChange={(checked) => onSelectAll(Boolean(checked))}
                aria-label="Chọn tất cả giao dịch"
              />
            </TableHead>
            <TableHead className="px-2 h-9">Mã giao dịch</TableHead>
            <TableHead className="px-2 h-9">Mã đơn</TableHead>
            <TableHead className="px-2 h-9">Số tiền</TableHead>
            <TableHead className="px-2 h-9">Nội dung CK</TableHead>
            <TableHead className="px-2 h-9">Cổng</TableHead>
            <TableHead className="px-2 h-9">Trạng thái</TableHead>
            <TableHead className="px-2 h-9">Đơn hàng liên kết</TableHead>
            <TableHead className="px-2 h-9">Ngày tạo</TableHead>
            <TableHead className="w-12 px-2 text-right h-9">
              Hành động
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow
              key={transaction.id}
              data-state={
                selectedIds.has(transaction.id) ? 'selected' : undefined
              }
            >
              <TableCell className="px-2 py-1.5">
                <Checkbox
                  checked={selectedIds.has(transaction.id)}
                  onCheckedChange={(checked) =>
                    onSelectRow(transaction.id, Boolean(checked))
                  }
                  aria-label={`Chọn giao dịch ${transaction.transactionId}`}
                />
              </TableCell>
              <TableCell className="px-2 py-1.5 font-medium tabular-nums">
                {transaction.transactionId}
              </TableCell>
              <TableCell className="px-2 py-1.5 tabular-nums text-muted-foreground">
                {transaction.orderCode ?? '—'}
              </TableCell>
              <TableCell className="px-2 py-1.5 text-muted-foreground">
                {formatPriceVnd(transaction.amount)}
              </TableCell>
              <TableCell className="max-w-65 truncate px-2 py-1.5 text-muted-foreground">
                {transaction.content ?? '—'}
              </TableCell>
              <TableCell className="px-2 py-1.5 text-muted-foreground">
                {transaction.gateway ?? '—'}
              </TableCell>
              <TableCell className="px-2 py-1.5">
                <PaymentTransactionStatusBadge status={transaction.status} />
              </TableCell>
              <TableCell className="px-2 py-1.5 tabular-nums text-muted-foreground">
                {transaction.order?.orderCode ?? 'Chưa khớp'}
              </TableCell>
              <TableCell className="px-2 py-1.5 text-muted-foreground">
                {formatCreatedAt(transaction.createdAt)}
              </TableCell>
              <TableCell className="px-2 py-1.5 text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="cursor-pointer"
                        aria-label={`Hành động cho ${transaction.transactionId}`}
                      >
                        <MoreHorizontal className="size-4" />
                      </Button>
                    }
                  />
                  <DropdownMenuContent align="end" className="w-52">
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => onView(transaction)}
                    >
                      <Eye className="size-4" />
                      Xem chi tiết
                    </DropdownMenuItem>
                    {transaction.status !== 'MATCHED' ? (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={() => onManualConfirm(transaction)}
                        >
                          <RefreshCw className="size-4" />
                          Xác nhận thủ công
                        </DropdownMenuItem>
                      </>
                    ) : null}
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

export default PaymentTransactionTable;
