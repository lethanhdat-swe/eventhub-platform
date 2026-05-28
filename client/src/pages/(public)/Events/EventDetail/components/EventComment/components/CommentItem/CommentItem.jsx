import { useState } from 'react';
import { commentService } from '@/lib/services/comment';
import CommentActions from '../CommentActions/CommentActions';
import CommentInfo from '../CommentInfo/CommentInfo';

function CommentItem({ comment, setComments }) {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(comment.content || '');
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      await commentService.deleteOne(comment.id);
      setComments((prev) => prev.filter((item) => item.id !== comment.id));
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
    setEditText(comment.content || '');
  };

  const handleSave = async () => {
    const trimmed = editText.trim();

    if (!trimmed || loading) return;

    setLoading(true);

    try {
      const updatedComment = await commentService.update(comment.id, {
        content: trimmed,
      });

      setComments((prev) =>
        prev.map((item) => (item.id === comment.id ? updatedComment : item))
      );

      setEditing(false);
    } catch (error) {
      console.error('Failed to update comment:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <article className="group flex items-start justify-between gap-2.5 rounded-xl border border-(--border-color) bg-(--soft-surface-color)/60 px-3 py-3 transition-colors duration-200 hover:border-(--primary-color)/25 hover:bg-(--card-hover-color)">
      {editing ? (
        <div className="min-w-0 flex-1">
          <textarea
            value={editText}
            onChange={(event) => setEditText(event.target.value)}
            rows={2}
            autoFocus
            className="w-full resize-none rounded-lg border border-(--border-color) bg-(--background-color)/60 p-2.5 text-sm text-(--text-primary) outline-none transition-colors placeholder:text-(--muted-text) focus:border-(--primary-color)/70"
          />

          <div className="mt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={handleSave}
              disabled={loading || !editText.trim()}
              className="rounded-lg bg-(--primary-color) px-3 py-1.5 text-xs font-bold text-white transition-all duration-200 hover:opacity-90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {loading ? 'Đang lưu...' : 'Lưu'}
            </button>

            <button
              type="button"
              onClick={handleCancel}
              disabled={loading}
              className="rounded-lg border border-(--border-color) px-3 py-1.5 text-xs font-bold text-(--muted-text) transition-colors hover:text-(--text-primary) disabled:cursor-not-allowed disabled:opacity-50"
            >
              Hủy
            </button>
          </div>
        </div>
      ) : (
        <CommentInfo comment={comment} setComments={setComments} />
      )}

      {!editing && (
        <div className="opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <CommentActions onEdit={handleEdit} onDelete={handleDelete} />
        </div>
      )}
    </article>
  );
}

export default CommentItem;
