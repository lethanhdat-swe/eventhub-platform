import { resolvePublicAssetUrl } from '@/lib/url/resolvePublicAssetUrl';
import { useAuthStore } from '@/stores/authStore';

import CommentActions from '../../../CommentActions/CommentActions';

function ReplyItem({
  reply,
  editingReplyId,
  editReplyText,
  setEditReplyText,
  setEditingReplyId,
  handleUpdateReply,
  handleDeleteReply,
}) {
  const user = useAuthStore((state) => state.user);

  const currentUserId = user?.id;
  const currentUserRole = String(user?.role || '').toUpperCase();

  const isOwner =
    currentUserId === reply.userId || currentUserId === reply.user?.id;

  const isAdmin = currentUserRole === 'ADMIN';

  const canEdit = isOwner;
  const canDelete = isOwner || isAdmin;
  const canShowActions = canEdit || canDelete;

  return (
    <div className="group/reply flex gap-3 rounded-xl">
      <img
        src={resolvePublicAssetUrl(reply.user.avatarUrl)}
        alt=""
        referrerPolicy="no-referrer"
        className="h-8 w-8 shrink-0 rounded-full object-cover ring-1 ring-(--border-color)"
      />

      <div className="min-w-0 flex-1">
        <div className="relative">
          <div className={canShowActions ? 'pr-10' : ''}>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-sm font-semibold text-(--text-primary)">
                {reply.user.fullName}
              </h2>

              <span className="text-xs text-(--text-primary)/40">
                {new Date(reply.createdAt).toLocaleString('vi-VN')}
              </span>
            </div>

            {editingReplyId === reply.id ? (
              <div className="mt-2 space-y-2">
                <input
                  value={editReplyText}
                  onChange={(e) => setEditReplyText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleUpdateReply(reply.id);
                    }
                  }}
                  autoFocus
                  className="h-10 w-full rounded-lg border border-(--border-color) bg-(--background-color)/50 px-3 text-sm text-(--text-primary) outline-none transition-colors placeholder:text-(--muted-text) focus:border-(--primary-color)/60"
                />

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleUpdateReply(reply.id)}
                    disabled={!editReplyText.trim()}
                    className="rounded-lg bg-(--primary-color) px-3 py-1.5 text-xs font-bold text-white transition-all duration-200 hover:opacity-90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Lưu
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setEditingReplyId(null);
                      setEditReplyText('');
                    }}
                    className="rounded-lg border border-(--border-color) px-3 py-1.5 text-xs font-bold text-(--muted-text) transition-colors hover:text-(--text-primary)"
                  >
                    Hủy
                  </button>
                </div>
              </div>
            ) : (
              <p className="mt-1 text-sm leading-relaxed text-(--text-primary)/80 wrap-break-word">
                {reply.content}
              </p>
            )}
          </div>

          {canShowActions && editingReplyId !== reply.id && (
            <div className="absolute right-0 top-0 opacity-100 transition-opacity duration-200 sm:opacity-0 sm:group-hover/reply:opacity-100">
              <CommentActions
                onEdit={() => {
                  if (!canEdit) return;

                  setEditingReplyId(reply.id);
                  setEditReplyText(reply.content);
                }}
                onDelete={() => {
                  if (!canDelete) return;

                  handleDeleteReply(reply.id);
                }}
                canEdit={canEdit}
                canDelete={canDelete}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ReplyItem;
