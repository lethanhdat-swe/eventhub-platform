function ChatActionChip({ children, onClick, className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border border-(--border-color) bg-(--soft-surface-color) px-3 py-1.5 text-xs text-(--text-primary) transition hover:border-(--primary-color)/40 hover:bg-(--primary-color)/15 ${className}`}
    >
      {children}
    </button>
  );
}

export default ChatActionChip;
