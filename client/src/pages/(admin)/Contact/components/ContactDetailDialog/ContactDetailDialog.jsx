import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

function ContactDetailDialog({
  open,
  onOpenChange,
  contact,
  loading,
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" showCloseButton>
        <DialogHeader>
          <DialogTitle>Chi tiết liên hệ</DialogTitle>

          <DialogDescription>
            Thông tin liên hệ được gửi từ khách hàng.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <p className="py-4 text-sm text-muted-foreground">
            Đang tải...
          </p>
        ) : contact ? (
          <div className="grid gap-3 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="contact-full-name">
                Họ và tên
              </Label>

              <Input
                id="contact-full-name"
                value={contact.fullName ?? ''}
                readOnly
                className="h-9 bg-muted"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="contact-email">
                Email
              </Label>

              <Input
                id="contact-email"
                value={contact.email ?? ''}
                readOnly
                className="h-9 bg-muted"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="contact-phone">
                Số điện thoại
              </Label>

              <Input
                id="contact-phone"
                value={contact.phoneNumber ?? '—'}
                readOnly
                className="h-9 bg-muted"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="contact-message">
                Nội dung liên hệ
              </Label>

              <textarea
                id="contact-message"
                value={contact.message ?? ''}
                readOnly
                rows={5}
                className="w-full px-3 py-2 text-sm border rounded-md outline-none resize-none border-input bg-muted"
              />
            </div>

            <div className="space-y-1.5">
              <Label>Ngày gửi</Label>

              <p className="text-sm text-muted-foreground">
                {contact.createdAt
                  ? new Date(contact.createdAt).toLocaleString('vi-VN')
                  : '—'}
              </p>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

export default ContactDetailDialog;