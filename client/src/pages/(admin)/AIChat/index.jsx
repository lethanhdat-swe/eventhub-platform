import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

import {
    formatClockTime,
    formatRelativeTime,
    getSessionStatusBadge,
    mapRealtimeSessionToListItem,
    mergeSessionIntoList,
} from '@/lib/aiChat/adminChatSession';
import { appendUniqueMessage } from '@/lib/aiChat/chatMessageUtils';
import {
    CHAT_SESSION_STATUS,
    normalizeSessionStatus,
} from '@/lib/aiChat/chatSessionStatus';
import { mapApiMessageToWidget } from '@/lib/aiChat/mapChatMessage';
import { sortMessagesChronologically } from '@/lib/aiChat/sortChatMessages';
import { getErrorMessage } from '@/lib/http/apiError';
import { aiChatService } from '@/lib/services/admin/aiChatService';
import useAdminChatDashboardSocket from '@/hooks/useAdminChatDashboardSocket';
import useChatSessionSocket from '@/hooks/useChatSessionSocket';
import ChatConversation from './components/ChatConversation/ChatConversation';
import ChatSidebar from './components/ChatSidebar/ChatSidebar';

const PAGE_SIZE = 20;

const STATUS_FILTERS = [
    { value: 'all', label: 'Tất cả' },
    { value: CHAT_SESSION_STATUS.WAITING_ADMIN, label: 'Đang chờ' },
    { value: CHAT_SESSION_STATUS.ASSIGNED, label: 'Hỗ trợ viên' },
    { value: CHAT_SESSION_STATUS.ACTIVE, label: 'Trợ lý AI' },
];

