import AdminChatMessageActions from './AdminChatMessageActions';

function ChatMessageBubble({ message }) {
  if (message.role === 'system') {
    return (
      <div className="py-2 text-center text-xs text-muted-foreground">
        <p>{message.content}</p>
        {message.createdAtText ? (
          <p className="mt-1">{message.createdAtText}</p>
        ) : null}
      </div>
    );
  }

  const isUser = message.role === 'user';
  const isAssistant = message.role === 'assistant';

  return (
    <div className={`flex ${isUser ? 'justify-start' : 'justify-end'}`}>
      <div
        className={`flex max-w-[78%] flex-col ${isUser ? 'items-start' : 'items-end'}`}
      >
        <div
          className={`rounded-2xl px-4 py-2.5 text-sm leading-6 ${
            isUser
              ? 'rounded-bl-sm border bg-card text-foreground'
              : isAssistant
                ? 'rounded-br-sm bg-primary/10 text-foreground'
                : 'border bg-muted/40 text-foreground'
          }`}
        >
          {message.content}
          {isAssistant && message.actions?.length > 0 ? (
            <AdminChatMessageActions
              messageId={message.id}
              actions={message.actions}
            />
          ) : null}
        </div>

        {message.createdAtText ? (
          <span className="mt-1 text-[11px] text-muted-foreground">
            {message.createdAtText}
          </span>
        ) : null}
      </div>
    </div>
  );
}

export default ChatMessageBubble;
