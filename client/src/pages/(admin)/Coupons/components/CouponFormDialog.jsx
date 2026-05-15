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
import { COUPON_STATUS_OPTIONS } from '@/pages/(admin)/Coupons/data';

const EMPTY_VALUES = {
  code: '',
  description: '',
  discountPercent: '',
  usageLimit: '',
  validUntil: '',
  status: 'ACTIVE',
};

function toDatetimeLocalValue(iso) {
  if (!iso) return '';
  const date = new Date(iso);
  const pad = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function CouponFormDialog({
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
        code: initialValues.code ?? '',
        description: initialValues.description ?? '',
        discountPercent: String(initialValues.discountPercent ?? ''),
        usageLimit:
          initialValues.usageLimit == null
            ? ''
            : String(initialValues.usageLimit),
        validUntil: toDatetimeLocalValue(initialValues.validUntil),
        status: initialValues.status ?? 'ACTIVE',
      });
    }
  }, [open, initialValues]);

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave({
      code: form.code.trim().toUpperCase(),
      description: form.description.trim(),
      discountPercent: Number(form.discountPercent),
      usageLimit: form.usageLimit === '' ? null : Number(form.usageLimit),
      validUntil: form.validUntil
        ? new Date(form.validUntil).toISOString()
        : null,
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
              {isCreate ? 'Thêm mã giảm giá' : 'Chỉnh sửa mã giảm giá'}
            </DialogTitle>
            <DialogDescription>
              {isCreate
                ? 'Tạo mã giảm giá mới cho đơn đặt vé.'
                : 'Cập nhật thông tin mã giảm giá.'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid max-h-[min(60vh,420px)] gap-3 overflow-y-auto py-2">
            <div className="space-y-1.5">
              <Label htmlFor="coupon-code">Mã giảm giá</Label>
              <Input
                id="coupon-code"
                value={form.code}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, code: event.target.value }))
                }
                placeholder="EVENTHUB10"
                className="h-9 uppercase"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="coupon-description">Mô tả</Label>
              <Textarea
                id="coupon-description"
                value={form.description}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    description: event.target.value,
                  }))
                }
                placeholder="Mô tả mã giảm giá"
                rows={3}
                className="min-h-[72px] resize-y"
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="coupon-discount">Phần trăm giảm</Label>
                <Input
                  id="coupon-discount"
                  type="number"
                  min={0}
                  max={100}
                  value={form.discountPercent}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      discountPercent: event.target.value,
                    }))
                  }
                  placeholder="10"
                  className="h-9"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="coupon-limit">Giới hạn lượt dùng</Label>
                <Input
                  id="coupon-limit"
                  type="number"
                  min={0}
                  value={form.usageLimit}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      usageLimit: event.target.value,
                    }))
                  }
                  placeholder="Không giới hạn"
                  className="h-9"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="coupon-valid-until">Hạn sử dụng</Label>
              <Input
                id="coupon-valid-until"
                type="datetime-local"
                value={form.validUntil}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    validUntil: event.target.value,
                  }))
                }
                className="h-9"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="coupon-status">Trạng thái</Label>
              <Select
                value={form.status}
                onValueChange={(value) =>
                  setForm((prev) => ({ ...prev, status: value ?? 'ACTIVE' }))
                }
              >
                <SelectTrigger id="coupon-status" className="h-9 w-full">
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  {COUPON_STATUS_OPTIONS.map((option) => (
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
              Lưu mã
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CouponFormDialog;
