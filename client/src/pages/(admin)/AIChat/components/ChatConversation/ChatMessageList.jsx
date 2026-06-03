import ChatMessageBubble from './ChatMessageBubble';

function ChatMessageList({ messages }) {
  return (
    <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
      {messages.length > 0 ? (
        <div className="space-y-4">
          {messages.map((message) => (
            <ChatMessageBubble key={message.id} message={message} />
          ))}
        </div>
      ) : (
        <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
          No messages in this conversation yet.
        </div>
      )}
    </div>
  );
}

export default ChatMessageList;
