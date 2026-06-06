import { ImagePlus, Save, Star, X } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';

import { commentService } from '@/lib/services/comment';
import { uploadImages } from '@/lib/services/upload/uploadService';
import { resolvePublicAssetUrl } from '@/lib/url/resolvePublicAssetUrl';
import { useAuthStore } from '@/stores/authStore';

import CommentActions from '../CommentActions/CommentActions';
import CommentInfo from '../CommentInfo/CommentInfo';

const MAX_COMMENT_IMAGES = 5;
const MAX_IMAGE_SIZE_MB = 5;
const MAX_IMAGE_SIZE = MAX_IMAGE_SIZE_MB * 1024 * 1024;

function CommentItem({
  comment,
  eventId,
  onAddReply,
  onUpdateComment,
  onRemoveComment,
}) {
  const user = useAuthStore((state) => state.user);

  const currentUserId = user?.id;
  const currentUserRole = String(user?.role || '').toUpperCase();

  const isOwner =
    currentUserId === comment.userId || currentUserId === comment.user?.id;

  const isAdmin = currentUserRole === 'ADMIN';

  const canEdit = isOwner;
  const canDelete = isOwner || isAdmin;
  const canShowActions = canEdit || canDelete;

  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(comment.content || '');
  const [editRating, setEditRating] = useState(comment.rating || 1);
  const [editImageUrls, setEditImageUrls] = useState(
    Array.isArray(comment.imageUrls) ? comment.imageUrls : []
  );
  const [editImages, setEditImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const fileInputRef = useRef(null);

  const newImagePreviews = useMemo(
    () =>
      editImages.map((file) => ({
        file,
        url: URL.createObjectURL(file),
      })),
    [editImages]
  );

  const getErrorMessage = (error) => {
    const serverMessage =
      error?.response?.data?.message ||
      error?.response?.data?.error?.message ||
      error?.message;

    if (
      serverMessage === 'File size exceeds 5MB limit' ||
      serverMessage === 'File too large'
    ) {
      return `Ảnh vượt quá giới hạn ${MAX_IMAGE_SIZE_MB}MB.`;
    }

    return serverMessage || 'Không thể cập nhật bình luận. Vui lòng thử lại.';
  };

  const resetEditState = () => {
    setEditText(comment.content || '');
    setEditRating(comment.rating || 1);
    setEditImageUrls(Array.isArray(comment.imageUrls) ? comment.imageUrls : []);
    setEditImages([]);
    setErrorMessage('');
  };

  const handleEdit = () => {
    if (!canEdit) return;

    resetEditState();
    setEditing(true);
  };

  const handleCancel = () => {
    resetEditState();
    setEditing(false);
  };

  const handleDelete = async () => {
    if (!canDelete) return;

    try {
      await commentService.deleteOne(comment.id);
      onRemoveComment(comment.id);
      setEditing(false);
    } catch (error) {
      toast.error('Không thể xóa bình luận. Vui lòng thử lại.');
      console.error('Failed to delete comment:', error);
    }
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

    const totalImages =
      editImageUrls.length + editImages.length + selectedFiles.length;

    if (totalImages > MAX_COMMENT_IMAGES) {
      setErrorMessage(`Bạn chỉ được giữ tối đa ${MAX_COMMENT_IMAGES} ảnh.`);
      event.target.value = '';
      return;
    }

    setEditImages((prev) => [...prev, ...selectedFiles]);
    event.target.value = '';
  };

  const handleRemoveOldImage = (index) => {
    setEditImageUrls((prev) =>
      prev.filter((_, imageIndex) => imageIndex !== index)
    );
    setErrorMessage('');
  };

  const handleRemoveNewImage = (index) => {
    setEditImages((prev) =>
      prev.filter((_, imageIndex) => imageIndex !== index)
    );
    setErrorMessage('');
  };

  const handleSave = async () => {
    const trimmed = editText.trim();

    if (!canEdit) return;
    if (!trimmed || loading || editRating < 1) return;

    setLoading(true);
    setErrorMessage('');

    try {
      let newImageUrls = [];

      if (editImages.length > 0) {
        const uploadedImages = await uploadImages(editImages);
        newImageUrls = uploadedImages.map((image) => image.url);
      }

      const finalImageUrls = [...editImageUrls, ...newImageUrls];

      const updatedComment = await commentService.update(comment.id, {
        content: trimmed,
        rating: editRating,
        imageUrls: finalImageUrls,
      });

      onUpdateComment(comment.id, updatedComment);
      setEditing(false);
      setEditImages([]);
      setErrorMessage('');
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
      console.error('Failed to update comment:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <article className="group rounded-xl border border-(--border-color) bg-(--soft-surface-color)/60 px-3 py-3 transition-colors duration-200 hover:border-(--primary-color)/25 hover:bg-(--card-hover-color) sm:rounded-2xl sm:px-4 sm:py-4">
      <div className="relative">
        {editing ? (
          <div className="min-w-0 space-y-3">
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => {
                const isActive = star <= editRating;

                return (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setEditRating(star)}
                    disabled={loading}
                    className="cursor-pointer transition-transform hover:scale-110 active:scale-90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Star
                      size={22}
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
              value={editText}
              onChange={(event) => {
                setEditText(event.target.value);
                if (errorMessage) setErrorMessage('');
              }}
              rows={3}
              autoFocus
              disabled={loading}
              className="w-full resize-none rounded-lg border border-(--border-color) bg-(--background-color)/60 p-2 text-xs text-(--text-primary) outline-none transition-colors placeholder:text-(--muted-text) focus:border-(--primary-color)/70 disabled:cursor-not-allowed disabled:opacity-60 sm:p-2.5 sm:text-sm"
            />

            {(editImageUrls.length > 0 || newImagePreviews.length > 0) && (
              <div className="flex flex-wrap gap-2">
                {editImageUrls.map((url, index) => (
                  <div
                    key={`${url}-${index}`}
                    className="relative h-16 w-16 overflow-hidden rounded-lg border border-(--border-color) bg-(--background-color)/60 sm:h-20 sm:w-20"
                  >
                    <img
                      src={resolvePublicAssetUrl(url)}
                      alt=""
                      className="h-full w-full object-cover"
                    />

                    <button
                      type="button"
                      onClick={() => handleRemoveOldImage(index)}
                      disabled={loading}
                      className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/70 text-white disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}

                {newImagePreviews.map((image, index) => (
                  <div
                    key={`${image.file.name}-${index}`}
                    className="relative h-16 w-16 overflow-hidden rounded-lg border border-(--border-color) bg-(--background-color)/60 sm:h-20 sm:w-20"
                  >
                    <img
                      src={image.url}
                      alt=""
                      className="h-full w-full object-cover"
                    />

                    <button
                      type="button"
                      onClick={() => handleRemoveNewImage(index)}
                      disabled={loading}
                      className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/70 text-white disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {errorMessage && (
              <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs font-medium text-red-400">
                {errorMessage}
              </p>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3">
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
                  disabled={
                    loading ||
                    editImageUrls.length + editImages.length >=
                      MAX_COMMENT_IMAGES
                  }
                  className="flex cursor-pointer items-center gap-2 rounded-lg border border-(--border-color) px-3 py-2 text-xs font-bold text-(--muted-text) transition-colors hover:border-(--primary-color)/50 hover:text-(--primary-color) disabled:cursor-not-allowed disabled:opacity-35"
                >
                  <ImagePlus size={15} />
                  Thêm ảnh
                </button>

                <span className="hidden text-xs text-(--muted-text) sm:inline">
                  Tối đa {MAX_COMMENT_IMAGES} ảnh
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={loading}
                  className="rounded-lg border border-(--border-color) px-3 py-2 text-xs font-bold text-(--muted-text) transition-colors hover:text-(--text-primary) disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Hủy
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  disabled={loading || !editText.trim() || editRating < 1}
                  className="flex items-center gap-2 rounded-lg bg-(--primary-color) px-3 py-2 text-xs font-bold text-white transition-all duration-200 hover:opacity-90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Save size={14} />
                  {loading ? 'Đang lưu...' : 'Lưu'}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className={canShowActions ? 'pr-10' : ''}>
              <CommentInfo
                comment={comment}
                eventId={eventId}
                onAddReply={onAddReply}
                onUpdateComment={onUpdateComment}
                onRemoveComment={onRemoveComment}
              />
            </div>

            {canShowActions && (
              <div className="absolute right-0 top-0 shrink-0 opacity-100 transition-opacity duration-200 sm:opacity-0 sm:group-hover:opacity-100">
                <CommentActions
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  canEdit={canEdit}
                  canDelete={canDelete}
                />
              </div>
            )}
          </>
        )}
      </div>
    </article>
  );
}

export default CommentItem;
