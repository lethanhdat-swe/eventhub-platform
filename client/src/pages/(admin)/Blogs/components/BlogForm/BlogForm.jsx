import { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ThumbnailUploadField } from '@/components/form/ThumbnailUploadField';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { BLOG_STATUS_OPTIONS } from '@/pages/(admin)/Blogs/data';
import RichTextEditorComponent from '@/pages/(admin)/components/RichTextEditor';

const NO_CATEGORY_VALUE = 'none';
const EMPTY_FORM = {
  title: '',
  slug: '',
  excerpt: '',
  contentHtml: '',
  thumbnailUrl: '',
  status: 'draft',
  categoryId: '',
};

function slugifyFromTitle(title) {
  return title
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function toFormStatus(status) {
  return String(status ?? 'draft').toLowerCase() === 'published'
    ? 'published'
    : 'draft';
}

function FormField({ label, htmlFor, children, className }) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
    </div>
  );
}

function BlogForm({
  initialValues = EMPTY_FORM,
  categories = [],
  submitting = false,
  formError = '',
  isCreate = false,
  submitLabel = 'Lưu',
  onSubmit,
  onCancel,
}) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [uploadBusy, setUploadBusy] = useState(false);
  const [thumbnailError, setThumbnailError] = useState('');
  const slugEditedRef = useRef(false);
  const formBusy = submitting || uploadBusy;

  useEffect(() => {
    slugEditedRef.current = false;
    setForm({
      ...EMPTY_FORM,
      ...initialValues,
      status: toFormStatus(initialValues.status),
      categoryId: initialValues.categoryId ?? '',
    });
  }, [initialValues]);

  const updateField = (key) => (event) => {
    const value = event.target.value;
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (isCreate && key === 'title' && !slugEditedRef.current) {
        next.slug = slugifyFromTitle(value);
      }
      return next;
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    onSubmit?.({
      ...form,
      title: form.title.trim(),
      slug: form.slug.trim(),
      excerpt: form.excerpt.trim(),
      contentHtml: form.contentHtml.trim(),
      thumbnailUrl: form.thumbnailUrl.trim(),
    });
  };

  return (
    <form className="space-y-3" onSubmit={handleSubmit}>
      {formError ? (
        <p className="text-sm text-destructive" role="alert">
          {formError}
        </p>
      ) : null}

      <Card size="sm">
        <CardHeader className="pb-3 border-b">
          <CardTitle>Thông tin cơ bản</CardTitle>
        </CardHeader>
        <CardContent className="pt-3 space-y-3">
          <div className="grid gap-3 md:grid-cols-2">
            <FormField label="Tiêu đề" htmlFor="blog-title">
              <Input
                id="blog-title"
                name="title"
                value={form.title}
                onChange={updateField('title')}
                placeholder="Nhập tiêu đề bài viết"
                className="h-9"
                disabled={formBusy}
                required
              />
            </FormField>
            <FormField label="Slug" htmlFor="blog-slug">
              <Input
                id="blog-slug"
                name="slug"
                value={form.slug}
                onChange={(event) => {
                  slugEditedRef.current = true;
                  updateField('slug')(event);
                }}
                placeholder="tieu-de-bai-viet"
                className="h-9"
                disabled={formBusy}
                required
              />
            </FormField>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <FormField label="Danh mục" htmlFor="blog-category">
              <Select
                value={form.categoryId || NO_CATEGORY_VALUE}
                onValueChange={(value) =>
                  setForm((prev) => ({
                    ...prev,
                    categoryId: value === NO_CATEGORY_VALUE ? '' : value,
                  }))
                }
                disabled={formBusy}
              >
                <SelectTrigger id="blog-category" className="w-full h-9">
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NO_CATEGORY_VALUE}>
                    Chưa phân loại
                  </SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>

            <FormField label="Trạng thái" htmlFor="blog-status">
              <Select
                value={form.status}
                onValueChange={(value) =>
                  setForm((prev) => ({ ...prev, status: value ?? 'draft' }))
                }
                disabled={formBusy}
              >
                <SelectTrigger id="blog-status" className="w-full h-9">
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  {BLOG_STATUS_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
          </div>

          <FormField label="Mô tả ngắn" htmlFor="blog-excerpt">
            <Textarea
              id="blog-excerpt"
              name="excerpt"
              value={form.excerpt}
              onChange={updateField('excerpt')}
              placeholder="Mô tả ngắn hiển thị trên danh sách blog"
              rows={3}
              className="min-h-[72px] resize-y"
              disabled={formBusy}
            />
          </FormField>
        </CardContent>
      </Card>

      <Card size="sm">
        <CardHeader className="pb-3 border-b">
          <CardTitle>Nội dung bài viết</CardTitle>
        </CardHeader>
        <CardContent className="pt-3 space-y-3">
          <FormField label="Nội dung bài viết" htmlFor="blog-content">
            <RichTextEditorComponent
              value={form.contentHtml}
              onChange={(value) =>
                setForm((prev) => ({
                  ...prev,
                  contentHtml: value,
                }))
              }
              minHeight={300}
              disabled={formBusy}
            />
          </FormField>
        </CardContent>
      </Card>

      <Card size="sm">
        <CardHeader className="pb-3 border-b">
          <CardTitle>Hình ảnh</CardTitle>
        </CardHeader>
        <CardContent className="pt-3 space-y-3">
          <ThumbnailUploadField
            id="blog-thumbnail"
            value={form.thumbnailUrl}
            onChange={(filename) => {
              setThumbnailError('');
              setForm((prev) => ({ ...prev, thumbnailUrl: filename }));
            }}
            onError={setThumbnailError}
            onBusyChange={setUploadBusy}
            disabled={formBusy}
          />
          {thumbnailError ? (
            <p className="text-xs text-destructive">{thumbnailError}</p>
          ) : null}
        </CardContent>
      </Card>

      <Separator />

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          className="cursor-pointer h-9"
          disabled={formBusy}
          onClick={onCancel}
        >
          Hủy
        </Button>
        <Button
          type="submit"
          className="cursor-pointer h-9"
          disabled={formBusy}
        >
          {formBusy ? (
            <>
              <Loader2 className="animate-spin" />
              Đang xử lý…
            </>
          ) : (
            submitLabel
          )}
        </Button>
      </div>
    </form>
  );
}

export default BlogForm;
