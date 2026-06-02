import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';

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
import { formatPriceVnd } from '@/pages/(admin)/TicketTypes/data';

function TicketTypeTable({
  ticketTypes,
  selectedIds,
  onSelectAll,
  onSelectRow,
  onEdit,
  onDelete,
}) {
  const selectedCount = selectedIds.size;
  const allSelected =
    ticketTypes.length > 0 && selectedCount === ticketTypes.length;
  const someSelected = selectedCount > 0 && selectedCount < ticketTypes.length;

  const headerChecked = allSelected
    ? true
    : someSelected
      ? 'indeterminate'
      : false;

  return (
    <AdminTableWrapper>
      <Table className="min-w-225">
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            <TableHead className="w-10 px-2 h-9">
              <Checkbox
                checked={headerChecked}
                onCheckedChange={(checked) => onSelectAll(Boolean(checked))}
                aria-label="Chọn tất cả loại vé"
              />
            </TableHead>
            <TableHead className="px-2 h-9">Tên loại vé</TableHead>
            <TableHead className="px-2 h-9">Màu</TableHead>
            <TableHead className="px-2 h-9">Giá</TableHead>
            <TableHead className="w-12 px-2 text-right h-9">
              Hành động
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ticketTypes.map((type) => (
            <TableRow
              key={type.id}
              data-state={selectedIds.has(type.id) ? 'selected' : undefined}
            >
              <TableCell className="px-2 py-1.5">
                <Checkbox
                  checked={selectedIds.has(type.id)}
                  onCheckedChange={(checked) =>
                    onSelectRow(type.id, Boolean(checked))
                  }
                  aria-label={`Chọn ${type.name}`}
                />
              </TableCell>
              <TableCell className="px-2 py-1.5 font-medium">
                {type.name}
              </TableCell>
              <TableCell className="px-2 py-1.5">
                <span className="inline-flex items-center gap-2">
                  <span
                    className="size-3.5 shrink-0 rounded-sm border border-border"
                    style={{ backgroundColor: type.color }}
                    aria-hidden
                  />
                  <span className="font-mono text-xs text-muted-foreground">
                    {type.color}
                  </span>
                </span>
              </TableCell>
              <TableCell className="px-2 py-1.5 text-muted-foreground">
                {formatPriceVnd(type.price)}
              </TableCell>
              <TableCell className="px-2 py-1.5 text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="cursor-pointer"
                        aria-label={`Hành động cho ${type.name}`}
                      >
                        <MoreHorizontal className="size-4" />
                      </Button>
                    }
                  />
                  <DropdownMenuContent align="end" className="w-52">
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => onEdit(type)}
                    >
                      <Pencil className="size-4" />
                      Chỉnh sửa
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      variant="destructive"
                      className="cursor-pointer"
                      onClick={() => onDelete(type)}
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

export default TicketTypeTable;
