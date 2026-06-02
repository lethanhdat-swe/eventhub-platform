import { Loader2 } from 'lucide-react';

import ChatConversationHeader from './ChatConversationHeader';
import ChatMessageList from './ChatMessageList';
import EmptyChatState from './EmptyChatState';

function ChatConversation({ session, isLoading, error, onRetry }) {
  if (!session) {
    return <EmptyChatState />;
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <ChatConversationHeader session={session} />
      {error ? (
        <div className="m-4 rounded-xl border border-destructive/25 bg-destructive/5 p-4 text-sm text-destructive">
          <p>{error}</p>
          <button
            type="button"
            onClick={() => onRetry?.()}
            className="mt-2 rounded-lg border border-destructive/30 bg-background px-2.5 py-1 text-xs font-medium text-destructive transition hover:bg-destructive/10"
          >
            Retry loading messages
          </button>
        </div>
      ) : isLoading ? (
        <div className="flex min-h-0 flex-1 items-center justify-center">
          <Loader2 size={20} className="animate-spin text-muted-foreground" />
        </div>
      ) : (
        <ChatMessageList messages={session.messages} />
      )}
    </div>
  );
}

export default ChatConversation;
