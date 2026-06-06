import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    Bot,
    Expand,
    Loader2,
    Minimize2,
    SendHorizontal,
    Sparkles,
    X,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { toast } from 'sonner';

import {
    clearStoredChatSessionId,
    getOrCreateGuestId,
    getStoredChatSession,
    setStoredChatSession,
} from '@/lib/aiChat/aiChatStorage';
import { appendUniqueMessage } from '@/lib/aiChat/chatMessageUtils';
import {
    CHAT_SESSION_STATUS,
    deriveStatusFromMessages,
    getChatFooterText,
    getChatHeaderConfig,
    isClosedStatus,
    isHumanSupportStatus,
    normalizeSessionStatus,
    resolveStatusAfterSend,
} from '@/lib/aiChat/chatSessionStatus';
import {
    mapApiMessageToWidget,
    mapApiMessagesToWidget,
    withWelcomeIfEmpty,
} from '@/lib/aiChat/mapChatMessage';
import { getErrorMessage, parseApiError } from '@/lib/http/apiError';
import { aiChatService } from '@/lib/services/aiChat/aiChatService';
import useChatSessionSocket from '@/hooks/useChatSessionSocket';
import RefundRequestDialog from '@/pages/(public)/EventCheckInPage/components/RefundRequestSection/RefundRequestDialog';
import { useAuthStore } from '@/stores/authStore';

import ChatMessageBubble from './ChatMessageBubble';
import ChatStatusNotice from './ChatStatusNotice';

const QUICK_SUGGESTIONS = [
    'Cách đặt vé?',
    'Chính sách hoàn vé',
    'Sự kiện sắp diễn ra',
    'Vé QR ở đâu?',
];

const CHAT_PANEL_TRANSITION = {
    duration: 0.32,
    ease: [0.16, 1, 0.3, 1],
};

const FAB_TRANSITION = {
    duration: 0.25,
    ease: [0.16, 1, 0.3, 1],
};

const FAB_PROMPT_MESSAGES = [
    'Trợ lý AI có thể giúp bạn đặt vé',
    'Cần hỗ trợ về vé hoặc thanh toán?',
    'Tôi có thể hỗ trợ hoàn vé',
    'Trò chuyện với Beetic AI',
];

const FAB_BUBBLE_TRANSITION = {
    duration: 0.28,
    ease: [0.16, 1, 0.3, 1],
};

const FAB_PROMPT_DELAY_MS = 2500;
const FAB_PROMPT_VISIBLE_MS = 4500;
const FAB_PROMPT_SEEN_KEY = 'eventhub:ai-chat-fab-prompt-seen';

function pickRandomPromptMessage(currentMessage) {
    const pool = FAB_PROMPT_MESSAGES.filter(
        (message) => message !== currentMessage
    );
    return pool[Math.floor(Math.random() * pool.length)] ?? FAB_PROMPT_MESSAGES[0];
}

