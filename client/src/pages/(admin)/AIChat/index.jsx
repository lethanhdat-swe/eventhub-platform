import { useCallback, useEffect, useMemo, useState } from 'react';

import { mapApiMessageToWidget } from '@/lib/aiChat/mapChatMessage';
import { sortMessagesChronologically } from '@/lib/aiChat/sortChatMessages';
import { getErrorMessage } from '@/lib/http/apiError';
import { aiChatService } from '@/lib/services/admin/aiChatService';
import ChatConversation from './components/ChatConversation/ChatConversation';
import ChatSidebar from './components/ChatSidebar/ChatSidebar';

const PAGE_SIZE = 20;

function formatRelativeTime(dateValue) {
  if (!dateValue) return '';

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return '';

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 1000 / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes} minutes ago`;
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays < 2) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
  });
}

function formatClockTime(dateValue) {
  if (!dateValue) return '';

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return '';

  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

function mapSessionForUI(session) {
  return {
    id: session.id,
    guestId: session.guestId ?? null,
    user: session.user ?? null,
    updatedAtText: formatRelativeTime(session.updatedAt),
    lastActiveText: `Last active ${formatRelativeTime(session.updatedAt)}`,
    unreadCount: 0,
    messageCount: session.messageCount ?? 0,
    lastMessage: session.lastMessage
      ? {
          id: session.lastMessage.id,
          role: session.lastMessage.role,
          content: session.lastMessage.content,
          createdAtText: formatClockTime(session.lastMessage.createdAt),
        }
      : null,
  };
}

function mapMessageForUI(message) {
  const mapped = mapApiMessageToWidget(message);
  if (!mapped) return null;

  return {
    ...mapped,
    createdAtText: formatClockTime(mapped.createdAt),
  };
}

function AdminAIChatPage() {
  const [sessions, setSessions] = useState([]);
  const [sessionsMeta, setSessionsMeta] = useState({
    totalItems: 0,
    totalPages: 1,
    currentPage: 1,
  });
  const [sessionsLoading, setSessionsLoading] = useState(true);
  const [sessionsError, setSessionsError] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [messagesBySession, setMessagesBySession] = useState({});
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchText.trim());
    }, 300);

    return () => clearTimeout(timer);
  }, [searchText]);

  const loadSessions = useCallback(async () => {
    setSessionsLoading(true);
    setSessionsError(null);

    try {
      const payload = await aiChatService.listSessions({
        page: 1,
        limit: PAGE_SIZE,
        search: debouncedSearch,
      });
      const mappedSessions = (payload.items ?? []).map(mapSessionForUI);

      setSessions(mappedSessions);
      setSessionsMeta({
        totalItems: payload.meta?.totalItems ?? 0,
        totalPages: Math.max(1, payload.meta?.totalPages ?? 1),
        currentPage: payload.meta?.currentPage ?? 1,
      });

      if (
        selectedSessionId &&
        !mappedSessions.some((session) => session.id === selectedSessionId)
      ) {
        setSelectedSessionId(null);
        setMessagesError(null);
      }
    } catch (error) {
      setSessionsError(getErrorMessage(error));
      setSessions([]);
      setSessionsMeta({
        totalItems: 0,
        totalPages: 1,
        currentPage: 1,
      });
    } finally {
      setSessionsLoading(false);
    }
  }, [debouncedSearch, selectedSessionId]);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  const loadMessages = useCallback(async (sessionId) => {
    setMessagesLoading(true);
    setMessagesError(null);

    try {
      const items = await aiChatService.fetchRecentSessionMessages(sessionId, {
        limit: 100,
      });

      const mappedMessages = sortMessagesChronologically(items)
        .map(mapMessageForUI)
        .filter(Boolean);
      setMessagesBySession((prev) => ({
        ...prev,
        [sessionId]: mappedMessages,
      }));
    } catch (error) {
      setMessagesError(getErrorMessage(error));
    } finally {
      setMessagesLoading(false);
    }
  }, []);

  const handleSelectSession = useCallback(
    (sessionId) => {
      setSelectedSessionId(sessionId);
      setMessagesError(null);

      if (messagesBySession[sessionId]) {
        return;
      }

      loadMessages(sessionId);
    },
    [loadMessages, messagesBySession]
  );

  const selectedSession = useMemo(
    () => sessions.find((session) => session.id === selectedSessionId) ?? null,
    [sessions, selectedSessionId]
  );

  const selectedSessionWithMessages = useMemo(
    () =>
      selectedSession
        ? {
            ...selectedSession,
            messages: messagesBySession[selectedSession.id] ?? [],
          }
        : null,
    [messagesBySession, selectedSession]
  );

  return (
    <section className="h-[calc(100vh-120px)] rounded-2xl border bg-card">
      <div className="flex h-full min-h-0">
        <aside className="w-[340px] shrink-0 border-r bg-background/60">
          <ChatSidebar
            sessions={sessions}
            searchText={searchText}
            onSearchChange={setSearchText}
            isLoading={sessionsLoading}
            error={sessionsError}
            onRetry={loadSessions}
            totalItems={sessionsMeta.totalItems}
            selectedSessionId={selectedSessionId}
            onSelectSession={handleSelectSession}
          />
        </aside>

        <div className="min-w-0 flex-1 bg-background">
          <ChatConversation
            session={selectedSessionWithMessages}
            isLoading={messagesLoading}
            error={messagesError}
            onRetry={() => (selectedSessionId ? loadMessages(selectedSessionId) : undefined)}
          />
        </div>
      </div>
    </section>
  );
}

export default AdminAIChatPage;
