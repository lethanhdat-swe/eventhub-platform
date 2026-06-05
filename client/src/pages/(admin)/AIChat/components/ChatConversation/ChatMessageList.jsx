import { useCallback, useEffect, useRef } from 'react';

import ChatMessageBubble from './ChatMessageBubble';

function ChatMessageList({ messages, sessionId, isLoading }) {
  const messagesEndRef = useRef(null);

  const scrollToBottom = useCallback((behavior = 'auto') => {
    requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({ behavior, block: 'end' });
    });
  }, []);

  useEffect(() => {
    if (isLoading || !sessionId) return;
    scrollToBottom('auto');
  }, [messages, sessionId, isLoading, scrollToBottom]);

  return (
    <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
      {messages.length > 0 ? (
        <div className="space-y-4">
          {messages.map((message) => (
            <ChatMessageBubble key={message.id} message={message} />
          ))}
          <div ref={messagesEndRef} aria-hidden />
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
