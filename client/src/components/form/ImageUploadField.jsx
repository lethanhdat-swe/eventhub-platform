import { useEffect, useId, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getErrorMessage } from '@/lib/http/apiError';
import { uploadService } from '@/lib/services/upload/uploadService';
import { resolvePublicAssetUrl } from '@/lib/url/resolvePublicAssetUrl';
import { cn } from '@/lib/utils';

/**
 * Trường ảnh tái sử dụng: upload → hiển thị preview, đổi ảnh hoặc gỡ.
 * Controlled qua `value` / `onChange` (URL/path từ API hoặc chuỗi rỗng).
 *
 * @param {Object} props
 * @param {string} [props.value]
 * @param {(next: string) => void} props.onChange
 * @param {(message: string) => void} [props.onError] — ví dụ hiển thị toast / form error
 * @param {(busy: boolean) => void} [props.onBusyChange] — để parent khóa submit khi đang upload
 * @param {boolean} [props.disabled]
 * @param {string} [props.id] — prefix id; file input dùng `${id}-file`
 * @param {string} [props.label]
 * @param {string} [props.accept]
 * @param {'circle'|'rounded'} [props.previewVariant]
 * @param {string} [props.previewClassName] — override kích thước/border cho `<img>`
 * @param {boolean} [props.showManualUrlInput]
 * @param {string} [props.manualUrlLabel]
 * @param {string} [props.manualUrlPlaceholder]
 * @param {string} [props.uploadingText]
 * @param {string} [props.removeLabel]
 * @param {string} [props.changeImageLabel]
 * @param {string} [props.chooseImageLabel]
 * @param {string} [props.emptyHint]
 * @param {string} [props.className]
 */
export function ImageUploadField({
  value = '',
  onChange,
  onError,
  onBusyChange,
  disabled = false,
  id: idProp,
  label = 'Ảnh',
  accept = 'image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp',
  previewVariant = 'circle',
  previewClassName,
  showManualUrlInput = false,
  manualUrlLabel = 'Hoặc URL ảnh',
  manualUrlPlaceholder = '/uploads/... hoặc https://...',
  uploadingText = 'Đang tải ảnh…',
  removeLabel = 'Gỡ ảnh',
  changeImageLabel = 'Chọn ảnh khác',
  chooseImageLabel = 'Chọn ảnh',
  emptyHint,
  className,
}) {
  const reactId = useId();
  const baseId = idProp ?? `img-upload-${reactId.replace(/:/g, '')}`;
  const fileInputId = `${baseId}-file`;
  const manualInputId = `${baseId}-manual-url`;

  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    onBusyChange?.(uploading);
  }, [uploading, onBusyChange]);

  const previewSrc = resolvePublicAssetUrl(value);
  const hasPreview = Boolean(previewSrc);

  const pickFile = () => {
    fileRef.current?.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file || disabled) return;

    setUploading(true);
    try {
      const data = await uploadService.uploadImage(file);
      const url = data?.url ?? '';
      onChange(url);
    } catch (e) {
      onError?.(getErrorMessage(e));
    } finally {
      setUploading(false);
    }
  };

  const handleClear = () => {
    if (disabled || uploading) return;
    onChange('');
  };

  const busy = disabled || uploading;

  return (
    <div className={cn('space-y-1.5', className)}>
      <Label htmlFor={fileInputId} className="text-sm font-medium">
        {label}
      </Label>

      <input
        ref={fileRef}
        id={fileInputId}
        type="file"
        accept={accept}
        className="sr-only"
        aria-label={label}
        disabled={busy}
        onChange={(e) => void handleFileChange(e)}
      />

      {!hasPreview ? (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-9 w-fit cursor-pointer"
            disabled={busy}
            onClick={pickFile}
          >
            {chooseImageLabel}
          </Button>
          {emptyHint ? (
            <p className="text-xs text-muted-foreground">{emptyHint}</p>
          ) : null}
        </div>
      ) : (
        <div className="flex flex-wrap items-start gap-3 pt-0.5">
          <img
            src={previewSrc}
            alt=""
            className={cn(
              'size-16 shrink-0 border bg-muted/30 object-cover',
              previewVariant === 'circle' ? 'rounded-full' : 'rounded-md',
              previewClassName
            )}
          />
          <div className="flex min-w-0 flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 cursor-pointer"
              disabled={busy}
              onClick={pickFile}
            >
              {changeImageLabel}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 cursor-pointer"
              disabled={busy}
              onClick={handleClear}
            >
              {removeLabel}
            </Button>
          </div>
        </div>
      )}

      {uploading ? (
        <p className="text-xs text-muted-foreground">{uploadingText}</p>
      ) : null}

      {showManualUrlInput ? (
        <div className="space-y-1.5 pt-1">
          <Label htmlFor={manualInputId} className="text-muted-foreground">
            {manualUrlLabel}
          </Label>
          <Input
            id={manualInputId}
            type="text"
            value={value}
            disabled={busy}
            onChange={(e) => onChange(e.target.value)}
            placeholder={manualUrlPlaceholder}
            className="h-9"
          />
        </div>
      ) : null}
    </div>
  );
}

export default ImageUploadField;
