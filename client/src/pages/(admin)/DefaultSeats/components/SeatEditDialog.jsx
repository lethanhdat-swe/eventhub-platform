import { useEffect, useState } from 'react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getErrorMessage } from '@/lib/http/apiError';
import TicketTypeSelect from '@/pages/(admin)/DefaultSeats/components/TicketTypeSelect';
import { formatSeatCode } from '@/pages/(admin)/DefaultSeats/seatMapUtils';

function validateForm(form) {
  const errors = {};
  const rowLabel = form.rowLabel.trim().toUpperCase();
  if (!rowLabel) errors.rowLabel = 'Vui lòng nhập hàng ghế.';
  const seatNumber = Number(form.seatNumber);
  if (form.seatNumber === '' || Number.isNaN(seatNumber) || seatNumber <= 0) {
    errors.seatNumber = 'Số ghế phải lớn hơn 0.';
  }
  if (!form.defaultTicketTypeId) {
    errors.defaultTicketTypeId = 'Vui lòng chọn loại vé.';
  }
  return { errors, rowLabel, seatNumber };
}

function SeatEditDialog({
  open,
  seat,
  ticketTypeOptions,
  onOpenChange,
  onSave,
  onDelete,
}) {
  const [form, setForm] = useState({
    rowLabel: '',
    seatNumber: '',
    defaultTicketTypeId: '',
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (open && seat) {
      setForm({
        rowLabel: seat.rowLabel ?? '',
        seatNumber: String(seat.seatNumber ?? ''),
        defaultTicketTypeId: seat.defaultTicketTypeId ?? '',
      });
      setFieldErrors({});
      setFormError('');
      setDeleteConfirmOpen(false);
    }
  }, [open, seat]);

  if (!seat) return null;

  const seatCode = formatSeatCode(seat.rowLabel, seat.seatNumber);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError('');
    const { errors, rowLabel, seatNumber } = validateForm(form);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    setSubmitting(true);
    try {
      await onSave(seat.id, {
        rowLabel,
        seatNumber,
        defaultTicketTypeId: form.defaultTicketTypeId,
      });
      onOpenChange(false);
    } catch (e) {
      setFormError(getErrorMessage(e));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setDeleting(true);
    setFormError('');
    try {
      await onDelete(seat.id);
      setDeleteConfirmOpen(false);
      onOpenChange(false);
    } catch (e) {
      setFormError(getErrorMessage(e));
      setDeleteConfirmOpen(false);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md" showCloseButton>
          <form onSubmit={(e) => void handleSubmit(e)}>
            <DialogHeader>
              <DialogTitle>Chỉnh sửa ghế {seatCode}</DialogTitle>
            </DialogHeader>

            <div className="grid gap-3 py-2">
              {formError ? (
                <p className="text-sm text-destructive" role="alert">
                  {formError}
                </p>
              ) : null}

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="edit-seat-row">Hàng ghế</Label>
                  <Input
                    id="edit-seat-row"
                    value={form.rowLabel}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, rowLabel: event.target.value }))
                    }
                    className="h-9"
                    disabled={submitting || deleting}
                    aria-invalid={Boolean(fieldErrors.rowLabel)}
                  />
                  {fieldErrors.rowLabel ? (
                    <p className="text-xs text-destructive">{fieldErrors.rowLabel}</p>
                  ) : null}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="edit-seat-number">Số ghế</Label>
                  <Input
                    id="edit-seat-number"
                    type="number"
                    min={1}
                    value={form.seatNumber}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, seatNumber: event.target.value }))
                    }
                    className="h-9"
                    disabled={submitting || deleting}
                    aria-invalid={Boolean(fieldErrors.seatNumber)}
                  />
                  {fieldErrors.seatNumber ? (
                    <p className="text-xs text-destructive">{fieldErrors.seatNumber}</p>
                  ) : null}
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="edit-seat-ticket-type">Loại vé mặc định</Label>
                <TicketTypeSelect
                  id="edit-seat-ticket-type"
                  value={form.defaultTicketTypeId}
                  onValueChange={(value) =>
                    setForm((prev) => ({
                      ...prev,
                      defaultTicketTypeId: value,
                    }))
                  }
                  options={ticketTypeOptions}
                  fallbackType={seat.defaultTicketType}
                  disabled={submitting || deleting}
                  invalid={Boolean(fieldErrors.defaultTicketTypeId)}
                />
                {fieldErrors.defaultTicketTypeId ? (
                  <p className="text-xs text-destructive">
                    {fieldErrors.defaultTicketTypeId}
                  </p>
                ) : null}
              </div>
            </div>

            <DialogFooter className="mt-2 flex-col gap-2 sm:flex-row sm:justify-between">
              <Button
                type="button"
                variant="destructive"
                className="h-9 cursor-pointer sm:mr-auto"
                disabled={submitting || deleting}
                onClick={() => setDeleteConfirmOpen(true)}
              >
                Xóa ghế
              </Button>
              <div className="flex gap-2 sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  className="h-9 cursor-pointer"
                  disabled={submitting || deleting}
                  onClick={() => onOpenChange(false)}
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  className="h-9 cursor-pointer"
                  disabled={submitting || deleting}
                >
                  {submitting ? 'Đang lưu…' : 'Lưu thay đổi'}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader className="text-left sm:text-left">
            <AlertDialogTitle>Xóa ghế</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc muốn xóa ghế &quot;{seatCode}&quot;? Hành động không thể hoàn
              tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer" disabled={deleting}>
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              className="cursor-pointer"
              disabled={deleting}
              onClick={(e) => {
                e.preventDefault();
                void handleDeleteConfirm();
              }}
            >
              {deleting ? 'Đang xóa…' : 'Xóa'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default SeatEditDialog;
