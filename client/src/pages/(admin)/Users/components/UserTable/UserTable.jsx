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
import UserEmailVerifiedBadge from '@/pages/(admin)/Users/components/UserEmailVerifiedBadge/UserEmailVerifiedBadge';
import {
  formatCreatedAt,
  formatLastLogin,
  formatProviderLabel,
  formatRoleLabel,
} from '@/pages/(admin)/Users/data';

function UserAvatar({ fullName, avatarUrl }) {
  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt=""
        className="object-cover rounded-full size-10 shrink-0"
      />
    );
  }

  const initials =
    fullName
      ?.trim()
      .split(/\s+/)
      .map((part) => part.charAt(0))
      .slice(0, 2)
      .join('')
      .toUpperCase() || '?';

  return (
    <div
      className="flex items-center justify-center text-xs font-medium rounded-full size-10 shrink-0 bg-muted text-muted-foreground"
      aria-hidden
    >
      {initials}
    </div>
  );
}

function UserTable({
  users,
  selectedIds,
  onSelectAll,
  onSelectRow,
  onView,
  onEdit,
  onDelete,
}) {
  const selectedCount = selectedIds.size;
  const allSelected = users.length > 0 && selectedCount === users.length;
  const someSelected = selectedCount > 0 && selectedCount < users.length;

  const headerChecked = allSelected
    ? true
    : someSelected
      ? 'indeterminate'
      : false;

  return (
    <AdminTableWrapper>
      <Table className="min-w-275">
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            <TableHead className="w-10 px-2 h-9">
              <Checkbox
                checked={headerChecked}
                onCheckedChange={(checked) => onSelectAll(Boolean(checked))}
                aria-label="Chọn tất cả người dùng"
              />
            </TableHead>
            <TableHead className="px-2 h-9">Người dùng</TableHead>
            <TableHead className="px-2 h-9">Số điện thoại</TableHead>
            <TableHead className="px-2 h-9">Vai trò</TableHead>
            <TableHead className="px-2 h-9">Provider</TableHead>
            <TableHead className="px-2 h-9">Xác thực email</TableHead>
            <TableHead className="px-2 h-9">Lần đăng nhập cuối</TableHead>
            <TableHead className="px-2 h-9">Ngày tạo</TableHead>
            <TableHead className="w-12 px-2 text-right h-9">Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow
              key={user.id}
              data-state={selectedIds.has(user.id) ? 'selected' : undefined}
            >
              <TableCell className="px-2 py-1.5">
                <Checkbox
                  checked={selectedIds.has(user.id)}
                  onCheckedChange={(checked) =>
                    onSelectRow(user.id, Boolean(checked))
                  }
                  aria-label={`Chọn ${user.fullName}`}
                />
              </TableCell>
              <TableCell className="px-2 py-1.5">
                <div className="flex items-center gap-2.5">
                  <UserAvatar
                    fullName={user.fullName}
                    avatarUrl={user.avatarUrl}
                  />
                  <div className="min-w-0">
                    <p className="font-medium truncate">{user.fullName}</p>
                    <p className="text-xs truncate text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="px-2 py-1.5 tabular-nums text-muted-foreground">
                {user.phoneNumber ?? '—'}
              </TableCell>
              <TableCell className="px-2 py-1.5">
                <Badge
                  variant="outline"
                  className="h-5 rounded-md px-1.5 text-xs font-medium"
                >
                  {formatRoleLabel(user.role)}
                </Badge>
              </TableCell>
              <TableCell className="px-2 py-1.5 text-muted-foreground">
                {formatProviderLabel(user.provider)}
              </TableCell>
              <TableCell className="px-2 py-1.5">
                <UserEmailVerifiedBadge
                  isEmailVerified={user.isEmailVerified}
                />
              </TableCell>
              <TableCell className="px-2 py-1.5 text-muted-foreground">
                {formatLastLogin(user.lastLoginAt)}
              </TableCell>
              <TableCell className="px-2 py-1.5 text-muted-foreground">
                {formatCreatedAt(user.createdAt)}
              </TableCell>
              <TableCell className="px-2 py-1.5 text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="cursor-pointer"
                        aria-label={`Hành động cho ${user.fullName}`}
                      >
                        <MoreHorizontal className="size-4" />
                      </Button>
                    }
                  />
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => onView(user)}
                    >
                      <Eye className="size-4" />
                      Xem chi tiết
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => onEdit(user)}
                    >
                      <Pencil className="size-4" />
                      Chỉnh sửa
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      variant="destructive"
                      className="cursor-pointer"
                      onClick={() => onDelete(user)}
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

export default UserTable;
