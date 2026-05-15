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
import {
  SEAT_STATUS_OPTIONS,
  TICKET_TYPE_OPTIONS,
} from '@/pages/(admin)/DefaultSeats/data';

const EMPTY_VALUES = {
  rowLabel: '',
  seatNumber: '',
  defaultTicketTypeId: 'tt-std',
  status: 'active',
};

function SeatFormDialog({
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
        rowLabel: initialValues.rowLabel ?? '',
        seatNumber: String(initialValues.seatNumber ?? ''),
        defaultTicketTypeId: initialValues.defaultTicketTypeId ?? 'tt-std',
        status: initialValues.status ?? 'active',
      });
    }
  }, [
    open,
    initialValues.rowLabel,
    initialValues.seatNumber,
    initialValues.defaultTicketTypeId,
    initialValues.status,
  ]);

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave({
      rowLabel: form.rowLabel.trim().toUpperCase(),
      seatNumber: Number(form.seatNumber),
      defaultTicketTypeId: form.defaultTicketTypeId,
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
              {isCreate ? 'Thêm ghế' : 'Chỉnh sửa ghế'}
            </DialogTitle>
            <DialogDescription>
              {isCreate
                ? 'Thêm ghế mới vào sơ đồ mặc định và gán loại vé.'
                : 'Cập nhật thông tin ghế và loại vé mặc định.'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-3 py-2">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="seat-row">Hàng ghế</Label>
                <Input
                  id="seat-row"
                  value={form.rowLabel}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, rowLabel: event.target.value }))
                  }
                  placeholder="A"
                  className="h-9"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="seat-number">Số ghế</Label>
                <Input
                  id="seat-number"
                  type="number"
                  min={1}
                  value={form.seatNumber}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, seatNumber: event.target.value }))
                  }
                  placeholder="1"
                  className="h-9"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="seat-ticket-type">Loại vé mặc định</Label>
              <Select
                value={form.defaultTicketTypeId}
                onValueChange={(value) =>
                  setForm((prev) => ({
                    ...prev,
                    defaultTicketTypeId: value ?? 'tt-std',
                  }))
                }
              >
                <SelectTrigger id="seat-ticket-type" className="h-9 w-full">
                  <SelectValue placeholder="Chọn loại vé" />
                </SelectTrigger>
                <SelectContent>
                  {TICKET_TYPE_OPTIONS.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="seat-status">Trạng thái</Label>
              <Select
                value={form.status}
                onValueChange={(value) =>
                  setForm((prev) => ({ ...prev, status: value ?? 'active' }))
                }
              >
                <SelectTrigger id="seat-status" className="h-9 w-full">
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  {SEAT_STATUS_OPTIONS.map((option) => (
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
              Lưu ghế
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default SeatFormDialog;
