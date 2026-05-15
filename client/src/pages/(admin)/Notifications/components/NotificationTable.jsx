import { Eye, MoreHorizontal, Pencil, RotateCcw, Trash2 } from 'lucide-react';

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
import NotificationStatusBadge from '@/pages/(admin)/Notifications/components/NotificationStatusBadge';
import {
  formatAudience,
  formatChannel,
  formatCreatedAt,
} from '@/pages/(admin)/Notifications/data';

function NotificationTable({
  notifications,
  selectedIds,
  onSelectAll,
  onSelectRow,
  onView,
  onEdit,
  onResend,
  onDelete,
}) {
  const selectedCount = selectedIds.size;
  const allSelected =
    notifications.length > 0 && selectedCount === notifications.length;
  const someSelected =
    selectedCount > 0 && selectedCount < notifications.length;

  const headerChecked = allSelected
    ? true
    : someSelected
      ? 'indeterminate'
      : false;

  return (
    <AdminTableWrapper>
      <Table className="min-w-[960px]">
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            <TableHead className="h-9 w-10 px-2">
              <Checkbox
                checked={headerChecked}
                onCheckedChange={(checked) => onSelectAll(Boolean(checked))}
                aria-label="Chọn tất cả thông báo"
              />
            </TableHead>
            <TableHead className="h-9 px-2">Tiêu đề</TableHead>
            <TableHead className="h-9 px-2">Nội dung ngắn</TableHead>
            <TableHead className="h-9 px-2">Đối tượng nhận</TableHead>
            <TableHead className="h-9 px-2">Kênh gửi</TableHead>
            <TableHead className="h-9 px-2">Trạng thái</TableHead>
            <TableHead className="h-9 px-2">Ngày tạo</TableHead>
            <TableHead className="h-9 w-12 px-2 text-right">Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {notifications.map((notification) => (
              <TableRow
                key={notification.id}
                data-state={
                  selectedIds.has(notification.id) ? 'selected' : undefined
                }
              >
                <TableCell className="px-2 py-1.5">
                  <Checkbox
                    checked={selectedIds.has(notification.id)}
                    onCheckedChange={(checked) =>
                      onSelectRow(notification.id, Boolean(checked))
                    }
                    aria-label={`Chọn ${notification.title}`}
                  />
                </TableCell>
                <TableCell className="max-w-[160px] truncate px-2 py-1.5 font-medium">
                  {notification.title}
                </TableCell>
                <TableCell className="max-w-[200px] truncate px-2 py-1.5 text-muted-foreground">
                  {notification.shortContent}
                </TableCell>
                <TableCell className="px-2 py-1.5 text-muted-foreground">
                  {formatAudience(notification.audience)}
                </TableCell>
                <TableCell className="px-2 py-1.5 text-muted-foreground">
                  {formatChannel(notification.channel)}
                </TableCell>
                <TableCell className="px-2 py-1.5">
                  <NotificationStatusBadge status={notification.status} />
                </TableCell>
                <TableCell className="px-2 py-1.5 text-muted-foreground">
                  {formatCreatedAt(notification.createdAt)}
                </TableCell>
                <TableCell className="px-2 py-1.5 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="cursor-pointer"
                          aria-label={`Hành động cho ${notification.title}`}
                        >
                          <MoreHorizontal className="size-4" />
                        </Button>
                      }
                    />
                    <DropdownMenuContent align="end" className="w-44">
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => onView(notification)}
                      >
                        <Eye className="size-4" />
                        Xem chi tiết
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => onEdit(notification)}
                      >
                        <Pencil className="size-4" />
                        Chỉnh sửa
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => onResend(notification)}
                      >
                        <RotateCcw className="size-4" />
                        Gửi lại
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        variant="destructive"
                        className="cursor-pointer"
                        onClick={() => onDelete(notification)}
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

export default NotificationTable;
