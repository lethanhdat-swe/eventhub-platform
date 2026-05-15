import { Copy, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';

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
import StatusBadge from '@/pages/(admin)/components/StatusBadge';
import { formatPriceVnd } from '@/pages/(admin)/DefaultSeats/data';

function SeatTable({
  seats,
  selectedIds,
  onSelectAll,
  onSelectRow,
  onEdit,
  onDuplicate,
  onDelete,
}) {
  const selectedCount = selectedIds.size;
  const allSelected = seats.length > 0 && selectedCount === seats.length;
  const someSelected = selectedCount > 0 && selectedCount < seats.length;

  const headerChecked = allSelected
    ? true
    : someSelected
      ? 'indeterminate'
      : false;

  return (
    <AdminTableWrapper>
      <Table className="min-w-[880px]">
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            <TableHead className="h-9 w-10 px-2">
              <Checkbox
                checked={headerChecked}
                onCheckedChange={(checked) => onSelectAll(Boolean(checked))}
                aria-label="Chọn tất cả ghế"
              />
            </TableHead>
            <TableHead className="h-9 px-2">Ghế</TableHead>
            <TableHead className="h-9 px-2">Hàng</TableHead>
            <TableHead className="h-9 px-2">Số ghế</TableHead>
            <TableHead className="h-9 px-2">Loại vé mặc định</TableHead>
            <TableHead className="h-9 px-2">Giá vé mẫu</TableHead>
            <TableHead className="h-9 px-2">Trạng thái</TableHead>
            <TableHead className="h-9 w-12 px-2 text-right">Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {seats.map((seat) => (
              <TableRow
                key={seat.id}
                data-state={selectedIds.has(seat.id) ? 'selected' : undefined}
              >
                <TableCell className="px-2 py-1.5">
                  <Checkbox
                    checked={selectedIds.has(seat.id)}
                    onCheckedChange={(checked) =>
                      onSelectRow(seat.id, Boolean(checked))
                    }
                    aria-label={`Chọn ghế ${seat.seatLabel}`}
                  />
                </TableCell>
                <TableCell className="px-2 py-1.5 font-medium">
                  {seat.seatLabel}
                </TableCell>
                <TableCell className="px-2 py-1.5 text-muted-foreground">
                  {seat.rowLabel}
                </TableCell>
                <TableCell className="px-2 py-1.5 tabular-nums text-muted-foreground">
                  {seat.seatNumber}
                </TableCell>
                <TableCell className="px-2 py-1.5">
                  {seat.defaultTicketType?.name ?? '—'}
                </TableCell>
                <TableCell className="px-2 py-1.5 text-muted-foreground">
                  {formatPriceVnd(seat.price)}
                </TableCell>
                <TableCell className="px-2 py-1.5">
                  <StatusBadge status={seat.status} />
                </TableCell>
                <TableCell className="px-2 py-1.5 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="cursor-pointer"
                          aria-label={`Hành động cho ghế ${seat.seatLabel}`}
                        >
                          <MoreHorizontal className="size-4" />
                        </Button>
                      }
                    />
                    <DropdownMenuContent align="end" className="w-44">
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => onEdit(seat)}
                      >
                        <Pencil className="size-4" />
                        Chỉnh sửa
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => onDuplicate(seat)}
                      >
                        <Copy className="size-4" />
                        Nhân bản
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        variant="destructive"
                        className="cursor-pointer"
                        onClick={() => onDelete(seat)}
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

export default SeatTable;
