import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { USER_ROLE_OPTIONS } from '@/pages/(admin)/Users/data';

function UserRoleDialog({ open, user, onOpenChange, onSave }) {
  const [role, setRole] = useState('USER');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open && user) {
      setRole(user.role ?? 'USER');
    }
  }, [open, user]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    try {
      await Promise.resolve(onSave(role));
      onOpenChange(false);
    } catch {
      /* lỗi do parent xử lý; giữ dialog mở */
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" showCloseButton>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Chỉnh sửa vai trò</DialogTitle>
            <DialogDescription>
              Cập nhật quyền truy cập cho tài khoản người dùng.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-3 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="user-full-name">Tên người dùng</Label>
              <Input
                id="user-full-name"
                value={user.fullName}
                readOnly
                className="h-9 bg-muted"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="user-role">Vai trò</Label>
              <Select
                value={role}
                onValueChange={(value) => setRole(value ?? 'USER')}
                disabled={submitting}
              >
                <SelectTrigger id="user-role" className="h-9 w-full">
                  <SelectValue placeholder="Chọn vai trò" />
                </SelectTrigger>
                <SelectContent>
                  {USER_ROLE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="mt-2 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              className="h-9 cursor-pointer"
              disabled={submitting}
              onClick={() => onOpenChange(false)}
            >
              Hủy
            </Button>
            <Button type="submit" className="h-9 cursor-pointer" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="animate-spin" />
                  Đang lưu…
                </>
              ) : (
                'Lưu thay đổi'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default UserRoleDialog;
