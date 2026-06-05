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
import { resolvePublicAssetUrl } from '@/lib/url/resolvePublicAssetUrl';
import AdminTableWrapper from '@/pages/(admin)/components/table/AdminTableWrapper';
import { SortableTableHead } from '@/pages/(admin)/components/table';
import { formatBlogDate } from '@/pages/(admin)/Blogs/data';
import BlogStatusBadge from '../BlogStatusBadge/BlogStatusBadge';

function BlogTable({
  blogs,
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
  const allSelected = blogs.length > 0 && selectedCount === blogs.length;
  const someSelected = selectedCount > 0 && selectedCount < blogs.length;

  const headerChecked = allSelected
    ? true
    : someSelected
      ? 'indeterminate'
      : false;

  return (
    <AdminTableWrapper>
      <Table className="min-w-[1040px]">
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            <TableHead className="w-10 px-2 h-9">
              <Checkbox
                checked={headerChecked}
                onCheckedChange={(checked) => onSelectAll(Boolean(checked))}
                aria-label="Chọn tất cả bài viết"
              />
            </TableHead>
            <SortableTableHead
              field="title"
              label="Bài viết"
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSort={onSort}
            />
            <SortableTableHead
              field="category"
              label="Danh mục"
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSort={onSort}
            />
            <SortableTableHead
              field="status"
              label="Trạng thái"
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSort={onSort}
            />
            <SortableTableHead
              field="publishedAt"
              label="Ngày xuất bản"
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSort={onSort}
            />
            <SortableTableHead
              field="updatedAt"
              label="Cập nhật"
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSort={onSort}
            />
            <TableHead className="w-12 px-2 text-right h-9">Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {blogs.map((blog) => (
            <TableRow
              key={blog.id}
              data-state={selectedIds.has(blog.id) ? 'selected' : undefined}
            >
              <TableCell className="px-2 py-1.5">
                <Checkbox
                  checked={selectedIds.has(blog.id)}
                  onCheckedChange={(checked) =>
                    onSelectRow(blog.id, Boolean(checked))
                  }
                  aria-label={`Chọn ${blog.title}`}
                />
              </TableCell>
              <TableCell className="px-2 py-1.5">
                <div className="flex items-center min-w-0 gap-3">
                  <div className="overflow-hidden border rounded-lg size-12 shrink-0 bg-muted">
                    {blog.thumbnailUrl ? (
                      <img
                        src={resolvePublicAssetUrl(blog.thumbnailUrl, '')}
                        alt={blog.title}
                        className="object-cover size-full"
                      />
                    ) : null}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium truncate">{blog.title}</p>
                    <p className="text-xs truncate text-muted-foreground">
                      /{blog.slug}
                    </p>
                    <p className="mt-1 line-clamp-1 max-w-[360px] text-xs text-muted-foreground">
                      {blog.excerpt || 'Chưa có mô tả ngắn'}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="px-2 py-1.5 text-muted-foreground">
                {blog.categoryName}
              </TableCell>
              <TableCell className="px-2 py-1.5">
                <BlogStatusBadge status={blog.status} />
              </TableCell>
              <TableCell className="px-2 py-1.5 text-muted-foreground">
                {formatBlogDate(blog.publishedAt)}
              </TableCell>
              <TableCell className="px-2 py-1.5 text-muted-foreground">
                {formatBlogDate(blog.updatedAt ?? blog.createdAt)}
              </TableCell>
              <TableCell className="px-2 py-1.5 text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="cursor-pointer"
                        aria-label={`Hành động cho ${blog.title}`}
                      >
                        <MoreHorizontal className="size-4" />
                      </Button>
                    }
                  />
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => onEdit(blog)}
                    >
                      <Pencil className="size-4" />
                      Chỉnh sửa
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      variant="destructive"
                      className="cursor-pointer"
                      onClick={() => onDelete(blog)}
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

export default BlogTable;
