import { Loader2, SendHorizontal } from 'lucide-react';

import { canAdminSendMessage } from '@/lib/aiChat/adminChatSession';
import { CHAT_SESSION_STATUS, normalizeSessionStatus } from '@/lib/aiChat/chatSessionStatus';

function ChatReplyComposer({
  status,
  draft,
  onDraftChange,
  onSend,
  isSending,
}) {
  const normalizedStatus = normalizeSessionStatus(status);
  const canSend = canAdminSendMessage(normalizedStatus);
  const isClosed = normalizedStatus === CHAT_SESSION_STATUS.CLOSED;

  if (isClosed) {
    return (
      <div className="border-t px-6 py-4">
        <p className="rounded-xl border bg-muted/40 px-4 py-3 text-center text-sm text-muted-foreground">
          Cuộc trò chuyện này đã được đóng.
        </p>
      </div>
    );
  }

  if (!canSend) {
    return (
      <div className="border-t px-6 py-4">
        <p className="rounded-xl border border-dashed px-4 py-3 text-center text-sm text-muted-foreground">
          Chuyển sang hỗ trợ viên để trả lời thủ công.
        </p>
      </div>
    );
  }

  const handleSend = () => {
    const trimmed = draft.trim();
    if (!trimmed || isSending) return;
    onSend(trimmed);
  };

  return (
    <div className="border-t px-6 py-4">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={draft}
          onChange={(event) => onDraftChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              handleSend();
            }
          }}
          disabled={isSending}
          placeholder="Nhập tin nhắn trả lời..."
          className="h-10 flex-1 rounded-xl border bg-background px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={!draft.trim() || isSending}
          aria-label="Gửi tin nhắn"
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSending ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <SendHorizontal size={16} />
          )}
        </button>
      </div>
    </div>
  );
}

export default ChatReplyComposer;
