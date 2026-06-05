import { Send } from 'lucide-react';

function ReplyInput({ value, onChange, onSubmit, onKeyDown, loading }) {
  return (
    <div className="mt-3 flex items-center gap-2">
      <input
        type="text"
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        disabled={loading}
        placeholder="Viết phản hồi..."
        className="
          h-12 flex-1 rounded-xl
          border border-(--border-color)
          bg-(--background-color)/50
          px-3 text-sm font-medium
          text-(--text-primary)
          outline-none
          transition-colors
          placeholder:text-(--muted-text)
          focus:border-(--primary-color)/60
          disabled:cursor-not-allowed
          disabled:opacity-60
        "
      />

      <button
        type="button"
        onClick={onSubmit}
        disabled={loading || !value.trim()}
        className="
          flex h-10 w-10 shrink-0 cursor-pointer
          items-center justify-center rounded-xl
          bg-(--primary-color)
          text-white
          transition-all duration-200
          hover:opacity-90
          active:scale-95
          disabled:cursor-not-allowed
          disabled:opacity-35
        "
      >
        <Send size={16} />
      </button>
    </div>
  );
}

export default ReplyInput;
