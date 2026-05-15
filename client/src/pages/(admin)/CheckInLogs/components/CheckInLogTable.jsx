import { AlertTriangle, Eye, MoreHorizontal, Ticket } from 'lucide-react';

import { Button } from '@/components/ui/button';
import AdminTableWrapper from '@/pages/(admin)/components/table/AdminTableWrapper';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
import CheckInLogStatusBadge from '@/pages/(admin)/CheckInLogs/components/CheckInLogStatusBadge';
import { formatCheckInTime } from '@/pages/(admin)/CheckInLogs/data';

function CheckInLogTable({
  logs,
  selectedIds,
  onSelectAll,
  onSelectRow,
  onView,
  onViewTicket,
  onMarkInvalid,
}) {
  const selectedCount = selectedIds.size;
  const allSelected = logs.length > 0 && selectedCount === logs.length;
  const someSelected = selectedCount > 0 && selectedCount < logs.length;

  const headerChecked = allSelected
    ? true
    : someSelected
      ? 'indeterminate'
      : false;

  return (
    <AdminTableWrapper>
      <Table className="min-w-[1000px]">
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            <TableHead className="h-9 w-10 px-2">
              <Checkbox
                checked={headerChecked}
                onCheckedChange={(checked) => onSelectAll(Boolean(checked))}
                aria-label="Chọn tất cả bản ghi"
              />
            </TableHead>
            <TableHead className="h-9 px-2">Mã vé</TableHead>
            <TableHead className="h-9 px-2">Khách hàng</TableHead>
            <TableHead className="h-9 px-2">Sự kiện</TableHead>
            <TableHead className="h-9 px-2">Ghế</TableHead>
            <TableHead className="h-9 px-2">Người quét</TableHead>
            <TableHead className="h-9 px-2">Trạng thái</TableHead>
            <TableHead className="h-9 px-2">Thời gian check-in</TableHead>
            <TableHead className="h-9 w-12 px-2 text-right">Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log) => (
              <TableRow
                key={log.id}
                data-state={selectedIds.has(log.id) ? 'selected' : undefined}
              >
                <TableCell className="px-2 py-1.5">
                  <Checkbox
                    checked={selectedIds.has(log.id)}
                    onCheckedChange={(checked) =>
                      onSelectRow(log.id, Boolean(checked))
                    }
                    aria-label={`Chọn bản ghi ${log.ticketCode}`}
                  />
                </TableCell>
                <TableCell className="px-2 py-1.5 font-medium">
                  {log.ticketCode}
                </TableCell>
                <TableCell className="px-2 py-1.5">{log.customerName}</TableCell>
                <TableCell className="max-w-[180px] truncate px-2 py-1.5 text-muted-foreground">
                  {log.eventTitle}
                </TableCell>
                <TableCell className="px-2 py-1.5 tabular-nums text-muted-foreground">
                  {log.seatLabel}
                </TableCell>
                <TableCell className="px-2 py-1.5 text-muted-foreground">
                  {log.scannedBy}
                </TableCell>
                <TableCell className="px-2 py-1.5">
                  <CheckInLogStatusBadge status={log.status} />
                </TableCell>
                <TableCell className="px-2 py-1.5 text-muted-foreground">
                  {formatCheckInTime(log.checkedInAt)}
                </TableCell>
                <TableCell className="px-2 py-1.5 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="cursor-pointer"
                          aria-label={`Hành động cho ${log.ticketCode}`}
                        >
                          <MoreHorizontal className="size-4" />
                        </Button>
                      }
                    />
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => onView(log)}
                      >
                        <Eye className="size-4" />
                        Xem chi tiết
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => onViewTicket(log)}
                      >
                        <Ticket className="size-4" />
                        Xem vé
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => onMarkInvalid(log)}
                      >
                        <AlertTriangle className="size-4" />
                        Đánh dấu lỗi
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

export default CheckInLogTable;
