import { Loader2 } from 'lucide-react';

import { AdminErrorState } from '@/pages/(admin)/components/table';

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
    statusFilter,
    onStatusFilterChange,
    statusFilters = [],
}) {
    return (
        <div className="flex h-full min-h-0 flex-col p-4">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Hội thoại</h2>
            </div>

            <ChatSearch value={searchText} onChange={onSearchChange} />

            {statusFilters.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-1.5">
                    {statusFilters.map((filter) => {
                        const isActive = statusFilter === filter.value;

                        return (
                            <button
                                key={filter.value}
                                type="button"
                                onClick={() =>
                                    onStatusFilterChange(filter.value)
                                }
                                className={`rounded-full border px-2.5 py-1 text-xs! font-medium transition ${
                                    isActive
                                        ? 'border-primary/40 bg-primary/10 text-primary'
                                        : 'border-transparent bg-muted/60 text-muted-foreground hover:bg-muted'
                                }`}
                            >
                                {filter.label}
                            </button>
                        );
                    })}
                </div>
            ) : null}

            <div className="mt-4 min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
                {error ? (
                    <AdminErrorState
                        message={error}
                        onRetry={onRetry}
                        compact
                    />
                ) : isLoading ? (
                    <div className="flex h-full items-center justify-center rounded-xl border border-dashed">
                        <Loader2
                            size={18}
                            className="animate-spin text-muted-foreground"
                        />
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
                            ? 'Không tìm thấy hội thoại phù hợp.'
                            : 'Chưa có hội thoại nào.'}
                    </div>
                )}
            </div>

            <p className="mt-3 text-xs text-muted-foreground">
                Tổng số hội thoại: {totalItems ?? sessions.length}
            </p>
        </div>
    );
}

export default ChatSidebar;
