import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';

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
import { SortableTableHead } from '@/pages/(admin)/components/table';
import { formatBlogCategoryDate } from '@/pages/(admin)/BlogCategories/data';

function BlogCategoryTable({
  categories,
  selectedIds,
  sortBy,
  sortOrder,
  onSort,
  onSelectAll,
  onSelectRow,
  onEdit,
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
      <Table className="min-w-[760px]">
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            <TableHead className="h-9 w-10 px-2">
              <Checkbox
                checked={headerChecked}
                onCheckedChange={(checked) => onSelectAll(Boolean(checked))}
                aria-label="Chọn tất cả danh mục blog"
              />
            </TableHead>
            <SortableTableHead
              field="name"
              label="Tên danh mục"
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSort={onSort}
            />
            <SortableTableHead
              field="slug"
              label="Slug"
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSort={onSort}
            />
            <SortableTableHead
              field="createdAt"
              label="Ngày tạo"
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSort={onSort}
            />
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
              <TableCell className="px-2 py-1.5 text-muted-foreground">
                {formatBlogCategoryDate(category.createdAt)}
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
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => onEdit(category)}
                    >
                      <Pencil className="size-4" />
                      Chỉnh sửa
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

export default BlogCategoryTable;
