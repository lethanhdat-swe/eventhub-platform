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
import { ARTIST_ROLE_OPTIONS } from '@/pages/(admin)/Artists/data';

const EMPTY_VALUES = {
  name: '',
  slug: '',
  avatarUrl: '',
  role: 'SINGER',
  description: '',
};

function ArtistFormDialog({
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
        avatarUrl: initialValues.avatarUrl ?? '',
        role: initialValues.role ?? 'SINGER',
        description: initialValues.description ?? '',
      });
    }
  }, [
    open,
    initialValues.name,
    initialValues.slug,
    initialValues.avatarUrl,
    initialValues.role,
    initialValues.description,
  ]);

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave({
      name: form.name.trim(),
      slug: form.slug.trim(),
      avatarUrl: form.avatarUrl.trim(),
      role: form.role,
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
              {isCreate ? 'Thêm nghệ sĩ' : 'Chỉnh sửa nghệ sĩ'}
            </DialogTitle>
            <DialogDescription>
              {isCreate
                ? 'Thêm nghệ sĩ mới vào danh sách tham gia sự kiện.'
                : 'Cập nhật thông tin hiển thị của nghệ sĩ.'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid max-h-[min(60vh,420px)] gap-3 overflow-y-auto py-2">
            <div className="space-y-1.5">
              <Label htmlFor="artist-name">Tên nghệ sĩ</Label>
              <Input
                id="artist-name"
                name="name"
                value={form.name}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, name: event.target.value }))
                }
                placeholder="Ví dụ: Sơn Tùng M-TP"
                className="h-9"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="artist-slug">Slug</Label>
              <Input
                id="artist-slug"
                name="slug"
                value={form.slug}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, slug: event.target.value }))
                }
                placeholder="son-tung-m-tp"
                className="h-9"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="artist-avatar">Avatar URL</Label>
              <Input
                id="artist-avatar"
                name="avatarUrl"
                type="url"
                value={form.avatarUrl}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, avatarUrl: event.target.value }))
                }
                placeholder="https://..."
                className="h-9"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="artist-role">Vai trò</Label>
              <Select
                value={form.role}
                onValueChange={(value) =>
                  setForm((prev) => ({ ...prev, role: value ?? 'SINGER' }))
                }
              >
                <SelectTrigger id="artist-role" className="h-9 w-full">
                  <SelectValue placeholder="Chọn vai trò" />
                </SelectTrigger>
                <SelectContent>
                  {ARTIST_ROLE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="artist-description">Mô tả</Label>
              <Textarea
                id="artist-description"
                name="description"
                value={form.description}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    description: event.target.value,
                  }))
                }
                placeholder="Giới thiệu ngắn về nghệ sĩ"
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
              Lưu nghệ sĩ
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default ArtistFormDialog;
