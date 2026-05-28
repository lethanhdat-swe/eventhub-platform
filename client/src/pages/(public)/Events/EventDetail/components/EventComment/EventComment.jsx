import { MessageCircle, Send } from 'lucide-react';
import { useState } from 'react';
import { commentService } from '@/lib/services/comment';
import CommentItem from './components/CommentItem/CommentItem';
import { useAuthStore } from '@/stores/authStore';

function EventComment({ eventId, comments = [], setComments }) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const user = useAuthStore((state) => state.user);

  const handleSubmit = async () => {
    const trimmed = text.trim();

    if (!trimmed || loading) return;

    setLoading(true);

    try {
      const newComment = await commentService.create(eventId, {
        content: trimmed,
      });

      setComments((prev) => [newComment, ...prev]);
      setText('');
    } catch (error) {
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
    <section className="mt-8 border-t border-(--border-color) pt-8">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-(--primary-color)">
            <MessageCircle size={15} />
            Bình luận
          </p>

          <h2 className="text-2xl font-black tracking-tight text-(--text-primary)">
            Thảo luận về sự kiện
          </h2>
        </div>

        <span className="rounded-full border border-(--border-color) bg-(--soft-surface-color) px-3 py-1.5 text-xs font-bold text-(--muted-text)">
          {comments.length} bình luận
        </span>
      </div>

      <div className="mb-6 flex items-start gap-3 rounded-2xl border border-(--border-color) bg-(--soft-surface-color) p-3">
        {user.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt={user.name}
            referrerPolicy="no-referrer"
            className="h-11 w-11 shrink-0 rounded-full object-cover ring-2 ring-(--border-color)"
          />
        ) : (
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-(--primary-color) text-sm font-black text-white">
            {user.name.charAt(0).toUpperCase()}
          </div>
        )}

        <div className="flex min-w-0 flex-1 items-center gap-3">
          <input
            type="text"
            value={text}
            onChange={(event) => setText(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Viết bình luận của bạn..."
            className="h-11 min-w-0 flex-1 rounded-xl border border-(--border-color) bg-(--background-color)/60 px-4 text-sm font-medium text-(--text-primary) outline-none transition-colors placeholder:text-(--muted-text) focus:border-(--primary-color)/70"
          />

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!text.trim() || loading}
            className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-(--primary-color) text-white transition-all duration-200 hover:opacity-90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-35"
          >
            <Send size={18} />
          </button>
        </div>
      </div>

      {comments.length > 0 ? (
        <div className="space-y-3">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              setComments={setComments}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-(--border-color) bg-(--soft-surface-color) p-5 text-sm text-(--muted-text)">
          Chưa có bình luận nào. Hãy là người đầu tiên chia sẻ cảm nhận về sự
          kiện này.
        </div>
      )}
    </section>
  );
}

export default EventComment;
