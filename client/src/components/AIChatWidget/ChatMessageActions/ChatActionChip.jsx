function ChatActionChip({ children, onClick, className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex h-9 w-full min-w-0 items-center justify-center truncate rounded-full border border-(--border-color) bg-(--soft-surface-color) px-2 text-xs text-(--text-primary) transition hover:border-(--primary-color)/40 hover:bg-(--primary-color)/15 ${className}`}
    >
      {children}
    </button>
  );
}

export default ChatActionChip;
