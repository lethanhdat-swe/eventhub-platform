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
import TicketTypeSelect from '@/pages/(admin)/DefaultSeats/components/TicketTypeSelect';

const EMPTY_VALUES = {
  rowLabel: '',
  fromSeatNumber: '',
  toSeatNumber: '',
  defaultTicketTypeId: '',
};

function validateForm(form) {
  const errors = {};
  const rowLabel = form.rowLabel.trim().toUpperCase();
  if (!rowLabel) errors.rowLabel = 'Vui lòng nhập hàng ghế.';
  const fromSeatNumber = Number(form.fromSeatNumber);
  const toSeatNumber = Number(form.toSeatNumber);
  if (
    form.fromSeatNumber === '' ||
    Number.isNaN(fromSeatNumber) ||
    fromSeatNumber <= 0
  ) {
    errors.fromSeatNumber = 'Số ghế bắt đầu phải lớn hơn 0.';
  }
  if (
    form.toSeatNumber === '' ||
    Number.isNaN(toSeatNumber) ||
    toSeatNumber <= 0
  ) {
    errors.toSeatNumber = 'Số ghế kết thúc phải lớn hơn 0.';
  }
  if (
    !errors.fromSeatNumber &&
    !errors.toSeatNumber &&
    toSeatNumber < fromSeatNumber
  ) {
    errors.toSeatNumber = 'Số ghế kết thúc phải ≥ số ghế bắt đầu.';
  }
  if (!form.defaultTicketTypeId) {
    errors.defaultTicketTypeId = 'Vui lòng chọn loại vé.';
  }
  return { errors, rowLabel, fromSeatNumber, toSeatNumber };
}

function AddRowDialog({
  open,
  ticketTypeOptions,
  onOpenChange,
  onSave,
}) {
  const [form, setForm] = useState(EMPTY_VALUES);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(EMPTY_VALUES);
      setFieldErrors({});
      setFormError('');
    }
  }, [open]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError('');
    const { errors, rowLabel, fromSeatNumber, toSeatNumber } = validateForm(form);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    setSubmitting(true);
    try {
      await onSave({
        rowLabel,
        fromSeatNumber,
        toSeatNumber,
        defaultTicketTypeId: form.defaultTicketTypeId,
      });
      onOpenChange(false);
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
            <DialogTitle>Thêm hàng ghế</DialogTitle>
            <DialogDescription>
              Tạo nhiều ghế liên tiếp trong cùng một hàng.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-3 py-2">
            {formError ? (
              <p className="text-sm text-destructive" role="alert">
                {formError}
              </p>
            ) : null}

            <div className="space-y-1.5">
              <Label htmlFor="add-row-label">Hàng ghế</Label>
              <Input
                id="add-row-label"
                value={form.rowLabel}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, rowLabel: event.target.value }))
                }
                placeholder="A"
                className="h-9"
                disabled={submitting}
                aria-invalid={Boolean(fieldErrors.rowLabel)}
              />
              {fieldErrors.rowLabel ? (
                <p className="text-xs text-destructive">{fieldErrors.rowLabel}</p>
              ) : null}
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="add-row-from">Từ số ghế</Label>
                <Input
                  id="add-row-from"
                  type="number"
                  min={1}
                  value={form.fromSeatNumber}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      fromSeatNumber: event.target.value,
                    }))
                  }
                  placeholder="1"
                  className="h-9"
                  disabled={submitting}
                  aria-invalid={Boolean(fieldErrors.fromSeatNumber)}
                />
                {fieldErrors.fromSeatNumber ? (
                  <p className="text-xs text-destructive">
                    {fieldErrors.fromSeatNumber}
                  </p>
                ) : null}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="add-row-to">Đến số ghế</Label>
                <Input
                  id="add-row-to"
                  type="number"
                  min={1}
                  value={form.toSeatNumber}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      toSeatNumber: event.target.value,
                    }))
                  }
                  placeholder="10"
                  className="h-9"
                  disabled={submitting}
                  aria-invalid={Boolean(fieldErrors.toSeatNumber)}
                />
                {fieldErrors.toSeatNumber ? (
                  <p className="text-xs text-destructive">
                    {fieldErrors.toSeatNumber}
                  </p>
                ) : null}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="add-row-ticket-type">Loại vé mặc định</Label>
              <TicketTypeSelect
                id="add-row-ticket-type"
                value={form.defaultTicketTypeId}
                onValueChange={(value) =>
                  setForm((prev) => ({
                    ...prev,
                    defaultTicketTypeId: value,
                  }))
                }
                options={ticketTypeOptions}
                disabled={submitting}
                invalid={Boolean(fieldErrors.defaultTicketTypeId)}
              />
              {fieldErrors.defaultTicketTypeId ? (
                <p className="text-xs text-destructive">
                  {fieldErrors.defaultTicketTypeId}
                </p>
              ) : null}
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
              {submitting ? 'Đang tạo…' : 'Tạo hàng'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AddRowDialog;
