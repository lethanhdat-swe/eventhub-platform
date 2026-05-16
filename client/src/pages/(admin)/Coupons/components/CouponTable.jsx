import {
  Eye,
  EyeOff,
  MoreHorizontal,
  Pencil,
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
import CouponStatusBadge from '@/pages/(admin)/Coupons/components/CouponStatusBadge';
import {
  formatDiscount,
  formatValidUntil,
} from '@/pages/(admin)/Coupons/data';

function CouponTable({
  coupons,
  selectedIds,
  onSelectAll,
  onSelectRow,
  onView,
  onEdit,
  onToggleStatus,
  onDelete,
}) {
  const selectedCount = selectedIds.size;
  const allSelected = coupons.length > 0 && selectedCount === coupons.length;
  const someSelected = selectedCount > 0 && selectedCount < coupons.length;

  const headerChecked = allSelected
    ? true
    : someSelected
      ? 'indeterminate'
      : false;

  return (
    <AdminTableWrapper>
      <Table className="min-w-[900px]">
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            <TableHead className="h-9 w-10 px-2">
              <Checkbox
                checked={headerChecked}
                onCheckedChange={(checked) => onSelectAll(Boolean(checked))}
                aria-label="Chọn tất cả mã giảm giá"
              />
            </TableHead>
            <TableHead className="h-9 px-2">Mã giảm giá</TableHead>
            <TableHead className="h-9 px-2">Mô tả</TableHead>
            <TableHead className="h-9 px-2">Giảm giá</TableHead>
            <TableHead className="h-9 px-2">Giới hạn lượt dùng</TableHead>
            <TableHead className="h-9 px-2">Hạn sử dụng</TableHead>
            <TableHead className="h-9 px-2">Trạng thái</TableHead>
            <TableHead className="h-9 w-12 px-2 text-right">Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {coupons.map((coupon) => (
              <TableRow
                key={coupon.id}
                data-state={selectedIds.has(coupon.id) ? 'selected' : undefined}
              >
                <TableCell className="px-2 py-1.5">
                  <Checkbox
                    checked={selectedIds.has(coupon.id)}
                    onCheckedChange={(checked) =>
                      onSelectRow(coupon.id, Boolean(checked))
                    }
                    aria-label={`Chọn mã ${coupon.code}`}
                  />
                </TableCell>
                <TableCell className="px-2 py-1.5 font-medium">
                  {coupon.code}
                </TableCell>
                <TableCell className="max-w-[200px] truncate px-2 py-1.5 text-muted-foreground">
                  {coupon.description ?? '—'}
                </TableCell>
                <TableCell className="px-2 py-1.5 tabular-nums">
                  {formatDiscount(coupon.discountPercent)}
                </TableCell>
                <TableCell className="px-2 py-1.5 tabular-nums text-muted-foreground">
                  {coupon.usageLimit ?? '—'}
                </TableCell>
                <TableCell className="px-2 py-1.5 text-muted-foreground">
                  {formatValidUntil(coupon.validUntil)}
                </TableCell>
                <TableCell className="px-2 py-1.5">
                  <CouponStatusBadge status={coupon.status} />
                </TableCell>
                <TableCell className="px-2 py-1.5 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="cursor-pointer"
                          aria-label={`Hành động cho ${coupon.code}`}
                        >
                          <MoreHorizontal className="size-4" />
                        </Button>
                      }
                    />
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => onView(coupon)}
                      >
                        <Eye className="size-4" />
                        Xem chi tiết
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => onEdit(coupon)}
                      >
                        <Pencil className="size-4" />
                        Chỉnh sửa
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => onToggleStatus(coupon)}
                      >
                        {coupon.status === 'ACTIVE' ? (
                          <EyeOff className="size-4" />
                        ) : (
                          <Eye className="size-4" />
                        )}
                        {coupon.status === 'ACTIVE' ? 'Ẩn' : 'Hiển thị'}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        variant="destructive"
                        className="cursor-pointer"
                        onClick={() => onDelete(coupon)}
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

export default CouponTable;
