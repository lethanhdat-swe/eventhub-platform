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
import { Textarea } from '@/components/ui/textarea';
import {
  NOTIFICATION_AUDIENCE_OPTIONS,
  NOTIFICATION_CHANNEL_OPTIONS,
  NOTIFICATION_STATUS_OPTIONS,
} from '@/pages/(admin)/Notifications/data';

const EMPTY_VALUES = {
  title: '',
  shortContent: '',
  audience: 'all',
  channel: 'in_app',
  status: 'draft',
};

function NotificationFormDialog({
  open,
  mode,
  initialValues = EMPTY_VALUES,
  onOpenChange,
  onSave,
}) {
  const [form, setForm] = useState(EMPTY_VALUES);
  const isCreate = mode === 'create';

  useEffect(() => {
    if (open) {
      setForm({
        title: initialValues.title ?? '',
        shortContent: initialValues.shortContent ?? '',
        audience: initialValues.audience ?? 'all',
        channel: initialValues.channel ?? 'in_app',
        status: initialValues.status ?? 'draft',
      });
    }
  }, [open, initialValues]);

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave({
      title: form.title.trim(),
      shortContent: form.shortContent.trim(),
      audience: form.audience,
      channel: form.channel,
      status: form.status,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" showCloseButton>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {isCreate ? 'Tạo thông báo' : 'Chỉnh sửa thông báo'}
            </DialogTitle>
            <DialogDescription>
              {isCreate
                ? 'Soạn thông báo gửi đến người dùng trong hệ thống.'
                : 'Cập nhật nội dung và cài đặt gửi thông báo.'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid max-h-[min(60vh,420px)] gap-3 overflow-y-auto py-2">
            <div className="space-y-1.5">
              <Label htmlFor="notification-title">Tiêu đề</Label>
              <Input
                id="notification-title"
                value={form.title}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, title: event.target.value }))
                }
                placeholder="Tiêu đề thông báo"
                className="h-9"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="notification-content">Nội dung</Label>
              <Textarea
                id="notification-content"
                value={form.shortContent}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    shortContent: event.target.value,
                  }))
                }
                placeholder="Nội dung thông báo"
                rows={4}
                className="min-h-[96px] resize-y"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="notification-audience">Đối tượng nhận</Label>
              <Select
                value={form.audience}
                onValueChange={(value) =>
                  setForm((prev) => ({ ...prev, audience: value ?? 'all' }))
                }
              >
                <SelectTrigger id="notification-audience" className="h-9 w-full">
                  <SelectValue placeholder="Chọn đối tượng" />
                </SelectTrigger>
                <SelectContent>
                  {NOTIFICATION_AUDIENCE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="notification-channel">Kênh gửi</Label>
              <Select
                value={form.channel}
                onValueChange={(value) =>
                  setForm((prev) => ({ ...prev, channel: value ?? 'in_app' }))
                }
              >
                <SelectTrigger id="notification-channel" className="h-9 w-full">
                  <SelectValue placeholder="Chọn kênh" />
                </SelectTrigger>
                <SelectContent>
                  {NOTIFICATION_CHANNEL_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="notification-status">Trạng thái</Label>
              <Select
                value={form.status}
                onValueChange={(value) =>
                  setForm((prev) => ({ ...prev, status: value ?? 'draft' }))
                }
              >
                <SelectTrigger id="notification-status" className="h-9 w-full">
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  {NOTIFICATION_STATUS_OPTIONS.map((option) => (
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
              onClick={() => onOpenChange(false)}
            >
              Hủy
            </Button>
            <Button type="submit" className="h-9 cursor-pointer">
              Lưu thông báo
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default NotificationFormDialog;
