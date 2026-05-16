import { useEffect, useRef, useState } from 'react';

import { ImageUploadField } from '@/components/form/ImageUploadField';
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
import { Textarea } from '@/components/ui/textarea';
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

const EMPTY_VALUES = {
  name: '',
  slug: '',
  avatarUrl: '',
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
  const [nameError, setNameError] = useState('');
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [uploadBusy, setUploadBusy] = useState(false);
  const slugEditedRef = useRef(false);

  const isCreate = mode === 'create';

  useEffect(() => {
    if (open) {
      slugEditedRef.current = false;
      setForm({
        name: initialValues.name ?? '',
        slug: initialValues.slug ?? '',
        avatarUrl: initialValues.avatarUrl ?? '',
        description: initialValues.description ?? '',
      });
      setNameError('');
      setFormError('');
      setUploadBusy(false);
    }
  }, [
    open,
    mode,
    initialValues.name,
    initialValues.slug,
    initialValues.avatarUrl,
    initialValues.description,
  ]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError('');
    const name = form.name.trim();
    if (!name) {
      setNameError('Vui lòng nhập tên nghệ sĩ.');
      return;
    }
    setNameError('');

    const slugTrim = form.slug.trim();
    const payload = {
      name,
      slug: slugTrim,
      avatarUrl: form.avatarUrl.trim(),
      description: form.description.trim(),
    };

    setSubmitting(true);
    try {
      await onSave(payload);
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
              {isCreate ? 'Thêm nghệ sĩ' : 'Chỉnh sửa nghệ sĩ'}
            </DialogTitle>
            <DialogDescription>
              {isCreate
                ? 'Thêm nghệ sĩ mới vào danh sách tham gia sự kiện.'
                : 'Cập nhật thông tin hiển thị của nghệ sĩ.'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid max-h-[min(60vh,480px)] gap-3 overflow-y-auto py-2">
            {formError ? (
              <p className="text-sm text-destructive" role="alert">
                {formError}
              </p>
            ) : null}

            <div className="space-y-1.5">
              <Label htmlFor="artist-name">Tên nghệ sĩ</Label>
              <Input
                id="artist-name"
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
                placeholder="Ví dụ: Sơn Tùng M-TP"
                className="h-9"
                aria-invalid={Boolean(nameError)}
              />
              {nameError ? (
                <p className="text-xs text-destructive">{nameError}</p>
              ) : null}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="artist-slug">Slug</Label>
              <Input
                id="artist-slug"
                name="slug"
                value={form.slug}
                onChange={(event) => {
                  slugEditedRef.current = true;
                  setForm((prev) => ({
                    ...prev,
                    slug: event.target.value,
                  }));
                }}
                placeholder="son-tung-m-tp"
                className="h-9"
              />
              <p className="text-xs text-muted-foreground">
                Để trống để hệ thống tạo từ tên (khi thêm mới).
              </p>
            </div>

            <ImageUploadField
              id="artist-avatar"
              label="Ảnh đại diện"
              value={form.avatarUrl}
              onChange={(next) => {
                setFormError('');
                setForm((prev) => ({ ...prev, avatarUrl: next }));
              }}
              onError={(msg) => setFormError(msg)}
              onBusyChange={setUploadBusy}
              disabled={submitting}
              previewVariant="circle"
              previewClassName="size-14"
              showManualUrlInput
              manualUrlLabel="Hoặc URL ảnh"
              manualUrlPlaceholder="/uploads/... hoặc https://..."
            />

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
              disabled={submitting}
              onClick={() => onOpenChange(false)}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              className="h-9 cursor-pointer"
              disabled={submitting || uploadBusy}
            >
              {submitting ? 'Đang lưu…' : 'Lưu nghệ sĩ'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default ArtistFormDialog;
