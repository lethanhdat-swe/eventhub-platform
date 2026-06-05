import { useEffect, useRef, useState } from 'react';

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

function slugifyFromName(name) {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const EMPTY_VALUES = { name: '', slug: '' };

function CategoryFormDialog({
  open,
  mode,
  initialValues = EMPTY_VALUES,
  onOpenChange,
  onSave,
}) {
  const [form, setForm] = useState(EMPTY_VALUES);
  const [nameError, setNameError] = useState('');
  const [slugError, setSlugError] = useState('');
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const slugEditedRef = useRef(false);
  const isCreate = mode === 'create';

  useEffect(() => {
    if (open) {
      slugEditedRef.current = false;
      setForm({
        name: initialValues.name ?? '',
        slug: initialValues.slug ?? '',
      });
      setNameError('');
      setSlugError('');
      setFormError('');
    }
  }, [open, mode, initialValues.name, initialValues.slug]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError('');
    const name = form.name.trim();
    if (!name) {
      setNameError('Vui lòng nhập tên danh mục.');
      return;
    }
    setNameError('');

    const slug = form.slug.trim();
    if (slug.length < 2) {
      setSlugError('Slug phải có ít nhất 2 ký tự.');
      return;
    }
    setSlugError('');

    setSubmitting(true);
    try {
      await onSave({ name, slug });
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
              {isCreate ? 'Thêm danh mục' : 'Chỉnh sửa danh mục'}
            </DialogTitle>
            <DialogDescription>
              {isCreate
                ? 'Tạo nhóm sự kiện mới để phân loại và quản lý dễ hơn.'
                : 'Cập nhật tên và slug hiển thị cho danh mục.'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-3 py-2">
            {formError ? (
              <p className="text-sm text-destructive" role="alert">
                {formError}
              </p>
            ) : null}

            <div className="space-y-1.5">
              <Label htmlFor="category-name">Tên danh mục</Label>
              <Input
                id="category-name"
                name="name"
                value={form.name}
                onChange={(event) => {
                  const v = event.target.value;
                  setForm((prev) => {
                    const next = { ...prev, name: v };
                    if (isCreate && !slugEditedRef.current) {
                      next.slug = slugifyFromName(v);
                    }
                    return next;
                  });
                }}
                placeholder="Ví dụ: Âm nhạc"
                className="h-9"
                disabled={submitting}
                aria-invalid={Boolean(nameError)}
              />
              {nameError ? (
                <p className="text-xs text-destructive">{nameError}</p>
              ) : null}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="category-slug">Slug</Label>
              <Input
                id="category-slug"
                name="slug"
                value={form.slug}
                onChange={(event) => {
                  slugEditedRef.current = true;
                  setForm((prev) => ({ ...prev, slug: event.target.value }));
                }}
                placeholder="am-nhac"
                className="h-9"
                disabled={submitting}
                aria-invalid={Boolean(slugError)}
              />
              {slugError ? (
                <p className="text-xs text-destructive">{slugError}</p>
              ) : null}
              {isCreate ? (
                <p className="text-xs text-muted-foreground">
                  Để trống để hệ thống tạo từ tên khi thêm mới.
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
            <Button
              type="submit"
              className="h-9 cursor-pointer"
              disabled={submitting}
            >
              {submitting ? 'Đang lưu…' : 'Lưu danh mục'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CategoryFormDialog;
