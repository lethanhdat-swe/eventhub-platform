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
import { TICKET_TYPE_STATUS_OPTIONS } from '@/pages/(admin)/TicketTypes/data';

const EMPTY_VALUES = {
  name: '',
  price: '',
  status: 'active',
  description: '',
};

function TicketTypeFormDialog({
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
        name: initialValues.name ?? '',
        price: String(initialValues.price ?? ''),
        status: initialValues.status ?? 'active',
        description: initialValues.description ?? '',
      });
    }
  }, [
    open,
    initialValues.name,
    initialValues.price,
    initialValues.status,
    initialValues.description,
  ]);

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave({
      name: form.name.trim(),
      price: Number(form.price),
      status: form.status,
      description: form.description.trim(),
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" showCloseButton>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {isCreate ? 'Thêm loại vé' : 'Chỉnh sửa loại vé'}
            </DialogTitle>
            <DialogDescription>
              {isCreate
                ? 'Tạo hạng vé mới với mức giá và mô tả hiển thị.'
                : 'Cập nhật thông tin loại vé.'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-3 py-2">
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
              />
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
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ticket-type-status">Trạng thái</Label>
              <Select
                value={form.status}
                onValueChange={(value) =>
                  setForm((prev) => ({ ...prev, status: value ?? 'active' }))
                }
              >
                <SelectTrigger id="ticket-type-status" className="h-9 w-full">
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  {TICKET_TYPE_STATUS_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ticket-type-description">Mô tả ngắn</Label>
              <Textarea
                id="ticket-type-description"
                value={form.description}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    description: event.target.value,
                  }))
                }
                placeholder="Mô tả loại vé (tùy chọn)"
                rows={3}
                className="min-h-[72px] resize-y"
              />
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
              Lưu loại vé
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default TicketTypeFormDialog;
