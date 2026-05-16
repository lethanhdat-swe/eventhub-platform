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
import { getErrorMessage } from '@/lib/http/apiError';
import {
  COUPON_STATUS_OPTIONS,
  toDatetimeLocalValue,
} from '@/pages/(admin)/Coupons/data';

const EMPTY_VALUES = {
  code: '',
  description: '',
  discountPercent: '',
  usageLimit: '',
  validUntil: '',
  status: 'ACTIVE',
};

function CouponFormDialog({
  open,
  mode,
  initialValues = EMPTY_VALUES,
  onOpenChange,
  onSave,
}) {
  const [form, setForm] = useState(EMPTY_VALUES);
  const [codeError, setCodeError] = useState('');
  const [discountError, setDiscountError] = useState('');
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
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
      setCodeError('');
      setDiscountError('');
      setFormError('');
    }
  }, [open, mode, initialValues]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError('');
    const code = form.code.trim();
    if (code.length < 3) {
      setCodeError('Mã giảm giá phải có ít nhất 3 ký tự.');
      return;
    }
    setCodeError('');

    const discountPercent = Number(form.discountPercent);
    if (
      form.discountPercent === '' ||
      Number.isNaN(discountPercent) ||
      discountPercent < 1 ||
      discountPercent > 100
    ) {
      setDiscountError('Nhập phần trăm giảm từ 1 đến 100.');
      return;
    }
    setDiscountError('');

    const usageLimit =
      form.usageLimit === '' ? null : Number(form.usageLimit);
    if (form.usageLimit !== '' && (Number.isNaN(usageLimit) || usageLimit < 1)) {
      setFormError('Giới hạn lượt dùng phải là số nguyên dương.');
      return;
    }

    setSubmitting(true);
    try {
      await onSave({
        code: code.toUpperCase(),
        description: form.description.trim(),
        discountPercent,
        usageLimit,
        validUntil: form.validUntil
          ? new Date(form.validUntil).toISOString()
          : null,
        status: form.status,
      });
    } catch (e) {
      setFormError(getErrorMessage(e));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" showCloseButton>
        <form onSubmit={(e) => void handleSubmit(e)}>
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
            {formError ? (
              <p className="text-sm text-destructive" role="alert">
                {formError}
              </p>
            ) : null}

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
                disabled={submitting}
                aria-invalid={Boolean(codeError)}
              />
              {codeError ? (
                <p className="text-xs text-destructive">{codeError}</p>
              ) : null}
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
                disabled={submitting}
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="coupon-discount">Phần trăm giảm</Label>
                <Input
                  id="coupon-discount"
                  type="number"
                  min={1}
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
                  disabled={submitting}
                  aria-invalid={Boolean(discountError)}
                />
                {discountError ? (
                  <p className="text-xs text-destructive">{discountError}</p>
                ) : null}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="coupon-limit">Giới hạn lượt dùng</Label>
                <Input
                  id="coupon-limit"
                  type="number"
                  min={1}
                  value={form.usageLimit}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      usageLimit: event.target.value,
                    }))
                  }
                  placeholder="Không giới hạn"
                  className="h-9"
                  disabled={submitting}
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
                disabled={submitting}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="coupon-status">Trạng thái</Label>
              <Select
                value={form.status}
                onValueChange={(value) =>
                  setForm((prev) => ({ ...prev, status: value ?? 'ACTIVE' }))
                }
                disabled={submitting}
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
              disabled={submitting}
              onClick={() => onOpenChange(false)}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              className="h-9 cursor-pointer"
              disabled={submitting}
            >
              {submitting ? 'Đang lưu…' : 'Lưu mã'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CouponFormDialog;
