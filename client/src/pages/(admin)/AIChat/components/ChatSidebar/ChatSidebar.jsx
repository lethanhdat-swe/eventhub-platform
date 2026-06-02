import { Loader2, Plus } from 'lucide-react';

import ChatSearch from './ChatSearch';
import ChatSessionItem from './ChatSessionItem';

function ChatSidebar({
  sessions,
  selectedSessionId,
  onSelectSession,
  searchText,
  onSearchChange,
  isLoading,
  error,
  onRetry,
  totalItems,
}) {
  return (
    <div className="flex h-full min-h-0 flex-col p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Chats</h2>
        <button
          type="button"
          aria-label="Create chat"
          className="inline-flex h-8 w-8 items-center justify-center rounded-full border bg-background text-muted-foreground transition hover:bg-muted"
        >
          <Plus size={16} />
        </button>
      </div>

      <ChatSearch value={searchText} onChange={onSearchChange} />

      <div className="mt-4 min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
        {error ? (
          <div className="space-y-2 rounded-xl border border-destructive/25 bg-destructive/5 p-4 text-sm text-destructive">
            <p>{error}</p>
            <button
              type="button"
              onClick={() => onRetry()}
              className="rounded-lg border border-destructive/30 bg-background px-2.5 py-1 text-xs font-medium text-destructive transition hover:bg-destructive/10"
            >
              Retry
            </button>
          </div>
        ) : isLoading ? (
          <div className="flex h-full items-center justify-center rounded-xl border border-dashed">
            <Loader2 size={18} className="animate-spin text-muted-foreground" />
          </div>
        ) : sessions.length > 0 ? (
          sessions.map((session) => (
            <ChatSessionItem
              key={session.id}
              session={session}
              isSelected={selectedSessionId === session.id}
              onSelect={onSelectSession}
            />
          ))
        ) : (
          <div className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
            {searchText
              ? 'No chat sessions found for this search.'
              : 'No chat sessions available yet.'}
          </div>
        )}
      </div>

      <p className="mt-3 text-xs text-muted-foreground">Total chats: {totalItems ?? sessions.length}</p>
    </div>
  );
}

export default ChatSidebar;
