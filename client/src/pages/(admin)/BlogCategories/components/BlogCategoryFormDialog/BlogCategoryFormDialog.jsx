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

const EMPTY_VALUES = { name: '', slug: '' };

function slugifyFromName(name) {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function BlogCategoryFormDialog({
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
      setNameError('Vui lòng nhập tên danh mục blog.');
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
        <form onSubmit={(event) => void handleSubmit(event)}>
          <DialogHeader>
            <DialogTitle>
              {isCreate ? 'Thêm danh mục blog' : 'Chỉnh sửa danh mục blog'}
            </DialogTitle>
            <DialogDescription>
              {isCreate
                ? 'Tạo danh mục mới để phân loại bài viết.'
                : 'Cập nhật tên và slug hiển thị cho danh mục blog.'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-3 py-2">
            {formError ? (
              <p className="text-sm text-destructive" role="alert">
                {formError}
              </p>
            ) : null}

            <div className="space-y-1.5">
              <Label htmlFor="blog-category-name">Tên danh mục</Label>
              <Input
                id="blog-category-name"
                value={form.name}
                onChange={(event) => {
                  const value = event.target.value;
                  setForm((prev) => {
                    const next = { ...prev, name: value };
                    if (isCreate && !slugEditedRef.current) {
                      next.slug = slugifyFromName(value);
                    }
                    return next;
                  });
                }}
                placeholder="Ví dụ: Tin tức"
                className="h-9"
                disabled={submitting}
                aria-invalid={Boolean(nameError)}
              />
              {nameError ? (
                <p className="text-xs text-destructive">{nameError}</p>
              ) : null}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="blog-category-slug">Slug</Label>
              <Input
                id="blog-category-slug"
                value={form.slug}
                onChange={(event) => {
                  slugEditedRef.current = true;
                  setForm((prev) => ({ ...prev, slug: event.target.value }));
                }}
                placeholder="tin-tuc"
                className="h-9"
                disabled={submitting}
                aria-invalid={Boolean(slugError)}
              />
              {slugError ? (
                <p className="text-xs text-destructive">{slugError}</p>
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

export default BlogCategoryFormDialog;
