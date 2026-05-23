import { images } from "@/assets";
import { useState } from "react";
import { commentService } from "@/lib/services/comment";
import ReplyInput from "./components/ReplyInput/ReplyInput";
import ReplyList from "./components/ReplyList/ReplyList";

function CommentInfo({ comment, setComments }) {
    const [replying, setReplying] = useState(false);
    const [replyText, setReplyText] = useState("");
    const [loading, setLoading] = useState(false);

    const [editingReplyId, setEditingReplyId] =
        useState(null);

    const [editReplyText, setEditReplyText] =
        useState("");

    const handleReply = async () => {
        const trimmed = replyText.trim();

        if (!trimmed || loading) return;

        setLoading(true);

        try {
            const newReply = await commentService.create(
                comment.eventId,
                {
                    content: trimmed,
                    parentId: comment.id,
                }
            );

            setComments((prev) =>
                prev.map((c) =>
                    c.id === comment.id
                        ? {
                              ...c,
                              replies: [
                                  ...(c.replies ?? []),
                                  newReply,
                              ],
                          }
                        : c
                )
            );

            setReplyText("");
            setReplying(false);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const handleReplyKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleReply();
        }
    };

    const handleUpdateReply = async (replyId) => {
        const trimmed = editReplyText.trim();

        if (!trimmed) return;

        try {
            const updated = await commentService.update(
                replyId,
                {
                    content: trimmed,
                }
            );

            setComments((prev) =>
                prev.map((c) => ({
                    ...c,
                    replies: (c.replies ?? []).map((r) =>
                        r.id === replyId ? updated : r
                    ),
                }))
            );

            setEditingReplyId(null);
            setEditReplyText("");
        } catch (err) {
            console.log(err);
        }
    };

    const handleDeleteReply = async (replyId) => {
        try {
            await commentService.deleteOne(replyId);

            setComments((prev) =>
                prev.map((c) => ({
                    ...c,
                    replies: (c.replies ?? []).filter(
                        (r) => r.id !== replyId
                    ),
                }))
            );
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="w-full">
            <div className="flex items-start gap-4">
                <img
                    src={comment.avatarUrl ?? images.profile}
                    alt=""
                    className="object-cover w-16 h-16 rounded-full ring-2 ring-(--primary-color)/20"
                />

                <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                        <h1 className="text-(--text-primary) text-lg font-semibold">
                            {comment.user.fullName}
                        </h1>

                        <span className="text-(--text-primary)/40 text-sm">
                            {new Date(
                                comment.createdAt
                            ).toLocaleString("vi-VN")}
                        </span>
                    </div>

                    <p className="text-(--text-primary)/80 leading-relaxed">
                        {comment.content}
                    </p>

                    <button
                        onClick={() =>
                            setReplying(!replying)
                        }
                        className="cursor-pointer text-(--text-primary)/60 text-sm hover:text-(--primary-color)"
                    >
                        Reply
                    </button>

                    {replying && (
                        <ReplyInput
                            value={replyText}
                            onChange={(e) =>
                                setReplyText(
                                    e.target.value
                                )
                            }
                            onSubmit={handleReply}
                            onKeyDown={
                                handleReplyKeyDown
                            }
                            loading={loading}
                        />
                    )}

                    <ReplyList
                        replies={comment.replies}
                        editingReplyId={editingReplyId}
                        editReplyText={editReplyText}
                        setEditReplyText={setEditReplyText}
                        setEditingReplyId={setEditingReplyId}
                        handleUpdateReply={handleUpdateReply}
                        handleDeleteReply={handleDeleteReply }
                    />
                </div>
            </div>
        </div>
    );
}

export default CommentInfo;