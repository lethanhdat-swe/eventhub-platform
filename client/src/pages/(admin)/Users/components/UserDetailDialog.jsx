import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import UserEmailVerifiedBadge from '@/pages/(admin)/Users/components/UserEmailVerifiedBadge';
import {
  formatCreatedAt,
  formatLastLogin,
  formatProviderLabel,
  formatRoleLabel,
} from '@/pages/(admin)/Users/data';

function UserDetailDialog({ open, onOpenChange, user, loading }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" showCloseButton>
        <DialogHeader>
          <DialogTitle>Chi tiết người dùng</DialogTitle>
          <DialogDescription>
            Thông tin tài khoản chỉ đọc từ hệ thống.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <p className="py-4 text-sm text-muted-foreground">Đang tải...</p>
        ) : user ? (
          <div className="grid gap-3 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="detail-full-name">Họ tên</Label>
              <Input
                id="detail-full-name"
                value={user.fullName ?? ''}
                readOnly
                className="h-9 bg-muted"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="detail-email">Email</Label>
              <Input
                id="detail-email"
                value={user.email ?? ''}
                readOnly
                className="h-9 bg-muted"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="detail-phone">Số điện thoại</Label>
              <Input
                id="detail-phone"
                value={user.phoneNumber ?? '—'}
                readOnly
                className="h-9 bg-muted"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Vai trò</Label>
              <p className="text-sm">{formatRoleLabel(user.role)}</p>
            </div>
            <div className="space-y-1.5">
              <Label>Provider</Label>
              <p className="text-sm text-muted-foreground">
                {formatProviderLabel(user.provider)}
              </p>
            </div>
            <div className="space-y-1.5">
              <Label>Xác thực email</Label>
              <UserEmailVerifiedBadge isEmailVerified={user.isEmailVerified} />
            </div>
            <div className="space-y-1.5">
              <Label>Lần đăng nhập cuối</Label>
              <p className="text-sm text-muted-foreground">
                {formatLastLogin(user.lastLoginAt)}
              </p>
            </div>
            <div className="space-y-1.5">
              <Label>Ngày tạo</Label>
              <p className="text-sm text-muted-foreground">
                {formatCreatedAt(user.createdAt)}
              </p>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

export default UserDetailDialog;
