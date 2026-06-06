import { Loader2 } from 'lucide-react';

import { AdminErrorState } from '@/pages/(admin)/components/table';

import ChatConversationHeader from './ChatConversationHeader';
import ChatMessageList from './ChatMessageList';
import ChatReplyComposer from './ChatReplyComposer';
import EmptyChatState from './EmptyChatState';

function ChatConversation({
  session,
  isLoading,
  error,
  onRetry,
  replyDraft,
  onReplyDraftChange,
  onSendReply,
  isSendingReply,
  isUpdatingStatus,
  onSwitchToHuman,
  onBackToAi,
  onCloseChat,
}) {
  if (!session) {
    return <EmptyChatState />;
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <ChatConversationHeader
        session={session}
        isUpdatingStatus={isUpdatingStatus}
        onSwitchToHuman={onSwitchToHuman}
        onBackToAi={onBackToAi}
        onCloseChat={onCloseChat}
      />
      {error ? (
        <div className="m-4">
          <AdminErrorState
            message={error}
            onRetry={onRetry}
            retryLabel="Tải lại tin nhắn"
            compact
          />
        </div>
      ) : isLoading ? (
        <div className="flex min-h-0 flex-1 items-center justify-center">
          <Loader2 size={20} className="animate-spin text-muted-foreground" />
        </div>
      ) : (
        <ChatMessageList
          messages={session.messages}
          sessionId={session.id}
          isLoading={isLoading}
        />
      )}

      <ChatReplyComposer
        status={session.status}
        draft={replyDraft}
        onDraftChange={onReplyDraftChange}
        onSend={onSendReply}
        isSending={isSendingReply}
      />
    </div>
  );
}

export default ChatConversation;
