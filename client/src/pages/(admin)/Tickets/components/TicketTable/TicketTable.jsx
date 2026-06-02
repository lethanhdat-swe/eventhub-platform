import { CheckCircle2, Eye, MoreHorizontal, Trash2 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
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
import { cn } from '@/lib/utils';
import { formatCheckedInAt } from '@/pages/(admin)/Tickets/data';

function CheckInBadge({ isCheckedIn }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        'h-5 rounded-md px-1.5 text-xs font-medium',
        isCheckedIn
          ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
          : 'border-border bg-muted text-muted-foreground'
      )}
    >
      {isCheckedIn ? 'Đã check-in' : 'Chưa check-in'}
    </Badge>
  );
}

function TicketTable({
  tickets,
  selectedIds,
  onSelectAll,
  onSelectRow,
  onView,
  onCheckIn,
  onDelete,
}) {
  const selectedCount = selectedIds.size;
  const allSelected = tickets.length > 0 && selectedCount === tickets.length;
  const someSelected = selectedCount > 0 && selectedCount < tickets.length;

  const headerChecked = allSelected
    ? true
    : someSelected
      ? 'indeterminate'
      : false;

  return (
    <AdminTableWrapper>
      <Table className="min-w-250">
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            <TableHead className="w-10 px-2 h-9">
              <Checkbox
                checked={headerChecked}
                onCheckedChange={(checked) => onSelectAll(Boolean(checked))}
                aria-label="Chọn tất cả vé"
              />
            </TableHead>
            <TableHead className="px-2 h-9">Mã vé</TableHead>
            <TableHead className="px-2 h-9">Khách hàng</TableHead>
            <TableHead className="px-2 h-9">Sự kiện</TableHead>
            <TableHead className="px-2 h-9">Ghế</TableHead>
            <TableHead className="px-2 h-9">Loại vé</TableHead>
            <TableHead className="px-2 h-9">Trạng thái check-in</TableHead>
            <TableHead className="px-2 h-9">Thời gian check-in</TableHead>
            <TableHead className="w-12 px-2 text-right h-9">Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tickets.map((ticket) => (
              <TableRow
                key={ticket.id}
                data-state={selectedIds.has(ticket.id) ? 'selected' : undefined}
              >
                <TableCell className="px-2 py-1.5">
                  <Checkbox
                    checked={selectedIds.has(ticket.id)}
                    onCheckedChange={(checked) =>
                      onSelectRow(ticket.id, Boolean(checked))
                    }
                    aria-label={`Chọn vé ${ticket.ticketCode}`}
                  />
                </TableCell>
                <TableCell className="max-w-35 truncate px-2 py-1.5 font-medium font-mono text-xs">
                  {ticket.ticketCode}
                </TableCell>
                <TableCell className="px-2 py-1.5">
                  <div className="min-w-0">
                    <p className="font-medium truncate">{ticket.customerName}</p>
                    <p className="text-xs truncate text-muted-foreground">
                      {ticket.customerEmail}
                    </p>
                  </div>
                </TableCell>
                <TableCell className="max-w-40 truncate px-2 py-1.5 text-muted-foreground">
                  {ticket.eventTitle}
                </TableCell>
                <TableCell className="px-2 py-1.5 font-medium">
                  {ticket.seatLabel}
                </TableCell>
                <TableCell className="px-2 py-1.5 text-muted-foreground">
                  {ticket.ticketTypeName}
                </TableCell>
                <TableCell className="px-2 py-1.5">
                  <CheckInBadge isCheckedIn={ticket.isCheckedIn} />
                </TableCell>
                <TableCell className="px-2 py-1.5 text-muted-foreground">
                  {formatCheckedInAt(ticket.checkedInAt)}
                </TableCell>
                <TableCell className="px-2 py-1.5 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="cursor-pointer"
                          aria-label={`Hành động cho vé`}
                        >
                          <MoreHorizontal className="size-4" />
                        </Button>
                      }
                    />
                    <DropdownMenuContent align="end" className="w-52">
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => onView(ticket)}
                      >
                        <Eye className="size-4" />
                        Xem chi tiết
                      </DropdownMenuItem>
                      {!ticket.isCheckedIn ? (
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={() => onCheckIn(ticket)}
                        >
                          <CheckCircle2 className="size-4" />
                          Đánh dấu đã check-in
                        </DropdownMenuItem>
                      ) : null}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        variant="destructive"
                        className="cursor-pointer"
                        onClick={() => onDelete(ticket)}
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

export default TicketTable;
