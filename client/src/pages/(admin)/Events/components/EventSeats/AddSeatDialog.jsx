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
import TicketTypeSelect from '@/pages/(admin)/DefaultSeats/components/TicketTypeSelect';

const EMPTY = { rowLabel: '', seatNumber: '', ticketTypeId: '' };

export default function AddSeatDialog({
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
      seatNumber: Number(form.seatNumber),
      ticketTypeId: form.ticketTypeId || null,
    });
  };

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" showCloseButton>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Thêm ghế</DialogTitle>
            <DialogDescription>
              Thêm ghế mới vào sơ đồ và gán loại vé.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-3 py-2">
            <div className="grid gap-3 sm:grid-cols-2">
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
              <div className="space-y-1.5">
                <Label>Số ghế</Label>
                <Input
                  type="number"
                  min={1}
                  value={form.seatNumber}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, seatNumber: e.target.value }))
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
              Thêm ghế
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
