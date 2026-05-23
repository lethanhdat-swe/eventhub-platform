import { useState } from "react";
import { commentService } from "@/lib/services/comment";
import CommentActions from "../CommentActions/CommentActions";
import CommentInfo from "../CommentInfo/CommentInfo";

function CommentItem({ comment, setComments }) {
    const [editing, setEditing] = useState(false);
    const [editText, setEditText] = useState(comment.content);
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        try {
            await commentService.deleteOne(comment.id);
            setComments(prev => prev.filter(c => c.id !== comment.id));
        } catch (err) {
            console.error('Failed to delete:', err);
        }
    };

    const handleEdit = () => {
        setEditing(true);
    };

    const handleSave = async () => {
        const trimmed = editText.trim();
        if (!trimmed || loading) return;

        setLoading(true);
        try {
            const updated = await commentService.update(comment.id, { content: trimmed });
            setComments(prev => prev.map(c => c.id === comment.id ? updated : c));
            setEditing(false);
        } catch (err) {
            console.error('Failed to update:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-start justify-between rounded-3xl border border-(--text-primary)/5 bg-(--text-primary)/2 backdrop-blur-xl p-4 transition-all duration-300 hover:border-(--primary-color)/20 hover:bg-(--text-primary)/3">
            
            {editing ? (
                <div className="flex flex-col w-full gap-2 mr-3">
                    <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        rows={3}
                        className="w-full p-3 rounded-xl border border-(--text-primary)/30 bg-transparent text-(--text-primary) resize-none focus:outline-none"
                    />
                    <div className="flex gap-2">
                        <button
                            onClick={handleSave}
                            disabled={loading}
                            className="px-4 py-1.5 rounded-lg bg-(--primary-color) text-white text-sm disabled:opacity-40 hover:opacity-80 transition-all"
                        >
                            {loading ? 'Saving...' : 'Save'}
                        </button>
                        <button
                            onClick={() => { setEditing(false); setEditText(comment.content); }}
                            className="px-4 py-1.5 rounded-lg border border-(--text-primary)/20 text-(--text-primary)/60 text-sm hover:opacity-80 transition-all"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <CommentInfo comment={comment} setComments={setComments}/>
            )}

            <CommentActions onEdit={handleEdit} onDelete={handleDelete} />
        </div>
    );
}

export default CommentItem;