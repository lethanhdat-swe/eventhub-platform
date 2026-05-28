import { resolvePublicAssetUrl } from '@/lib/url/resolvePublicAssetUrl';
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
  return (
    <div className="flex gap-3">
      <img
        src={resolvePublicAssetUrl(reply.user.avatarUrl)}
        alt=""
        className="w-10 h-10 rounded-full"
      />

      <div className="flex-1">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
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
                  className="w-full p-2 rounded-lg border border-(--text-primary)/20 bg-transparent text-(--text-primary)"
                />

                <div className="flex gap-2">
                  <button
                    onClick={() => handleUpdateReply(reply.id)}
                    className="text-xs text-green-400"
                  >
                    Save
                  </button>

                  <button
                    onClick={() => setEditingReplyId(null)}
                    className="text-xs text-red-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-(--text-primary)/80 mt-1">
                {reply.content}
              </p>
            )}
          </div>

          <CommentActions
            onEdit={() => {
              setEditingReplyId(reply.id);
              setEditReplyText(reply.content);
            }}
            onDelete={() => handleDeleteReply(reply.id)}
          />
        </div>
      </div>
    </div>
  );
}

export default ReplyItem;
