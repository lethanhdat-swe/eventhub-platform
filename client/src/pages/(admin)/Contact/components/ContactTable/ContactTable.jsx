import { Eye, MoreHorizontal, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
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

import AdminTableWrapper from '@/pages/(admin)/components/table/AdminTableWrapper';
import { SortableTableHead } from '@/pages/(admin)/components/table';

import { formatCreatedAt } from '@/pages/(admin)/Users/data';

function ContactTable({
  contacts,
  selectedIds,
  sortBy,
  sortOrder,
  onSort,
  onSelectAll,
  onSelectRow,
  onDelete,
  onViewDetail,
}) {
  const selectedCount = selectedIds.size;

  const allSelected =
    contacts.length > 0 &&
    selectedCount === contacts.length;

  const someSelected =
    selectedCount > 0 &&
    selectedCount < contacts.length;

  const headerChecked = allSelected
    ? true
    : someSelected
    ? 'indeterminate'
    : false;

  return (
    <AdminTableWrapper>
      <Table className="min-w-190">
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            <TableHead className="w-10 px-2 h-9">
              <Checkbox
                checked={headerChecked}
                onCheckedChange={(checked) =>
                  onSelectAll(Boolean(checked))
                }
                aria-label="Chọn tất cả liên hệ"
              />
            </TableHead>

            <SortableTableHead
              field="fullName"
              label="Khách hàng"
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSort={onSort}
            />

            <TableHead className="px-2 h-9">
              Số điện thoại
            </TableHead>

            <TableHead className="px-2 h-9">
              Nội dung
            </TableHead>

            <SortableTableHead
              field="createdAt"
              label="Ngày gửi"
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSort={onSort}
            />

            <TableHead className="w-12 px-2 text-right h-9">
              Hành động
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {contacts.map((contact) => (
            <TableRow
              key={contact.id}
              data-state={
                selectedIds.has(contact.id)
                  ? 'selected'
                  : undefined
              }
            >
              <TableCell className="px-2 py-1.5">
                <Checkbox
                  checked={selectedIds.has(contact.id)}
                  onCheckedChange={(checked) =>
                    onSelectRow(
                      contact.id,
                      Boolean(checked)
                    )
                  }
                  aria-label={`Chọn ${contact.fullName}`}
                />
              </TableCell>

              <TableCell className="px-2 py-1.5">
                <div className="flex flex-col">
                  <span className="font-medium">
                    {contact.fullName}
                  </span>

                  <span className="text-xs text-muted-foreground">
                    {contact.email}
                  </span>
                </div>
              </TableCell>

              <TableCell className="px-2 py-1.5 text-muted-foreground">
                {contact.phoneNumber ?? '—'}
              </TableCell>

              <TableCell className="px-2 py-1.5 max-w-65">
                <p className="text-sm truncate text-muted-foreground">
                  {contact.message}
                </p>
              </TableCell>

              <TableCell className="px-2 py-1.5 text-muted-foreground">
                {formatCreatedAt(contact.createdAt)}
              </TableCell>

              <TableCell className="px-2 py-1.5 text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="cursor-pointer"
                        aria-label={`Hành động cho ${contact.fullName}`}
                      >
                        <MoreHorizontal className="size-4" />
                      </Button>
                    }
                  />

                  <DropdownMenuContent
                    align="end"
                    className="w-44"
                  >
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() =>
                        onViewDetail(contact)
                      }
                    >
                      <Eye className="size-4" />
                      Xem chi tiết
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      variant="destructive"
                      className="cursor-pointer"
                      onClick={() => onDelete(contact)}
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

export default ContactTable;