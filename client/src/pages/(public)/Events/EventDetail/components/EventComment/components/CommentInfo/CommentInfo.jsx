import { useState } from 'react';
import { Star } from 'lucide-react';

import { commentService } from '@/lib/services/comment';
import { resolvePublicAssetUrl } from '@/lib/url/resolvePublicAssetUrl';

import ReplyInput from './components/ReplyInput/ReplyInput';
import ReplyList from './components/ReplyList/ReplyList';

function CommentInfo({
  comment,
  eventId,
  onAddReply,
  onUpdateComment,
  onRemoveComment,
}) {
  const [replying, setReplying] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingReplyId, setEditingReplyId] = useState(null);
  const [editReplyText, setEditReplyText] = useState('');

  const imageUrls = Array.isArray(comment.imageUrls) ? comment.imageUrls : [];

  const handleReply = async () => {
    const trimmed = replyText.trim();

    if (!trimmed || loading) return;

    setLoading(true);

    try {
      const newReply = await commentService.create(eventId, {
        content: trimmed,
        parentId: comment.id,
        rating: null,
        imageUrls: [],
      });

      onAddReply(comment.id, newReply);
      setReplyText('');
      setReplying(false);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReplyKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleReply();
    }
  };

  const handleUpdateReply = async (replyId) => {
    const trimmed = editReplyText.trim();

    if (!trimmed) return;

    try {
      const updated = await commentService.update(replyId, {
        content: trimmed,
      });

      onUpdateComment(replyId, updated);
      setEditingReplyId(null);
      setEditReplyText('');
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteReply = async (replyId) => {
    try {
      await commentService.deleteOne(replyId);
      onRemoveComment(replyId);

      if (editingReplyId === replyId) {
        setEditingReplyId(null);
        setEditReplyText('');
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="w-full min-w-0">
      <div className="flex items-start gap-3 sm:gap-4">
        <img
          src={resolvePublicAssetUrl(comment.user.avatarUrl)}
          alt=""
          referrerPolicy="no-referrer"
          className="h-9 w-9 shrink-0 rounded-full object-cover ring-1 ring-(--border-color) sm:h-10 sm:w-10"
        />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <h1 className="text-sm font-semibold text-(--text-primary) sm:text-lg">
              {comment.user.fullName}
            </h1>

            <span className="text-xs text-(--text-primary)/40 sm:text-sm">
              {new Date(comment.createdAt).toLocaleString('vi-VN')}
            </span>

            {comment.rating ? (
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={14}
                    className={
                      star <= comment.rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-(--muted-text)'
                    }
                  />
                ))}
              </div>
            ) : null}
          </div>

          <p className="mt-2 text-sm leading-relaxed text-(--text-primary)/80 wrap-break-word sm:text-base">
            {comment.content}
          </p>

          {imageUrls.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {imageUrls.map((url, index) => (
                <img
                  key={`${url}-${index}`}
                  src={resolvePublicAssetUrl(url)}
                  alt=""
                  className="h-20 w-20 rounded-lg border border-(--border-color) object-cover sm:h-24 sm:w-24"
                />
              ))}
            </div>
          )}

          <div className="mt-3">
            <button
              type="button"
              onClick={() => setReplying(!replying)}
              className="cursor-pointer text-xs font-semibold text-(--muted-text) transition-colors hover:text-(--primary-color) sm:text-sm"
            >
              {replying ? 'Hủy phản hồi' : 'Phản hồi'}
            </button>
          </div>

          {replying && (
            <div className="mt-3">
              <ReplyInput
                value={replyText}
                onChange={(event) => setReplyText(event.target.value)}
                onSubmit={handleReply}
                onKeyDown={handleReplyKeyDown}
                loading={loading}
              />
            </div>
          )}

          {comment.replies?.length > 0 && (
            <div className="mt-4 space-y-3">
              <ReplyList
                replies={comment.replies}
                editingReplyId={editingReplyId}
                editReplyText={editReplyText}
                setEditReplyText={setEditReplyText}
                setEditingReplyId={setEditingReplyId}
                handleUpdateReply={handleUpdateReply}
                handleDeleteReply={handleDeleteReply}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CommentInfo;
