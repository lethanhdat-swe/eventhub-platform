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
import { getErrorMessage } from '@/lib/http/apiError';
import TicketTypeColorField from '@/pages/(admin)/TicketTypes/components/TicketTypeColorField';
import { DEFAULT_TICKET_COLOR, normalizeHexColor } from '@/pages/(admin)/TicketTypes/colorUtils';

const EMPTY_VALUES = {
  name: '',
  price: '',
  color: DEFAULT_TICKET_COLOR,
};

function TicketTypeFormDialog({
  open,
  mode,
  initialValues = EMPTY_VALUES,
  onOpenChange,
  onSave,
}) {
  const [form, setForm] = useState(EMPTY_VALUES);
  const [nameError, setNameError] = useState('');
  const [priceError, setPriceError] = useState('');
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const isCreate = mode === 'create';

  useEffect(() => {
    if (open) {
      setForm({
        name: initialValues.name ?? '',
        price: String(initialValues.price ?? ''),
        color: normalizeHexColor(initialValues.color ?? DEFAULT_TICKET_COLOR),
      });
      setNameError('');
      setPriceError('');
      setFormError('');
    }
  }, [open, initialValues.name, initialValues.price, initialValues.color]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError('');
    const name = form.name.trim();
    if (!name) {
      setNameError('Vui lòng nhập tên loại vé.');
      return;
    }
    setNameError('');

    const price = Number(form.price);
    if (form.price === '' || Number.isNaN(price) || price < 0) {
      setPriceError('Vui lòng nhập giá hợp lệ (số ≥ 0).');
      return;
    }
    setPriceError('');

    const color = normalizeHexColor(form.color);

    setSubmitting(true);
    try {
      await onSave({ name, price, color });
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
              {isCreate ? 'Thêm loại vé' : 'Chỉnh sửa loại vé'}
            </DialogTitle>
            <DialogDescription>
              {isCreate
                ? 'Tạo hạng vé mới với mức giá và màu hiển thị trên sơ đồ ghế.'
                : 'Cập nhật thông tin loại vé.'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-3 py-2">
            {formError ? (
              <p className="text-sm text-destructive" role="alert">
                {formError}
              </p>
            ) : null}

            <div className="space-y-1.5">
              <Label htmlFor="ticket-type-name">Tên loại vé</Label>
              <Input
                id="ticket-type-name"
                value={form.name}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, name: event.target.value }))
                }
                placeholder="Ví dụ: VIP"
                className="h-9"
                aria-invalid={Boolean(nameError)}
                disabled={submitting}
              />
              {nameError ? (
                <p className="text-xs text-destructive">{nameError}</p>
              ) : null}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ticket-type-price">Giá</Label>
              <Input
                id="ticket-type-price"
                type="number"
                min={0}
                value={form.price}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, price: event.target.value }))
                }
                placeholder="800000"
                className="h-9"
                aria-invalid={Boolean(priceError)}
                disabled={submitting}
              />
              {priceError ? (
                <p className="text-xs text-destructive">{priceError}</p>
              ) : null}
            </div>
            <TicketTypeColorField
              value={form.color}
              onChange={(color) =>
                setForm((prev) => ({ ...prev, color: normalizeHexColor(color) }))
              }
              disabled={submitting}
            />
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
              {submitting ? 'Đang lưu…' : 'Lưu loại vé'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default TicketTypeFormDialog;
