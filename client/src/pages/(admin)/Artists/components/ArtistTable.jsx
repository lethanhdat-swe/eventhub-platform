import { Eye, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';

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
import StatusBadge from '@/pages/(admin)/components/StatusBadge';
import { formatCreatedAt } from '@/pages/(admin)/Artists/data';

function ArtistAvatar({ name, avatarUrl }) {
  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt=""
        className="size-10 shrink-0 rounded-full object-cover"
      />
    );
  }

  return (
    <div
      className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground"
      aria-hidden
    >
      {name?.charAt(0)?.toUpperCase() ?? '?'}
    </div>
  );
}

function ArtistTable({
  artists,
  selectedIds,
  onSelectAll,
  onSelectRow,
  onView,
  onEdit,
  onDelete,
}) {
  const selectedCount = selectedIds.size;
  const allSelected = artists.length > 0 && selectedCount === artists.length;
  const someSelected = selectedCount > 0 && selectedCount < artists.length;

  const headerChecked = allSelected
    ? true
    : someSelected
      ? 'indeterminate'
      : false;

  return (
    <AdminTableWrapper>
      <Table className="min-w-[800px]">
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            <TableHead className="h-9 w-10 px-2">
              <Checkbox
                checked={headerChecked}
                onCheckedChange={(checked) => onSelectAll(Boolean(checked))}
                aria-label="Chọn tất cả nghệ sĩ"
              />
            </TableHead>
            <TableHead className="h-9 px-2">Nghệ sĩ</TableHead>
            <TableHead className="h-9 px-2">Vai trò</TableHead>
            <TableHead className="h-9 px-2">Số sự kiện tham gia</TableHead>
            <TableHead className="h-9 px-2">Ngày tạo</TableHead>
            <TableHead className="h-9 px-2">Trạng thái</TableHead>
            <TableHead className="h-9 w-12 px-2 text-right">Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {artists.map((artist) => (
              <TableRow
                key={artist.id}
                data-state={selectedIds.has(artist.id) ? 'selected' : undefined}
              >
                <TableCell className="px-2 py-1.5">
                  <Checkbox
                    checked={selectedIds.has(artist.id)}
                    onCheckedChange={(checked) =>
                      onSelectRow(artist.id, Boolean(checked))
                    }
                    aria-label={`Chọn ${artist.name}`}
                  />
                </TableCell>
                <TableCell className="px-2 py-1.5">
                  <div className="flex items-center gap-2.5">
                    <ArtistAvatar
                      name={artist.name}
                      avatarUrl={artist.avatarUrl}
                    />
                    <div className="min-w-0">
                      <p className="truncate font-medium">{artist.name}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        /{artist.slug}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-2 py-1.5">
                  <Badge
                    variant="outline"
                    className="h-5 rounded-md px-1.5 text-xs font-medium"
                  >
                    {artist.roleLabel}
                  </Badge>
                </TableCell>
                <TableCell className="px-2 py-1.5 tabular-nums text-muted-foreground">
                  {artist.eventCount}
                </TableCell>
                <TableCell className="px-2 py-1.5 text-muted-foreground">
                  {formatCreatedAt(artist.createdAt)}
                </TableCell>
                <TableCell className="px-2 py-1.5">
                  <StatusBadge status={artist.status} />
                </TableCell>
                <TableCell className="px-2 py-1.5 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="cursor-pointer"
                          aria-label={`Hành động cho ${artist.name}`}
                        >
                          <MoreHorizontal className="size-4" />
                        </Button>
                      }
                    />
                    <DropdownMenuContent align="end" className="w-44">
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => onView(artist)}
                      >
                        <Eye className="size-4" />
                        Xem chi tiết
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => onEdit(artist)}
                      >
                        <Pencil className="size-4" />
                        Chỉnh sửa
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        variant="destructive"
                        className="cursor-pointer"
                        onClick={() => onDelete(artist)}
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

export default ArtistTable;
