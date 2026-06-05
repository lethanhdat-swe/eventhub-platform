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
import TicketTypeSelect from '@/pages/(admin)/DefaultSeats/components/TicketTypeSelect/TicketTypeSelect';

const EMPTY = {
  rowLabel: '',
  fromSeatNumber: '',
  toSeatNumber: '',
  ticketTypeId: '',
};

export default function AddRowDialog({
  open,
  onOpenChange,
  ticketTypes = [],
  onSave,
}) {
  const [form, setForm] = useState(EMPTY);

  useEffect(() => {
    if (open) setForm(EMPTY);
  }, [open]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      rowLabel: form.rowLabel,
      fromSeatNumber: Number(form.fromSeatNumber),
      toSeatNumber: Number(form.toSeatNumber),
      ticketTypeId: form.ticketTypeId || null,
    });
  };

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" showCloseButton>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Thêm hàng ghế</DialogTitle>
            <DialogDescription>
              Tạo nhiều ghế liên tiếp trong cùng một hàng.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-3 py-2">
            <div className="space-y-1.5">
              <Label>Hàng ghế</Label>
              <Input
                value={form.rowLabel}
                onChange={(e) =>
                  setForm((p) => ({ ...p, rowLabel: e.target.value }))
                }
                className="h-9"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Từ số ghế</Label>
                <Input
                  type="number"
                  min={1}
                  value={form.fromSeatNumber}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, fromSeatNumber: e.target.value }))
                  }
                  className="h-9"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Đến số ghế</Label>
                <Input
                  type="number"
                  min={1}
                  value={form.toSeatNumber}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, toSeatNumber: e.target.value }))
                  }
                  className="h-9"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Loại vé mặc định</Label>
              <TicketTypeSelect
                value={form.ticketTypeId}
                onValueChange={(v) =>
                  setForm((p) => ({ ...p, ticketTypeId: v }))
                }
                options={ticketTypes}
              />
            </div>
          </div>

          <DialogFooter className="mt-2 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              className="h-9"
              onClick={() => onOpenChange(false)}
            >
              Hủy
            </Button>
            <Button type="submit" className="h-9">
              Tạo hàng
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
