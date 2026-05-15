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

const EMPTY_VALUES = { name: '', slug: '' };

function CategoryFormDialog({
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
        slug: initialValues.slug ?? '',
      });
    }
  }, [open, initialValues.name, initialValues.slug]);

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave({ name: form.name.trim(), slug: form.slug.trim() });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" showCloseButton>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {isCreate ? 'Thêm danh mục' : 'Chỉnh sửa danh mục'}
            </DialogTitle>
            <DialogDescription>
              {isCreate
                ? 'Tạo nhóm sự kiện mới để phân loại và quản lý dễ hơn.'
                : 'Cập nhật tên và slug hiển thị cho danh mục.'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-3 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="category-name">Tên danh mục</Label>
              <Input
                id="category-name"
                name="name"
                value={form.name}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, name: event.target.value }))
                }
                placeholder="Ví dụ: Âm nhạc"
                className="h-9"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="category-slug">Slug</Label>
              <Input
                id="category-slug"
                name="slug"
                value={form.slug}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, slug: event.target.value }))
                }
                placeholder="am-nhac"
                className="h-9"
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
              Lưu danh mục
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CategoryFormDialog;