function AIChatFab({ isOpen, onOpen }) {
    const [isHovered, setIsHovered] = useState(false);
    const [bubbleVisible, setBubbleVisible] = useState(false);
    const [promptMessage, setPromptMessage] = useState(FAB_PROMPT_MESSAGES[0]);
    const isOpenRef = useRef(isOpen);
    const isHoveredRef = useRef(isHovered);
    const autoPromptTimersRef = useRef([]);

    const clearAutoPromptTimers = useCallback(() => {
        autoPromptTimersRef.current.forEach((timerId) => {
            window.clearTimeout(timerId);
        });
        autoPromptTimersRef.current = [];
    }, []);

    useEffect(() => {
        isOpenRef.current = isOpen;
        isHoveredRef.current = isHovered;
    }, [isOpen, isHovered]);

    useEffect(() => {
        if (sessionStorage.getItem(FAB_PROMPT_SEEN_KEY) === '1') {
            return undefined;
        }

        const showTimerId = window.setTimeout(() => {
            if (isOpenRef.current || isHoveredRef.current) {
                return;
            }

            setPromptMessage((current) => pickRandomPromptMessage(current));
            setBubbleVisible(true);
            sessionStorage.setItem(FAB_PROMPT_SEEN_KEY, '1');

            const hideTimerId = window.setTimeout(() => {
                if (!isHoveredRef.current && !isOpenRef.current) {
                    setBubbleVisible(false);
                }
            }, FAB_PROMPT_VISIBLE_MS);

            autoPromptTimersRef.current.push(hideTimerId);
        }, FAB_PROMPT_DELAY_MS);

        autoPromptTimersRef.current.push(showTimerId);

        return clearAutoPromptTimers;
    }, [clearAutoPromptTimers]);

    useEffect(() => {
        if (isOpen) {
            setBubbleVisible(false);
            return;
        }

        if (isHovered) {
            setBubbleVisible(true);
            return;
        }

        setBubbleVisible(false);
    }, [isOpen, isHovered]);

    const showBubble = !isOpen && bubbleVisible;

    return (
        <div
            className="relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <AnimatePresence>
                {showBubble && (
                    <motion.div
                        key="ai-chat-fab-prompt"
                        role="status"
                        aria-live="polite"
                        initial={{ opacity: 0, x: 10, y: 6 }}
                        animate={{ opacity: 1, x: 0, y: 0 }}
                        exit={{ opacity: 0, x: 10, y: 6 }}
                        transition={FAB_BUBBLE_TRANSITION}
                        className="pointer-events-none absolute bottom-full right-0 z-10 mb-2 hidden min-w-[180px] max-w-[220px] rounded-xl border border-(--primary-color)/30 bg-(--card-surface-color)/80 px-3 py-2 text-left text-xs text-(--text-primary) shadow-[0_8px_28px_rgba(0,0,0,0.38),0_0_18px_rgba(124,58,237,0.18)] backdrop-blur-md sm:block sm:min-w-[220px] sm:max-w-[280px]"
                    >
                        <div className="flex items-start gap-2">
                            <Sparkles
                                size={12}
                                className="mt-0.5 shrink-0 text-(--primary-color)/75"
                            />
                            <span className="min-w-0 flex-1 whitespace-normal leading-snug">
                                {promptMessage}
                            </span>
                        </div>
                        <span className="absolute -bottom-1.5 right-5 h-2.5 w-2.5 rotate-45 border-r border-b border-(--primary-color)/30 bg-(--card-surface-color)/80" />
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                type="button"
                aria-label="Mở trợ lý Beetic"
                onClick={onOpen}
                animate={{
                    scale: isOpen ? 0.5 : 1,
                    opacity: isOpen ? 0 : 1,
                }}
                transition={FAB_TRANSITION}
                whileHover={
                    isOpen
                        ? undefined
                        : {
                              y: -2,
                              boxShadow: '0 0 34px var(--primary-color)',
                          }
                }
                whileTap={isOpen ? undefined : { scale: 0.92 }}
                style={{ pointerEvents: isOpen ? 'none' : 'auto' }}
                className="pointer-events-auto relative ml-auto flex h-12 w-12 items-center justify-center rounded-full border border-(--border-color) bg-(--primary-color) text-white shadow-[0_0_24px_var(--primary-color)]"
            >
                <Bot size={20} strokeWidth={2.25} />
            </motion.button>
        </div>
    );
}

function isSessionAccessError(error) {
    const { status } = parseApiError(error);
    return status === 403 || status === 404;
}

function isClosedSessionError(error) {
    const { status } = parseApiError(error);
    return status === 409;
}

function ChatTypingIndicator() {
    return (
        <div className="flex justify-start">
            <div className="rounded-2xl rounded-bl-sm border border-(--border-color) bg-(--surface-color) px-3 py-2 text-sm text-(--muted-text)">
                <span className="inline-flex items-center gap-2">
                    Trợ lý Beetic đang trả lời
                    <span className="inline-flex gap-0.5">
                        <span className="h-1 w-1 animate-bounce rounded-full bg-(--muted-text) [animation-delay:0ms]" />
                        <span className="h-1 w-1 animate-bounce rounded-full bg-(--muted-text) [animation-delay:150ms]" />
                        <span className="h-1 w-1 animate-bounce rounded-full bg-(--muted-text) [animation-delay:300ms]" />
                    </span>
                </span>
            </div>
        </div>
    );
}

function AIChatWidget() {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const isHydrated = useAuthStore((state) => state.isHydrated);
    const userId = useAuthStore((state) => state.user?.id);

    const [isOpen, setIsOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [draft, setDraft] = useState('');
    const [sessionId, setSessionId] = useState(null);
    const [sessionStatus, setSessionStatus] = useState(CHAT_SESSION_STATUS.ACTIVE);
    const [messages, setMessages] = useState([]);
    const [isSessionLoading, setIsSessionLoading] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [isRefundDialogOpen, setIsRefundDialogOpen] = useState(false);
    const messageContainerRef = useRef(null);
    const prevAuthenticatedRef = useRef(null);
    const bootstrapCancelledRef = useRef(false);

    const headerConfig = useMemo(
        () => getChatHeaderConfig(sessionStatus),
        [sessionStatus]
    );

    const footerText = useMemo(
        () => getChatFooterText(sessionStatus),
        [sessionStatus]
    );

    const showQuickSuggestions = useMemo(() => {
        if (isSessionLoading || isSending) return false;
        if (sessionStatus !== CHAT_SESSION_STATUS.ACTIVE) return false;
        return !messages.some((message) => message.role === 'user');
    }, [messages, isSessionLoading, isSending, sessionStatus]);

    const showAiTypingIndicator =
        isSending && sessionStatus === CHAT_SESSION_STATUS.ACTIVE;

    const isClosed = isClosedStatus(sessionStatus);

    const canSend =
        Boolean(draft.trim()) &&
        Boolean(sessionId) &&
        !isSending &&
        !isSessionLoading &&
        !isClosed;

    useEffect(() => {
        if (!messageContainerRef.current || isSessionLoading) return;

        const container = messageContainerRef.current;
        requestAnimationFrame(() => {
            container.scrollTop = container.scrollHeight;
        });
    }, [messages, isOpen, isSending, isSessionLoading, sessionStatus]);

    const sessionStorageScope = useMemo(
        () => ({ isAuthenticated, userId }),
        [isAuthenticated, userId]
    );

    const updateSessionStatus = useCallback(
        (status, { persist = false, targetSessionId = sessionId } = {}) => {
            const normalizedStatus = normalizeSessionStatus(status);
            setSessionStatus(normalizedStatus);

            if (persist && targetSessionId) {
                setStoredChatSession(
                    {
                        sessionId: targetSessionId,
                        status: normalizedStatus,
                    },
                    sessionStorageScope
                );
            }
        },
        [sessionId, sessionStorageScope]
    );

    const applyLoadedSession = useCallback(
        async (targetSessionId, guestId, initialStatus) => {
            const items = await aiChatService.fetchRecentSessionMessages(
                targetSessionId,
                { guestId }
            );

            if (bootstrapCancelledRef.current) return false;

            const mappedMessages = mapApiMessagesToWidget(items);
            const derivedStatus = deriveStatusFromMessages(mappedMessages);
            const resolvedStatus = normalizeSessionStatus(
                initialStatus ?? derivedStatus ?? CHAT_SESSION_STATUS.ACTIVE
            );

            setStoredChatSession(
                {
                    sessionId: targetSessionId,
                    status: resolvedStatus,
                },
                sessionStorageScope
            );
            setSessionId(targetSessionId);
            setSessionStatus(resolvedStatus);
            setMessages(withWelcomeIfEmpty(mappedMessages, resolvedStatus));
            return true;
        },
        [sessionStorageScope]
    );

    const bootstrapSession = useCallback(async () => {
        setIsSessionLoading(true);

        try {
            const guestId = isAuthenticated ? undefined : getOrCreateGuestId();

            if (isAuthenticated) {
                const latestSession = await aiChatService.getLatestMySession();
                if (latestSession?.id) {
                    try {
                        const loaded = await applyLoadedSession(
                            latestSession.id,
                            undefined,
                            latestSession.status
                        );
                        if (loaded) return;
                    } catch (error) {
                        if (!isSessionAccessError(error)) {
                            throw error;
                        }
                    }
                }
            }

            const storedSession = getStoredChatSession(sessionStorageScope);

            if (storedSession?.sessionId) {
                try {
                    const loaded = await applyLoadedSession(
                        storedSession.sessionId,
                        guestId,
                        storedSession.status
                    );
                    if (loaded) return;
                } catch (error) {
                    if (!isSessionAccessError(error)) {
                        throw error;
                    }
                    clearStoredChatSessionId(sessionStorageScope);
                }
            }

            const sessionBody = isAuthenticated
                ? {}
                : { guestId: getOrCreateGuestId() };
            const session = await aiChatService.createSession(sessionBody);

            if (bootstrapCancelledRef.current) return;

            const newStatus = normalizeSessionStatus(session.status);

            setStoredChatSession(
                {
                    sessionId: session.id,
                    status: newStatus,
                },
                sessionStorageScope
            );
            setSessionId(session.id);
            setSessionStatus(newStatus);
            setMessages(withWelcomeIfEmpty([], newStatus));
        } catch (error) {
            if (bootstrapCancelledRef.current) return;
            toast.error(getErrorMessage(error));
            setSessionId(null);
            setSessionStatus(CHAT_SESSION_STATUS.ACTIVE);
            setMessages(withWelcomeIfEmpty([], CHAT_SESSION_STATUS.ACTIVE));
        } finally {
            if (!bootstrapCancelledRef.current) {
                setIsSessionLoading(false);
            }
        }
    }, [isAuthenticated, sessionStorageScope, applyLoadedSession]);

    useEffect(() => {
        if (!isOpen || !isHydrated) return undefined;
        if (isAuthenticated && !userId) return undefined;

        const authChanged =
            prevAuthenticatedRef.current !== null &&
            prevAuthenticatedRef.current !== isAuthenticated;
        prevAuthenticatedRef.current = isAuthenticated;

        if (authChanged) {
            setSessionId(null);
            setSessionStatus(CHAT_SESSION_STATUS.ACTIVE);
            setMessages([]);
        }

        bootstrapCancelledRef.current = false;
        bootstrapSession();

        return () => {
            bootstrapCancelledRef.current = true;
        };
    }, [isOpen, isHydrated, isAuthenticated, userId, bootstrapSession]);

    useChatSessionSocket({
        sessionId,
        guestId: isAuthenticated ? undefined : getOrCreateGuestId(),
        enabled: isOpen && Boolean(sessionId),
        onMessageCreated: (payload) => {
            const incomingMessage = mapApiMessageToWidget(payload.message);
            if (!incomingMessage) return;

            if (payload.status) {
                updateSessionStatus(payload.status, { persist: true });
            }

            setMessages((prev) => appendUniqueMessage(prev, incomingMessage));
        },
        onSessionUpdated: (payload) => {
            if (payload?.status) {
                updateSessionStatus(payload.status, { persist: true });
            }
        },
        onError: (payload) => {
            const message =
                payload?.message ?? 'Không thể kết nối realtime chat.';
            toast.error(message);
        },
    });

    const sendMessage = useCallback(
        async (text) => {
            const trimmed = text.trim();
            if (!trimmed || !sessionId || isSending || isSessionLoading) return;

            const tempUserId = `temp-${Date.now()}`;
            const guestId = isAuthenticated ? undefined : getOrCreateGuestId();

            setMessages((prev) => [
                ...prev,
                {
                    id: tempUserId,
                    role: 'user',
                    content: trimmed,
                    actions: [],
                },
            ]);
            setDraft('');
            setIsSending(true);

            try {
                const result = await aiChatService.sendMessage(sessionId, {
                    message: trimmed,
                    guestId,
                });

                const userMessage = mapApiMessageToWidget(result.userMessage);
                const assistantMessage = mapApiMessageToWidget(
                    result.assistantMessage
                );

                const nextStatus = resolveStatusAfterSend({
                    currentStatus: sessionStatus,
                    result,
                });

                updateSessionStatus(nextStatus, { persist: true });

                setMessages((prev) => {
                    const withoutTemp = prev.filter(
                        (message) => message.id !== tempUserId
                    );
                    let next = withoutTemp;
                    if (userMessage) {
                        next = appendUniqueMessage(next, userMessage);
                    }
                    if (assistantMessage) {
                        next = appendUniqueMessage(next, assistantMessage);
                    }
                    return next;
                });

                if (isAuthenticated && isHumanSupportStatus(nextStatus)) {
                    const latestSession =
                        await aiChatService.getLatestMySession();

                    if (latestSession?.status) {
                        updateSessionStatus(latestSession.status, {
                            persist: true,
                            targetSessionId: sessionId,
                        });
                    }
                }
            } catch (error) {
                setMessages((prev) =>
                    prev.filter((message) => message.id !== tempUserId)
                );

                if (
                    isSessionAccessError(error) ||
                    isClosedSessionError(error)
                ) {
                    clearStoredChatSessionId(sessionStorageScope);
                    setSessionId(null);
                    setSessionStatus(CHAT_SESSION_STATUS.ACTIVE);
                    toast.info('Đã làm mới cuộc trò chuyện.');
                    await bootstrapSession();
                    return;
                }

                toast.error(getErrorMessage(error));
            } finally {
                setIsSending(false);
            }
        },
        [
            sessionId,
            sessionStatus,
            isSending,
            isSessionLoading,
            isAuthenticated,
            bootstrapSession,
            sessionStorageScope,
            updateSessionStatus,
        ]
    );

    const handleSend = () => {
        sendMessage(draft);
    };

    return (
        <>
            <div className="pointer-events-none flex flex-col items-end">
                <AIChatFab isOpen={isOpen} onOpen={() => setIsOpen(true)} />

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            key="ai-chat-panel"
                            initial={{ opacity: 0, y: 28, scale: 0.88 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 20, scale: 0.92 }}
                            transition={CHAT_PANEL_TRANSITION}
                            layout
                            style={{ transformOrigin: 'bottom right' }}
                            className={`pointer-events-auto mt-3 overflow-hidden border border-(--border-color) bg-(--card-surface-color) text-(--text-primary) shadow-2xl backdrop-blur-md ${
                                isExpanded
                                    ? 'fixed inset-4 mt-0 rounded-2xl sm:inset-6 md:inset-10'
                                    : 'h-[580px] w-[calc(100vw-2rem)] rounded-2xl sm:w-[420px]'
                            }`}
                        >
                            <header className="flex items-center justify-between border-b border-(--border-color) bg-(--soft-surface-color) px-4 py-3">
                                <div className="flex items-center gap-2.5">
                                    <div
                                        className={`flex h-9 w-9 items-center justify-center rounded-full ${
                                            headerConfig.isHumanMode
                                                ? 'bg-emerald-500/20 text-emerald-400'
                                                : 'bg-(--primary-color)/20 text-(--primary-color)'
                                        }`}
                                    >
                                        <Bot size={18} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold">
                                            {headerConfig.title}
                                        </p>
                                        <p className="text-xs text-(--muted-text)">
                                            {headerConfig.subtitle}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-1">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setIsExpanded((prev) => !prev)
                                        }
                                        aria-label={
                                            isExpanded
                                                ? 'Thu gọn chat'
                                                : 'Mở rộng chat'
                                        }
                                        className="rounded-lg p-2 text-(--muted-text) transition hover:bg-(--soft-surface-color) hover:text-(--text-primary)"
                                    >
                                        {isExpanded ? (
                                            <Minimize2 size={16} />
                                        ) : (
                                            <Expand size={16} />
                                        )}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsOpen(false);
                                            setIsExpanded(false);
                                        }}
                                        aria-label="Đóng chat"
                                        className="rounded-lg p-2 text-(--muted-text) transition hover:bg-(--soft-surface-color) hover:text-(--text-primary)"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            </header>

                            <div className="flex h-[calc(100%-64px)] flex-col">
                                <div
                                    ref={messageContainerRef}
                                    className="flex-1 overscroll-contain space-y-3 overflow-y-auto px-3 py-4"
                                >
                                    {isSessionLoading ? (
                                        <div className="flex h-full min-h-[200px] items-center justify-center">
                                            <Loader2
                                                size={24}
                                                className="animate-spin text-(--primary-color)"
                                                aria-label="Đang tải cuộc trò chuyện"
                                            />
                                        </div>
                                    ) : (
                                        <>
                                            <ChatStatusNotice
                                                status={sessionStatus}
                                                messages={messages}
                                            />

                                            {messages.map((message) => (
                                                <ChatMessageBubble
                                                    key={message.id}
                                                    message={message}
                                                    onSendMessage={sendMessage}
                                                    onOpenRefundForm={() =>
                                                        setIsRefundDialogOpen(
                                                            true
                                                        )
                                                    }
                                                />
                                            ))}

                                            {showAiTypingIndicator ? (
                                                <ChatTypingIndicator />
                                            ) : null}

                                            {showQuickSuggestions ? (
                                                <div className="flex flex-wrap gap-2 pt-1">
                                                    {QUICK_SUGGESTIONS.map(
                                                        (suggestion) => (
                                                            <button
                                                                key={suggestion}
                                                                type="button"
                                                                onClick={() =>
                                                                    sendMessage(
                                                                        suggestion
                                                                    )
                                                                }
                                                                disabled={
                                                                    !sessionId ||
                                                                    isSending
                                                                }
                                                                className="rounded-full border border-(--border-color) bg-(--soft-surface-color) px-3 py-1.5 text-xs text-(--text-primary) transition hover:border-(--primary-color)/40 hover:bg-(--primary-color)/15 disabled:cursor-not-allowed disabled:opacity-50"
                                                            >
                                                                {suggestion}
                                                            </button>
                                                        )
                                                    )}
                                                </div>
                                            ) : null}
                                        </>
                                    )}
                                </div>

                                <div className="border-t border-(--border-color) bg-(--soft-surface-color) p-3">
                                    {isClosed ? (
                                        <p className="rounded-xl border border-(--border-color) bg-(--surface-color) px-3 py-2.5 text-center text-sm text-(--muted-text)">
                                            {footerText}
                                        </p>
                                    ) : (
                                        <>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="text"
                                                    value={draft}
                                                    onChange={(event) =>
                                                        setDraft(
                                                            event.target.value
                                                        )
                                                    }
                                                    onKeyDown={(event) => {
                                                        if (
                                                            event.key === 'Enter'
                                                        ) {
                                                            event.preventDefault();
                                                            handleSend();
                                                        }
                                                    }}
                                                    disabled={
                                                        isSessionLoading ||
                                                        isSending
                                                    }
                                                    placeholder="Nhập câu hỏi của bạn..."
                                                    className="h-10 flex-1 rounded-xl border border-(--border-color) bg-(--surface-color) px-3 text-sm outline-none transition focus:border-(--primary-color) focus:ring-2 focus:ring-(--primary-color)/30 disabled:cursor-not-allowed disabled:opacity-60"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={handleSend}
                                                    disabled={!canSend}
                                                    aria-label="Gửi tin nhắn"
                                                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-(--primary-color) text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
                                                >
                                                    {isSending ? (
                                                        <Loader2
                                                            size={16}
                                                            className="animate-spin"
                                                        />
                                                    ) : (
                                                        <SendHorizontal
                                                            size={16}
                                                        />
                                                    )}
                                                </button>
                                            </div>
                                            <p className="mt-2 inline-flex items-center gap-1 text-[11px] text-(--muted-text)">
                                                {sessionStatus ===
                                                CHAT_SESSION_STATUS.ACTIVE ? (
                                                    <Sparkles size={12} />
                                                ) : null}
                                                {footerText}
                                            </p>
                                        </>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <RefundRequestDialog
                open={isRefundDialogOpen}
                onOpenChange={setIsRefundDialogOpen}
                order={null}
                expectedRefundPercent={null}
            />
        </>
    );
}

export default AIChatWidget;
