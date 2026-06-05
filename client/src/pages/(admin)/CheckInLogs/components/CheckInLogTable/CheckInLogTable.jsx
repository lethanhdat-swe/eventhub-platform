import { Eye, MoreHorizontal, Ticket, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import AdminTableWrapper from '@/pages/(admin)/components/table/AdminTableWrapper';
import { SortableTableHead } from '@/pages/(admin)/components/table';
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
import CheckInLogStatusBadge from '@/pages/(admin)/CheckInLogs/components/CheckInLogStatusBadge/CheckInLogStatusBadge';
import { formatCheckInTime } from '@/pages/(admin)/CheckInLogs/data';

const EMPTY_VALUE = '-';

function CheckInLogTable({
  logs,
  sortBy,
  sortOrder,
  onSort,
  onView,
  onViewTicket,
  onDelete,
}) {
  return (
    <AdminTableWrapper>
      <Table className="min-w-275">
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            <SortableTableHead
              field="scannedAt"
              label="Thời gian quét"
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSort={onSort}
            />
            <TableHead className="px-2 h-9">Token / Mã QR</TableHead>
            <SortableTableHead
              field="status"
              label="Trạng thái"
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSort={onSort}
            />
            <TableHead className="px-2 h-9">Nội dung</TableHead>
            <TableHead className="px-2 h-9">Vé liên kết</TableHead>
            <TableHead className="px-2 h-9">Sự kiện</TableHead>
            <TableHead className="px-2 h-9">Ghế</TableHead>
            <TableHead className="w-12 px-2 text-right h-9">Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log) => (
            <TableRow key={log.id}>
              <TableCell className="px-2 py-1.5 text-muted-foreground">
                {formatCheckInTime(log.scannedAt)}
              </TableCell>
              <TableCell className="max-w-45 truncate px-2 py-1.5 font-mono text-xs font-medium">
                {log.token}
              </TableCell>
              <TableCell className="px-2 py-1.5">
                <CheckInLogStatusBadge status={log.status} />
              </TableCell>
              <TableCell className="max-w-60 truncate px-2 py-1.5 text-muted-foreground">
                {log.message || EMPTY_VALUE}
              </TableCell>
              <TableCell className="max-w-35 truncate px-2 py-1.5 font-mono text-xs text-muted-foreground">
                {log.ticketId || EMPTY_VALUE}
              </TableCell>
              <TableCell className="max-w-50 truncate px-2 py-1.5 text-muted-foreground">
                {log.eventTitle || EMPTY_VALUE}
              </TableCell>
              <TableCell className="px-2 py-1.5 tabular-nums text-muted-foreground">
                {log.seatLabel || EMPTY_VALUE}
              </TableCell>
              <TableCell className="px-2 py-1.5 text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="cursor-pointer"
                        aria-label={`Hành động cho log ${log.token}`}
                      >
                        <MoreHorizontal className="size-4" />
                      </Button>
                    }
                  />
                  <DropdownMenuContent align="end" className="w-52">
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => onView(log)}
                    >
                      <Eye className="size-4" />
                      Xem chi tiết
                    </DropdownMenuItem>
                    {log.ticketId ? (
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => onViewTicket(log)}
                      >
                        <Ticket className="size-4" />
                        Xem vé
                      </DropdownMenuItem>
                    ) : null}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      variant="destructive"
                      className="cursor-pointer"
                      onClick={() => onDelete(log)}
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

export default CheckInLogTable;
