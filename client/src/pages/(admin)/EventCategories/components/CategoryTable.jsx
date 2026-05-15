import { CalendarDays, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';

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
import { formatCreatedAt } from '@/pages/(admin)/EventCategories/data';

function CategoryTable({
  categories,
  selectedIds,
  onSelectAll,
  onSelectRow,
  onEdit,
  onViewEvents,
  onDelete,
}) {
  const selectedCount = selectedIds.size;
  const allSelected =
    categories.length > 0 && selectedCount === categories.length;
  const someSelected = selectedCount > 0 && selectedCount < categories.length;

  const headerChecked = allSelected
    ? true
    : someSelected
      ? 'indeterminate'
      : false;

  return (
    <AdminTableWrapper>
      <Table className="min-w-[720px]">
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            <TableHead className="h-9 w-10 px-2">
              <Checkbox
                checked={headerChecked}
                onCheckedChange={(checked) => onSelectAll(Boolean(checked))}
                aria-label="Chọn tất cả danh mục"
              />
            </TableHead>
            <TableHead className="h-9 px-2">Tên danh mục</TableHead>
            <TableHead className="h-9 px-2">Slug</TableHead>
            <TableHead className="h-9 px-2">Số sự kiện</TableHead>
            <TableHead className="h-9 px-2">Ngày tạo</TableHead>
            <TableHead className="h-9 px-2">Trạng thái</TableHead>
            <TableHead className="h-9 w-12 px-2 text-right">Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
              <TableRow
                key={category.id}
                data-state={selectedIds.has(category.id) ? 'selected' : undefined}
              >
                <TableCell className="px-2 py-1.5">
                  <Checkbox
                    checked={selectedIds.has(category.id)}
                    onCheckedChange={(checked) =>
                      onSelectRow(category.id, Boolean(checked))
                    }
                    aria-label={`Chọn ${category.name}`}
                  />
                </TableCell>
                <TableCell className="px-2 py-1.5 font-medium">
                  {category.name}
                </TableCell>
                <TableCell className="px-2 py-1.5 text-muted-foreground">
                  /{category.slug}
                </TableCell>
                <TableCell className="px-2 py-1.5 tabular-nums text-muted-foreground">
                  {category.eventCount}
                </TableCell>
                <TableCell className="px-2 py-1.5 text-muted-foreground">
                  {formatCreatedAt(category.createdAt)}
                </TableCell>
                <TableCell className="px-2 py-1.5">
                  <StatusBadge status={category.status} />
                </TableCell>
                <TableCell className="px-2 py-1.5 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="cursor-pointer"
                          aria-label={`Hành động cho ${category.name}`}
                        >
                          <MoreHorizontal className="size-4" />
                        </Button>
                      }
                    />
                    <DropdownMenuContent align="end" className="w-44">
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => onEdit(category)}
                      >
                        <Pencil className="size-4" />
                        Chỉnh sửa
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => onViewEvents(category)}
                      >
                        <CalendarDays className="size-4" />
                        Xem sự kiện
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        variant="destructive"
                        className="cursor-pointer"
                        onClick={() => onDelete(category)}
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

export default CategoryTable;