function mapSessionForUI(session) {
    const status = normalizeSessionStatus(session.status);

    return {
        id: session.id,
        guestId: session.guestId ?? null,
        user: session.user ?? null,
        status,
        statusBadge: getSessionStatusBadge(status),
        updatedAt: session.updatedAt ?? null,
        updatedAtText: formatRelativeTime(session.updatedAt),
        lastActiveText: `Hoạt động ${formatRelativeTime(session.updatedAt)}`,
        unreadCount: 0,
        messageCount: session.messageCount ?? 0,
        lastMessage: session.lastMessage
            ? {
                  id: session.lastMessage.id,
                  role: session.lastMessage.role,
                  content: session.lastMessage.content,
                  createdAt: session.lastMessage.createdAt,
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

function filterSessionsByStatus(sessions, statusFilter) {
    if (statusFilter === 'all') return sessions;
    return sessions.filter((session) => session.status === statusFilter);
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
    const [statusFilter, setStatusFilter] = useState('all');

    const [selectedSessionId, setSelectedSessionId] = useState(null);
    const [messagesBySession, setMessagesBySession] = useState({});
    const [messagesLoading, setMessagesLoading] = useState(false);
    const [messagesError, setMessagesError] = useState(null);

    const [replyDraft, setReplyDraft] = useState('');
    const [isSendingAdminMessage, setIsSendingAdminMessage] = useState(false);
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchText.trim());
        }, 300);

        return () => clearTimeout(timer);
    }, [searchText]);

    const syncSessionInList = useCallback((sessionId, patch) => {
        setSessions((prev) =>
            prev.map((session) =>
                session.id === sessionId ? { ...session, ...patch } : session
            )
        );
    }, []);

    const appendMessageToSession = useCallback((sessionId, message) => {
        if (!sessionId || !message) return;

        setMessagesBySession((prev) => ({
            ...prev,
            [sessionId]: appendUniqueMessage(prev[sessionId] ?? [], message),
        }));
    }, []);

    const applyStatusUpdateResult = useCallback(
        (sessionId, result) => {
            const nextStatus = normalizeSessionStatus(result?.session?.status);
            const updatedAt = result?.session?.updatedAt ?? null;

            syncSessionInList(sessionId, {
                status: nextStatus,
                statusBadge: getSessionStatusBadge(nextStatus),
                updatedAt,
                updatedAtText: formatRelativeTime(updatedAt),
                lastActiveText: `Hoạt động ${formatRelativeTime(updatedAt)}`,
            });

            if (result?.systemMessage) {
                const mappedSystemMessage = mapMessageForUI(
                    result.systemMessage
                );
                appendMessageToSession(sessionId, mappedSystemMessage);
            }
        },
        [appendMessageToSession, syncSessionInList]
    );

    const loadSessions = useCallback(async () => {
        setSessionsLoading(true);
        setSessionsError(null);

        try {
            const payload = await aiChatService.listSessions({
                page: 1,
                limit: PAGE_SIZE,
                search: debouncedSearch,
                status: statusFilter,
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
                !mappedSessions.some(
                    (session) => session.id === selectedSessionId
                )
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
    }, [debouncedSearch, selectedSessionId, statusFilter]);

    useEffect(() => {
        loadSessions();
    }, [loadSessions]);

    const loadMessages = useCallback(async (sessionId) => {
        setMessagesLoading(true);
        setMessagesError(null);

        try {
            const items = await aiChatService.fetchRecentSessionMessages(
                sessionId,
                {
                    limit: 100,
                }
            );

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
            setReplyDraft('');

            if (messagesBySession[sessionId]) {
                return;
            }

            loadMessages(sessionId);
        },
        [loadMessages, messagesBySession]
    );

    const handleRealtimeSessionUpdated = useCallback(
        (payload) => {
            const updatedItem = mapRealtimeSessionToListItem(payload);

            setSessions((prev) => {
                const merged = mergeSessionIntoList(prev, updatedItem);
                return filterSessionsByStatus(merged, statusFilter);
            });

            if (payload?.id === selectedSessionId) {
                syncSessionInList(payload.id, {
                    status: updatedItem.status,
                    statusBadge: updatedItem.statusBadge,
                    updatedAt: updatedItem.updatedAt,
                    updatedAtText: updatedItem.updatedAtText,
                    lastActiveText: updatedItem.lastActiveText,
                    lastMessage: updatedItem.lastMessage,
                });
            }
        },
        [selectedSessionId, statusFilter, syncSessionInList]
    );

    useAdminChatDashboardSocket({
        enabled: true,
        onSessionUpdated: handleRealtimeSessionUpdated,
        onError: (payload) => {
            toast.error(
                payload?.message ??
                    'Không thể kết nối bảng điều khiển hỗ trợ chat.'
            );
        },
    });

    useChatSessionSocket({
        sessionId: selectedSessionId,
        enabled: Boolean(selectedSessionId),
        onMessageCreated: (payload) => {
            if (payload.sessionId !== selectedSessionId) return;

            const mappedMessage = mapMessageForUI(payload.message);
            appendMessageToSession(selectedSessionId, mappedMessage);

            if (payload.status) {
                const nextStatus = normalizeSessionStatus(payload.status);
                syncSessionInList(selectedSessionId, {
                    status: nextStatus,
                    statusBadge: getSessionStatusBadge(nextStatus),
                    updatedAt: payload.updatedAt ?? null,
                    updatedAtText: formatRelativeTime(payload.updatedAt),
                    lastActiveText: `Hoạt động ${formatRelativeTime(payload.updatedAt)}`,
                });
            }
        },
        onSessionUpdated: (payload) => {
            if (payload.sessionId !== selectedSessionId) return;

            const nextStatus = normalizeSessionStatus(payload.status);
            syncSessionInList(selectedSessionId, {
                status: nextStatus,
                statusBadge: getSessionStatusBadge(nextStatus),
                updatedAt: payload.updatedAt ?? null,
                updatedAtText: formatRelativeTime(payload.updatedAt),
                lastActiveText: `Hoạt động ${formatRelativeTime(payload.updatedAt)}`,
            });
        },
        onError: (payload) => {
            toast.error(payload?.message ?? 'Không thể kết nối phiên chat.');
        },
    });

    const handleUpdateSessionStatus = useCallback(
        async (nextStatus) => {
            if (!selectedSessionId || isUpdatingStatus) return;

            setIsUpdatingStatus(true);

            try {
                const result = await aiChatService.updateSessionStatus(
                    selectedSessionId,
                    { status: nextStatus }
                );

                applyStatusUpdateResult(selectedSessionId, result);
            } catch (error) {
                toast.error(getErrorMessage(error));
            } finally {
                setIsUpdatingStatus(false);
            }
        },
        [applyStatusUpdateResult, isUpdatingStatus, selectedSessionId]
    );

    const handleSendAdminMessage = useCallback(
        async (message) => {
            if (!selectedSessionId || isSendingAdminMessage) return;

            setIsSendingAdminMessage(true);

            try {
                const result = await aiChatService.sendAdminMessage(
                    selectedSessionId,
                    {
                        message,
                    }
                );

                const mappedMessage = mapMessageForUI(result.message);
                appendMessageToSession(selectedSessionId, mappedMessage);
                setReplyDraft('');

                syncSessionInList(selectedSessionId, {
                    status: CHAT_SESSION_STATUS.ASSIGNED,
                    statusBadge: getSessionStatusBadge(
                        CHAT_SESSION_STATUS.ASSIGNED
                    ),
                });
            } catch (error) {
                toast.error(getErrorMessage(error));
            } finally {
                setIsSendingAdminMessage(false);
            }
        },
        [
            appendMessageToSession,
            isSendingAdminMessage,
            selectedSessionId,
            syncSessionInList,
        ]
    );

    const selectedSession = useMemo(
        () =>
            sessions.find((session) => session.id === selectedSessionId) ??
            null,
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
        <section className="h-[calc(100vh-120px)] border bg-card">
            <div className="flex h-full min-h-0 flex-col md:flex-row">
                <aside className="h-[42vh] w-full shrink-0 border-b bg-background/60 md:h-full md:w-80 md:border-b-0 md:border-r lg:w-[340px]">
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
                        statusFilter={statusFilter}
                        onStatusFilterChange={setStatusFilter}
                        statusFilters={STATUS_FILTERS}
                    />
                </aside>

                <div className="min-w-0 flex-1 bg-background">
                    <ChatConversation
                        session={selectedSessionWithMessages}
                        isLoading={messagesLoading}
                        error={messagesError}
                        onRetry={() =>
                            selectedSessionId
                                ? loadMessages(selectedSessionId)
                                : undefined
                        }
                        replyDraft={replyDraft}
                        onReplyDraftChange={setReplyDraft}
                        onSendReply={handleSendAdminMessage}
                        isSendingReply={isSendingAdminMessage}
                        isUpdatingStatus={isUpdatingStatus}
                        onSwitchToHuman={() =>
                            handleUpdateSessionStatus(
                                CHAT_SESSION_STATUS.WAITING_ADMIN
                            )
                        }
                        onBackToAi={() =>
                            handleUpdateSessionStatus(
                                CHAT_SESSION_STATUS.ACTIVE
                            )
                        }
                        onCloseChat={() =>
                            handleUpdateSessionStatus(
                                CHAT_SESSION_STATUS.CLOSED
                            )
                        }
                    />
                </div>
            </div>
        </section>
    );
}

export default AdminAIChatPage;
