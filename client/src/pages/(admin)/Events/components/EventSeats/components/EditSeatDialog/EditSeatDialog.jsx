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
import { Label } from '@/components/ui/label';
import TicketTypeSelect from '@/pages/(admin)/DefaultSeats/components/TicketTypeSelect/TicketTypeSelect';

const EMPTY = { status: 'AVAILABLE', ticketTypeId: '' };

export default function EditSeatDialog({
  open,
  onOpenChange,
  seat,
  ticketTypes = [],
  onSave,
}) {
  const [form, setForm] = useState(EMPTY);

  useEffect(() => {
    if (open && seat) {
      setForm({
        status: seat.status || 'AVAILABLE',
        ticketTypeId: seat.ticketTypeId || '',
      });
    }
  }, [open, seat]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!seat) return;
    onSave({
      id: seat.id,
      status: form.status,
      ticketTypeId: form.ticketTypeId || null,
    });
  };

  if (!open || !seat) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" showCloseButton>
        <form>
          <DialogHeader>
            <DialogTitle>
              Chỉnh sửa ghế {seat.rowLabel}
              {seat.seatNumber}
            </DialogTitle>
            <DialogDescription>
              Thay đổi trạng thái hoặc loại vé của ghế.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-3 py-2">
            <div className="space-y-1.5">
              <Label>Loại vé</Label>
              <TicketTypeSelect
                value={form.ticketTypeId}
                onValueChange={(value) =>
                  setForm((prev) => ({ ...prev, ticketTypeId: value }))
                }
                options={ticketTypes}
              />
            </div>

            <div className="space-y-1.5">
              <Label>Trạng thái ghế</Label>
              <select
                value={form.status}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, status: e.target.value }))
                }
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="AVAILABLE">Còn trống</option>
                <option value="DISABLED">Vô hiệu hóa</option>
              </select>
            </div>
          </div>

          <DialogFooter className="mt-2 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              className="h-10"
              onClick={() => onOpenChange(false)}
            >
              Hủy
            </Button>
            <Button type="button" className="h-10" onClick={handleSubmit}>
              Lưu thay đổi
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
