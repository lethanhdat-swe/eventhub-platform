import { images } from "@/assets";
import { Send } from "lucide-react";
import { useState } from "react";
import { commentService } from "@/lib/services/comment";
import CommentItem from "./components/CommentItem/CommentItem";

function EventComment({ eventId, comments, setComments }) {
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        const trimmed = text.trim();
        if (!trimmed || loading) return;

        setLoading(true);
        try {
            const newComment = await commentService.create(eventId, { content: trimmed });
            setComments(prev => [newComment, ...prev]);
            setText('');
        } catch (err) {
            console.error('Failed to post comment:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleSubmit();
    };

    console.log('Rendering EventComment with comments:', comments);

    return (  
        <div className="space-y-5">
            <h1 className="text-(--text-primary) text-xl">
                Comments ({comments.length})
            </h1>
            
            <div className="flex items-center gap-3">
                <img
                    src={images.profile}
                    alt=""
                    className="object-cover w-18 h-18 rounded-4xl"
                />
                
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Write a comment..."
                    className="p-3 text-(--text-primary) w-full rounded-xl border border-(--text-primary)/60"
                />

                <button
                    onClick={handleSubmit}
                    disabled={!text.trim() || loading}
                    className="p-4 rounded-xl bg-(--primary-color) disabled:opacity-30 hover:opacity-80 active:scale-95 transition-all duration-200 cursor-pointer"
                >
                    <Send size={20} color="white" />
                </button>
            </div>

            {comments.map((comment) => (
                <CommentItem key={comment.id} comment={comment} setComments={setComments} />
            ))}
        </div>
    );
}

export default EventComment;