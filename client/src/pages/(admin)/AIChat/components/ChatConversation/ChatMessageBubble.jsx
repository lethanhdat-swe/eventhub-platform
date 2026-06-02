function ChatMessageBubble({ message }) {
  if (message.role === 'SYSTEM') {
    return (
      <div className="py-2 text-center text-xs text-muted-foreground">
        <p>{message.content}</p>
        <p className="mt-1">{message.createdAtText}</p>
      </div>
    );
  }

  const isAssistant = message.role === 'ASSISTANT';

  return (
    <div className={`flex ${isAssistant ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[78%] ${isAssistant ? 'items-end' : 'items-start'} flex flex-col`}>
        <div
          className={`rounded-2xl px-4 py-2.5 text-sm leading-6 ${
            isAssistant
              ? 'bg-primary/10 text-foreground'
              : 'border bg-card text-foreground'
          }`}
        >
          {message.content}
        </div>

        <span className="mt-1 text-[11px] text-muted-foreground">{message.createdAtText}</span>

        {isAssistant && Array.isArray(message.actions) && message.actions.length > 0 && (
          <div className="mt-2 flex flex-wrap justify-end gap-2">
            {message.actions.map((action, index) => (
              <button
                key={`${action.type}-${index}`}
                type="button"
                className="rounded-full border bg-background px-3 py-1 text-xs text-muted-foreground transition hover:bg-muted"
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatMessageBubble;
