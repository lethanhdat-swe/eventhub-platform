import ChatMessageActions from './ChatMessageActions/ChatMessageActions';

function ChatMessageBubble({
  message,
  onSendMessage,
  onOpenRefundForm,
}) {
  if (message.role === 'system') {
    return (
      <div className="py-1 text-center text-xs text-(--muted-text)">
        {message.content}
      </div>
    );
  }

  const isUser = message.role === 'user';
  const isAdmin = message.role === 'admin';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className="max-w-[84%]">
        {isAdmin ? (
          <p className="mb-1 text-[11px] font-medium text-emerald-400/90">
            Admin Beetic
          </p>
        ) : null}

        <div
          className={`rounded-2xl px-3 py-2 ${
            isUser
              ? 'rounded-br-sm bg-(--primary-color) text-sm leading-relaxed text-white'
              : isAdmin
                ? 'rounded-bl-sm border border-emerald-500/30 bg-emerald-500/10 text-(--text-primary)'
                : 'rounded-bl-sm border border-(--border-color) bg-(--surface-color) text-(--text-primary)'
          }`}
        >
          <p className="text-sm leading-relaxed">{message.content}</p>

          {!isUser && !isAdmin && message.actions?.length > 0 ? (
            <ChatMessageActions
              messageId={message.id}
              actions={message.actions}
              onSendMessage={onSendMessage}
              onOpenRefundForm={onOpenRefundForm}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default ChatMessageBubble;
