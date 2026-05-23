import { Send } from "lucide-react";

function ReplyInput({
    value,
    onChange,
    onSubmit,
    onKeyDown,
    loading,
}) {
    return (
        <div className="flex items-center gap-2 mt-3">
            <input
                type="text"
                value={value}
                onChange={onChange}
                onKeyDown={onKeyDown}
                placeholder="Write a reply..."
                className="flex-1 p-3 rounded-xl border border-(--text-primary)/20 bg-transparent text-(--text-primary)"
            />

            <button
                onClick={onSubmit}
                disabled={loading}
                className="p-3 rounded-xl bg-(--primary-color)"
            >
                <Send size={18} color="white" />
            </button>
        </div>
    );
}

export default ReplyInput;