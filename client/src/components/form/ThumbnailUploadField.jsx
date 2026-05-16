import { useEffect, useId, useRef, useState } from 'react';
import { ImagePlus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { getErrorMessage } from '@/lib/http/apiError';
import { getUploadPreviewSrc } from '@/lib/upload/uploadAsset';
import { uploadService } from '@/lib/services/upload/uploadService';
import { cn } from '@/lib/utils';

/**
 * Upload thumbnail: lưu `filename` vào record, preview / đổi / gỡ ảnh.
 *
 * @param {Object} props
 * @param {string} [props.value] — filename (hoặc legacy path/URL, sẽ chuẩn hóa khi upload mới)
 * @param {(filename: string) => void} props.onChange
 * @param {(message: string) => void} [props.onError]
 * @param {(busy: boolean) => void} [props.onBusyChange]
 * @param {boolean} [props.disabled]
 * @param {string} [props.id]
 * @param {string} [props.label]
 * @param {string} [props.className]
 * @param {string} [props.emptyHint]
 */
export function ThumbnailUploadField({
  value = '',
  onChange,
  onError,
  onBusyChange,
  disabled = false,
  id: idProp,
  label = 'Ảnh thumbnail',
  className,
  emptyHint = 'JPEG, PNG hoặc WebP. Tối đa theo giới hạn server.',
}) {
  const reactId = useId();
  const fileInputId = idProp ?? `thumbnail-upload-${reactId.replace(/:/g, '')}`;
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    onBusyChange?.(uploading);
  }, [uploading, onBusyChange]);

  const previewSrc = getUploadPreviewSrc(value);
  const hasPreview = Boolean(previewSrc);
  const busy = disabled || uploading;

  const pickFile = () => {
    fileRef.current?.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file || busy) return;

    setUploading(true);
    try {
      const data = await uploadService.uploadImage(file);
      const filename = data?.filename ?? '';
      if (!filename) {
        throw new Error('Không nhận được tên file từ server.');
      }
      onChange(filename);
    } catch (e) {
      onError?.(getErrorMessage(e));
    } finally {
      setUploading(false);
    }
  };

  const handleClear = () => {
    if (busy) return;
    onChange('');
  };

  return (
    <div className={cn('space-y-1.5', className)}>
      <Label htmlFor={fileInputId} className="text-sm font-medium">
        {label}
      </Label>

      <input
        ref={fileRef}
        id={fileInputId}
        type="file"
        accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
        className="sr-only"
        aria-label={label}
        disabled={busy}
        onChange={(e) => void handleFileChange(e)}
      />

      {!hasPreview ? (
        <button
          type="button"
          disabled={busy}
          onClick={pickFile}
          className={cn(
            'flex h-32 w-full max-w-sm cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-muted/20 text-muted-foreground transition-colors',
            'hover:border-primary/40 hover:bg-muted/40',
            'disabled:pointer-events-none disabled:opacity-50'
          )}
        >
          <ImagePlus className="size-8 opacity-60" aria-hidden />
          <span className="text-sm font-medium text-foreground">
            {uploading ? 'Đang tải ảnh…' : 'Chọn ảnh thumbnail'}
          </span>
          {emptyHint ? (
            <span className="max-w-[240px] px-4 text-center text-xs">
              {emptyHint}
            </span>
          ) : null}
        </button>
      ) : (
        <div className="flex flex-wrap items-start gap-3">
          <div className="relative overflow-hidden rounded-lg border bg-muted/30">
            <img
              src={previewSrc}
              alt=""
              className="h-32 w-48 object-cover"
            />
          </div>
          <div className="flex min-w-0 flex-col gap-2 pt-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 w-fit cursor-pointer"
              disabled={busy}
              onClick={pickFile}
            >
              {uploading ? 'Đang tải…' : 'Đổi ảnh'}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 w-fit cursor-pointer"
              disabled={busy}
              onClick={handleClear}
            >
              Xóa ảnh
            </Button>
            {value ? (
              <p className="max-w-[200px] truncate text-xs text-muted-foreground">
                {value}
              </p>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}

export default ThumbnailUploadField;
