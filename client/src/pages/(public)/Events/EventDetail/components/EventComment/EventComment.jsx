import {
  ImagePlus,
  Loader2,
  LogIn,
  MessageCircle,
  Send,
  Star,
  X,
} from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';

import { commentService } from '@/lib/services/comment';
import { uploadImages } from '@/lib/services/upload/uploadService';
import { useAuthStore } from '@/stores/authStore';

import CommentItem from './components/CommentItem/CommentItem';
import { resolvePublicAssetUrl } from '@/lib/url/resolvePublicAssetUrl';

const MAX_COMMENT_IMAGES = 5;
const MAX_IMAGE_SIZE_MB = 5;
const MAX_IMAGE_SIZE = MAX_IMAGE_SIZE_MB * 1024 * 1024;

function EventComment({
  eventId,
  comments = [],
  onAddComment,
  onAddReply,
  onUpdateComment,
  onRemoveComment,
}) {
  const [text, setText] = useState('');
  const [rating, setRating] = useState(5);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const fileInputRef = useRef(null);
  const user = useAuthStore((state) => state.user);

  const imagePreviews = useMemo(
    () =>
      images.map((file) => ({
        file,
        url: URL.createObjectURL(file),
      })),
    [images]
  );

  const getErrorMessage = (error) => {
    const serverMessage =
      error?.response?.data?.message ||
      error?.response?.data?.error?.message ||
      error?.message;

    if (serverMessage === 'File size exceeds 5MB limit') {
      return `Ảnh vượt quá giới hạn ${MAX_IMAGE_SIZE_MB}MB.`;
    }

    if (serverMessage === 'File too large') {
      return `Ảnh vượt quá giới hạn ${MAX_IMAGE_SIZE_MB}MB.`;
    }

    return serverMessage || 'Không thể gửi đánh giá. Vui lòng thử lại.';
  };

  const handleChooseImages = (event) => {
    const selectedFiles = Array.from(event.target.files || []);

    if (selectedFiles.length === 0) return;

    setErrorMessage('');

    const invalidTypeFile = selectedFiles.find(
      (file) => !file.type.startsWith('image/')
    );

    if (invalidTypeFile) {
      setErrorMessage('Chỉ được tải lên file ảnh.');
      event.target.value = '';
      return;
    }

    const invalidSizeFile = selectedFiles.find(
      (file) => file.size > MAX_IMAGE_SIZE
    );

    if (invalidSizeFile) {
      setErrorMessage(
        `Ảnh "${invalidSizeFile.name}" vượt quá ${MAX_IMAGE_SIZE_MB}MB.`
      );
      event.target.value = '';
      return;
    }

    const totalImages = images.length + selectedFiles.length;

    if (totalImages > MAX_COMMENT_IMAGES) {
      setErrorMessage(`Bạn chỉ được chọn tối đa ${MAX_COMMENT_IMAGES} ảnh.`);
      event.target.value = '';
      return;
    }

    setImages((prev) => [...prev, ...selectedFiles]);
    event.target.value = '';
  };

  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, imageIndex) => imageIndex !== index));
    setErrorMessage('');
  };

  const handleSubmit = async () => {
    const trimmed = text.trim();

    if (!user) return;
    if (!trimmed || rating < 1 || loading) return;

    setErrorMessage('');
    setLoading(true);

    try {
      let imageUrls = [];

      if (images.length > 0) {
        const uploadedImages = await uploadImages(images);
        imageUrls = uploadedImages.map((image) => image.url);
      }

      const newComment = await commentService.create(eventId, {
        content: trimmed,
        rating,
        imageUrls,
        parentId: null,
      });

      onAddComment(newComment);
      setText('');
      setRating(5);
      setImages([]);
      setErrorMessage('');
      toast.success('Đã gửi đánh giá.');
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
      console.error('Failed to post comment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  };

  return (
    <section className="mt-6 border-t border-(--border-color) pt-6 sm:mt-8 sm:pt-8">
      <div className="mb-4 flex flex-col items-start gap-2 sm:mb-5 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
        <div>
          <p className="mb-1.5 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-(--primary-color) sm:mb-2 sm:text-xs">
            <MessageCircle size={13} className="sm:hidden" />
            <MessageCircle size={15} className="hidden sm:block" />
            Bình luận
          </p>

          <h2 className="text-xl font-black tracking-tight text-(--text-primary) sm:text-2xl">
            Thảo luận về sự kiện
          </h2>
        </div>

        <span className="self-start rounded-full border border-(--border-color) bg-(--soft-surface-color) px-2.5 py-1 text-[10px] font-bold text-(--muted-text) sm:self-auto sm:px-3 sm:py-1.5 sm:text-xs">
          {comments.length} bình luận
        </span>
      </div>

      {user ? (
        <div className="mb-4 rounded-xl border border-(--border-color) bg-(--soft-surface-color) p-3 sm:mb-6 sm:rounded-2xl sm:p-4">
          <div className="flex items-start gap-3">
            {user?.avatarUrl ? (
              <img
                src={resolvePublicAssetUrl(user.avatarUrl)}
                alt={user.name}
                referrerPolicy="no-referrer"
                className="h-9 w-9 shrink-0 rounded-full object-cover ring-2 ring-(--border-color) sm:h-11 sm:w-11"
              />
            ) : (
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-(--primary-color) text-xs font-black text-white sm:h-11 sm:w-11 sm:text-sm">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
            )}

            <div className="flex-1 min-w-0 space-y-3">
              <div className="flex items-center gap-1.5 pb-2">
                {[1, 2, 3, 4, 5].map((star) => {
                  const isActive = star <= rating;

                  return (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      disabled={loading}
                      className="transition-transform cursor-pointer hover:scale-110 active:scale-90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Star
                        size={24}
                        strokeWidth={2}
                        className={
                          isActive
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'fill-transparent text-(--muted-text)'
                        }
                      />
                    </button>
                  );
                })}
              </div>

              <textarea
                value={text}
                onChange={(event) => {
                  setText(event.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
                onKeyDown={handleKeyDown}
                rows={3}
                placeholder="Chia sẻ cảm nhận của bạn về sự kiện..."
                disabled={loading}
                className="min-h-24 w-full resize-none rounded-xl border border-(--border-color) bg-(--background-color)/60 px-3 py-3 text-sm font-medium text-(--text-primary) outline-none transition-colors placeholder:text-(--muted-text) focus:border-(--primary-color)/70 disabled:cursor-not-allowed disabled:opacity-60"
              />

              {imagePreviews.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {imagePreviews.map((image, index) => (
                    <div
                      key={`${image.file.name}-${index}`}
                      className="relative h-16 w-16 overflow-hidden rounded-lg border border-(--border-color) bg-(--background-color)/60"
                    >
                      <img
                        src={image.url}
                        alt=""
                        className="object-cover w-full h-full"
                      />

                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        disabled={loading}
                        className="absolute flex items-center justify-center w-5 h-5 text-white rounded-full right-1 top-1 bg-black/70 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {errorMessage && (
                <p className="px-3 py-2 text-xs font-medium text-red-400 border rounded-lg border-red-500/20 bg-red-500/10">
                  {errorMessage}
                </p>
              )}

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleChooseImages}
                    className="hidden"
                  />

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={loading || images.length >= MAX_COMMENT_IMAGES}
                    className="flex cursor-pointer items-center gap-2 rounded-lg border border-(--border-color) px-3 py-2 text-xs font-bold text-(--muted-text) transition-colors hover:border-(--primary-color)/50 hover:text-(--primary-color) disabled:cursor-not-allowed disabled:opacity-35"
                  >
                    <ImagePlus size={15} />
                    Thêm ảnh
                  </button>

                  <span className="hidden text-xs text-(--muted-text) sm:inline">
                    Tối đa {MAX_COMMENT_IMAGES} ảnh, mỗi ảnh {MAX_IMAGE_SIZE_MB}
                    MB
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!text.trim() || rating < 1 || loading}
                  className="flex cursor-pointer items-center gap-2 rounded-lg bg-(--primary-color) px-4 py-2 text-xs font-bold text-white transition-all duration-200 hover:opacity-90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-35"
                >
                  {loading ? (
                    <Loader2 size={15} className="animate-spin" />
                  ) : (
                    <Send size={15} />
                  )}
                  {loading ? 'Đang gửi...' : 'Gửi đánh giá'}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-4 rounded-xl border border-(--border-color) bg-(--soft-surface-color) px-4 py-4 sm:mb-6 sm:rounded-2xl sm:px-5 sm:py-5">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="flex items-center gap-2 text-sm font-bold text-(--text-primary) sm:text-base">
                <LogIn size={16} />
                Đăng nhập để tham gia bình luận
              </p>

              <p className="mt-1 text-xs text-(--muted-text) sm:text-sm">
                Bạn cần đăng nhập trước khi gửi đánh giá, chọn sao hoặc tải ảnh.
              </p>
            </div>

            <span className="shrink-0 rounded-full border border-(--primary-color)/30 bg-(--primary-color)/10 px-3 py-1.5 text-xs font-bold text-(--primary-color)">
              Cần đăng nhập
            </span>
          </div>
        </div>
      )}

      {comments.length > 0 ? (
        <div className="space-y-2.5 sm:space-y-3">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              eventId={eventId}
              onAddReply={onAddReply}
              onUpdateComment={onUpdateComment}
              onRemoveComment={onRemoveComment}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-(--border-color) bg-(--soft-surface-color) p-4 text-xs text-(--muted-text) sm:rounded-2xl sm:p-5 sm:text-sm">
          Chưa có bình luận nào. Hãy là người đầu tiên chia sẻ cảm nhận về sự
          kiện này.
        </div>
      )}
    </section>
  );
}

export default EventComment;
