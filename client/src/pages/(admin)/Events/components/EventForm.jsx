import { useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { ThumbnailUploadField } from '@/components/form/ThumbnailUploadField';
import { cn } from '@/lib/utils';
import { EVENT_STATUS_OPTIONS } from '@/pages/(admin)/Events/data';
import EventSeats from './EventSeats';

const EMPTY_FORM = {
  title: '',
  slug: '',
  description: '',
  contentHtml: '',
  location: '',
  startDate: '',
  endDate: '',
  thumbnailUrl: '',
  status: 'DRAFT',
  categoryId: '',
  artists: [],
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

function FormField({ label, htmlFor, children, className }) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
    </div>
  );
}

function EventForm({
  initialValues = EMPTY_FORM,
  categories = [],
  submitting = false,
  formError = '',
  isCreate = false,
  submitLabel = 'Lưu',
  showDraftButton = false,
  onSubmit,
  onSaveDraft,
  onCancel,
  artists = [],
}) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [uploadBusy, setUploadBusy] = useState(false);
  const [thumbnailError, setThumbnailError] = useState('');
  const slugEditedRef = useRef(false);
  const formBusy = submitting || uploadBusy;
  const availableArtists = artists;
  const selectedArtistIds = (form.artists || [])
    .map((row) => row.artistId)
    .filter(Boolean);

  useEffect(() => {
    slugEditedRef.current = false;
    const normalizedValues = initialValues.eventArtists
      ? {
          ...initialValues,
          artists: initialValues.eventArtists.map((item) => ({
            artistId: item.artist?.id ?? '',
            role: item.role ?? 'SINGER',
          })),
        }
      : initialValues;

    setForm({ ...EMPTY_FORM, ...normalizedValues });
  }, [initialValues]);

  const addArtistRow = () => {
    setForm((prev) => ({
      ...prev,
      artists: [...(prev.artists ?? []), { artistId: '', role: 'SINGER' }],
    }));
  };

  const updateArtistRow = (index, key, value) => {
    setForm((prev) => {
      const nextArtists = [...(prev.artists ?? [])];
      nextArtists[index] = { ...nextArtists[index], [key]: value };
      return { ...prev, artists: nextArtists };
    });
  };

  const removeArtistRow = (index) => {
    setForm((prev) => {
      const nextArtists = [...(prev.artists ?? [])];
      nextArtists.splice(index, 1);
      return { ...prev, artists: nextArtists };
    });
  };

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

  const updateSelect = (key) => (value) => {
    setForm((prev) => ({ ...prev, [key]: value ?? '' }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit?.(form);
  };

  return (
    <form className="space-y-3" onSubmit={handleSubmit}>
      {formError ? (
        <p className="text-sm text-destructive" role="alert">
          {formError}
        </p>
      ) : null}

      <Card size="sm">
        <CardHeader className="border-b pb-3">
          <CardTitle>Thông tin cơ bản</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 pt-3">
          <div className="grid gap-3 md:grid-cols-2">
            <FormField label="Tên sự kiện" htmlFor="title">
              <Input
                id="title"
                name="title"
                value={form.title}
                onChange={updateField('title')}
                placeholder="Nhập tên sự kiện"
                className="h-9"
                disabled={formBusy}
                required
              />
            </FormField>
            <FormField label="Slug" htmlFor="slug">
              <Input
                id="slug"
                name="slug"
                value={form.slug}
                onChange={(event) => {
                  slugEditedRef.current = true;
                  updateField('slug')(event);
                }}
                placeholder="ten-su-kien"
                className="h-9"
                disabled={formBusy}
                required
              />
            </FormField>
          </div>

          <FormField label="Danh mục" htmlFor="categoryId">
            <Select
              value={form.categoryId || null}
              onValueChange={updateSelect('categoryId')}
              disabled={formBusy}
            >
              <SelectTrigger
                id="categoryId"
                className="h-9 w-full"
                size="default"
              >
                <SelectValue placeholder="Chọn danh mục" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          <FormField label="Mô tả ngắn" htmlFor="description">
            <Textarea
              id="description"
              name="description"
              value={form.description}
              onChange={updateField('description')}
              placeholder="Mô tả ngắn hiển thị trên danh sách sự kiện"
              rows={3}
              className="min-h-[72px] resize-y"
              disabled={formBusy}
            />
          </FormField>

          <FormField label="Nội dung chi tiết" htmlFor="contentHtml">
            <Textarea
              id="contentHtml"
              name="contentHtml"
              value={form.contentHtml}
              onChange={updateField('contentHtml')}
              placeholder="Nội dung HTML chi tiết"
              rows={6}
              className="min-h-[120px] resize-y"
              disabled={formBusy}
            />
          </FormField>

          <FormField label="Danh sách nghệ sĩ" htmlFor="">
            <div className="space-y-3">
              {form.artists.length === 0 ? (
                <div className="rounded-md border border-dashed border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-500">
                  Chưa có nghệ sĩ nào được chọn.
                </div>
              ) : (
                <div className="space-y-3">
                  {form.artists.map((artistRow, index) => (
                    <div
                      key={index}
                      className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_200px_90px] items-end"
                    >
                      <Select
                        value={artistRow.artistId}
                        onValueChange={(value) =>
                          updateArtistRow(index, 'artistId', value)
                        }
                        disabled={formBusy}
                      >
                        <SelectTrigger className="h-9 w-full">
                          <SelectValue placeholder="Chọn nghệ sĩ">
                            {
                              availableArtists.find(
                                (artist) => artist.id === artistRow.artistId
                              )?.name
                            }
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {availableArtists.map((artist) => (
                            <SelectItem
                              key={artist.id}
                              value={artist.id}
                              disabled={
                                artistRow.artistId !== artist.id &&
                                selectedArtistIds.includes(artist.id)
                              }
                            >
                              {artist.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Input
                        id={`artist-role-${index}`}
                        name={`artistRole-${index}`}
                        value={artistRow.role}
                        onChange={(event) =>
                          updateArtistRow(index, 'role', event.target.value)
                        }
                        placeholder="SINGER"
                        className="h-9 w-full"
                        disabled={formBusy}
                      />

                      <Button
                        type="button"
                        variant="outline"
                        className="h-9 w-full sm:w-auto"
                        onClick={() => removeArtistRow(index)}
                        disabled={formBusy}
                      >
                        Xóa
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              <Button
                type="button"
                variant="outline"
                className="h-9"
                onClick={addArtistRow}
                disabled={formBusy}
              >
                Thêm nghệ sĩ
              </Button>
            </div>
          </FormField>
        </CardContent>
      </Card>

      <Card size="sm">
        <CardHeader className="border-b pb-3">
          <CardTitle>Thời gian & địa điểm</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 pt-3">
          <FormField label="Địa điểm" htmlFor="location">
            <Input
              id="location"
              name="location"
              value={form.location}
              onChange={updateField('location')}
              placeholder="Nhà thi đấu, địa chỉ..."
              className="h-9"
              disabled={formBusy}
            />
          </FormField>

          <div className="grid gap-3 md:grid-cols-2">
            <FormField label="Ngày bắt đầu" htmlFor="startDate">
              <Input
                id="startDate"
                name="startDate"
                type="datetime-local"
                value={form.startDate}
                onChange={updateField('startDate')}
                className="h-9"
                disabled={formBusy}
              />
            </FormField>
            <FormField label="Ngày kết thúc" htmlFor="endDate">
              <Input
                id="endDate"
                name="endDate"
                type="datetime-local"
                value={form.endDate}
                onChange={updateField('endDate')}
                className="h-9"
                disabled={formBusy}
              />
            </FormField>
          </div>
        </CardContent>
      </Card>

      <Card size="sm">
        <CardHeader className="border-b pb-3">
          <CardTitle>Hình ảnh & trạng thái</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 pt-3">
          <ThumbnailUploadField
            id="event-thumbnail"
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

          <FormField label="Trạng thái" htmlFor="status">
            <Select
              value={form.status}
              onValueChange={updateSelect('status')}
              disabled={formBusy}
            >
              <SelectTrigger id="status" className="h-9 w-full md:max-w-xs">
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                {EVENT_STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
        </CardContent>
      </Card>

      {!isCreate && form.id ? (
        <Card size="sm">
          <CardHeader className="border-b pb-3">
            <CardTitle>Sơ đồ ghế (Event Seats)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-3">
            <EventSeats eventId={form.id} />
          </CardContent>
        </Card>
      ) : null}

      <Separator />

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          className="h-9 cursor-pointer"
          disabled={formBusy}
          onClick={onCancel}
        >
          Hủy
        </Button>
        {showDraftButton ? (
          <Button
            type="button"
            variant="outline"
            className="h-9 cursor-pointer"
            disabled={formBusy}
            onClick={() => onSaveDraft?.({ ...form, status: 'DRAFT' })}
          >
            Lưu bản nháp
          </Button>
        ) : null}
        <Button
          type="submit"
          className="h-9 cursor-pointer"
          disabled={formBusy}
        >
          {formBusy ? 'Đang xử lý…' : submitLabel}
        </Button>
      </div>
    </form>
  );
}

export default EventForm;
