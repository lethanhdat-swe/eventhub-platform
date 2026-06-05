import ReplyItem from '../ReplyItem/ReplyItem';

function ReplyList({
  replies = [],
  editingReplyId,
  editReplyText,
  setEditReplyText,
  setEditingReplyId,
  handleUpdateReply,
  handleDeleteReply,
}) {
  if (!replies.length) return null;

  return (
    <div className="border-l border-(--text-primary)/10 pl-5 space-y-8">
      {replies.map((reply) => {
        const nestedReplies = Array.isArray(reply.replies)
          ? reply.replies
          : [];

        return (
          <div key={reply.id}>
            <ReplyItem
              reply={reply}
              editingReplyId={editingReplyId}
              editReplyText={editReplyText}
              setEditReplyText={setEditReplyText}
              setEditingReplyId={setEditingReplyId}
              handleUpdateReply={handleUpdateReply}
              handleDeleteReply={handleDeleteReply}
            />

            {nestedReplies.length > 0 && (
              <div className="mt-4">
                <ReplyList
                  replies={nestedReplies}
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
        );
      })}
    </div>
  );
}

export default ReplyList;
