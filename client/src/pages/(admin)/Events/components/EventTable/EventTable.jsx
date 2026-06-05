import { Eye, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import AdminTableWrapper from '@/pages/(admin)/components/table/AdminTableWrapper';
import SortableTableHead from '@/pages/(admin)/components/table/SortableTableHead';
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

import { resolvePublicAssetUrl } from '@/lib/url/resolvePublicAssetUrl';
import {
  formatCreatedAt,
  formatEventDateRange,
} from '@/pages/(admin)/Events/data';

function EventThumbnail({ title, thumbnailUrl }) {
  const src = thumbnailUrl ? resolvePublicAssetUrl(thumbnailUrl, '') : '';
  if (src) {
    return (
      <img
        src={src}
        alt=""
        className="size-10 shrink-0 rounded-md object-cover"
      />
    );
  }

  return (
    <div
      className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted text-xs font-medium text-muted-foreground"
      aria-hidden
    >
      {title?.charAt(0)?.toUpperCase() ?? '?'}
    </div>
  );
}

function EventTable({
  events,
  selectedIds,
  sortBy,
  sortOrder,
  onSort,
  onSelectAll,
  onSelectRow,
  onView,
  onEdit,
  onDelete,
}) {
  const selectedCount = selectedIds.size;
  const allSelected = events.length > 0 && selectedCount === events.length;
  const someSelected = selectedCount > 0 && selectedCount < events.length;

  const headerChecked = allSelected ? true : someSelected ? 'indeterminate' : false;

  return (
    <AdminTableWrapper>
      <Table className="min-w-[900px]">
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            <TableHead className="h-9 w-10 px-2">
              <Checkbox
                checked={headerChecked}
                onCheckedChange={(checked) => onSelectAll(Boolean(checked))}
                aria-label="Chọn tất cả sự kiện"
              />
            </TableHead>
            <SortableTableHead
              field="title"
              label="Sự kiện"
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
              field="location"
              label="Địa điểm"
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSort={onSort}
            />
            <SortableTableHead
              field="startDate"
              label="Thời gian diễn ra"
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
          {events.map((event) => (
              <TableRow
                key={event.id}
                data-state={selectedIds.has(event.id) ? 'selected' : undefined}
              >
                <TableCell className="px-2 py-1.5">
                  <Checkbox
                    checked={selectedIds.has(event.id)}
                    onCheckedChange={(checked) =>
                      onSelectRow(event.id, Boolean(checked))
                    }
                    aria-label={`Chọn ${event.title}`}
                  />
                </TableCell>
                <TableCell className="px-2 py-1.5">
                  <div className="flex items-center gap-2.5">
                    <EventThumbnail
                      title={event.title}
                      thumbnailUrl={event.thumbnailUrl}
                    />
                    <div className="min-w-0">
                      <p className="truncate font-medium">{event.title}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        /{event.slug}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-2 py-1.5 text-muted-foreground">
                  {event.category?.name ?? '—'}
                </TableCell>
                <TableCell className="max-w-[180px] truncate px-2 py-1.5 text-muted-foreground">
                  {event.location ?? '—'}
                </TableCell>
                <TableCell className="px-2 py-1.5 text-muted-foreground">
                  {formatEventDateRange(event.startDate, event.endDate)}
                </TableCell>
                <TableCell className="px-2 py-1.5">
                  <StatusBadge status={event.status} />
                </TableCell>
                <TableCell className="px-2 py-1.5 text-muted-foreground">
                  {formatCreatedAt(event.createdAt)}
                </TableCell>
                <TableCell className="px-2 py-1.5 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="cursor-pointer"
                          aria-label={`Hành động cho ${event.title}`}
                        >
                          <MoreHorizontal className="size-4" />
                        </Button>
                      }
                    />
                    <DropdownMenuContent align="end" className="w-44">
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => onView(event)}
                      >
                        <Eye className="size-4" />
                        Xem chi tiết
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => onEdit(event)}
                      >
                        <Pencil className="size-4" />
                        Chỉnh sửa
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        variant="destructive"
                        className="cursor-pointer"
                        onClick={() => onDelete(event)}
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

export default EventTable;
