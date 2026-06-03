import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    Bot,
    Expand,
    Loader2,
    MessageCircle,
    Minimize2,
    SendHorizontal,
    Sparkles,
    X,
} from 'lucide-react';
import { toast } from 'sonner';

import {
    clearStoredChatSessionId,
    getOrCreateGuestId,
    getStoredChatSessionId,
    setStoredChatSessionId,
} from '@/lib/aiChat/aiChatStorage';
import {
    mapApiMessageToWidget,
    mapApiMessagesToWidget,
    WELCOME_MESSAGE,
    withWelcomeIfEmpty,
} from '@/lib/aiChat/mapChatMessage';
import { getErrorMessage, parseApiError } from '@/lib/http/apiError';
import { aiChatService } from '@/lib/services/aiChat/aiChatService';
import RefundRequestDialog from '@/pages/(public)/EventCheckInPage/components/RefundRequestSection/RefundRequestDialog';
import { useAuthStore } from '@/stores/authStore';

import ChatMessageActions from './ChatMessageActions/ChatMessageActions';

const QUICK_SUGGESTIONS = [
    'Cách đặt vé?',
    'Chính sách hoàn vé',
    'Sự kiện sắp diễn ra',
    'Vé QR ở đâu?',
];

function isSessionAccessError(error) {
    const { status } = parseApiError(error);
    return status === 403 || status === 404;
}

function ChatTypingIndicator() {
    return (
        <div className="flex justify-start">
            <div className="rounded-2xl rounded-bl-sm border border-(--border-color) bg-(--surface-color) px-3 py-2 text-sm text-(--muted-text)">
                <span className="inline-flex items-center gap-2">
                    EventHub AI đang trả lời
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
    const [messages, setMessages] = useState([]);
    const [isSessionLoading, setIsSessionLoading] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [isRefundDialogOpen, setIsRefundDialogOpen] = useState(false);
    const messageContainerRef = useRef(null);
    const prevAuthenticatedRef = useRef(null);
    const bootstrapCancelledRef = useRef(false);

    const showQuickSuggestions = useMemo(() => {
        if (isSessionLoading || isSending) return false;
        return !messages.some((message) => message.role === 'user');
    }, [messages, isSessionLoading, isSending]);

    const canSend =
        Boolean(draft.trim()) &&
        Boolean(sessionId) &&
        !isSending &&
        !isSessionLoading;

    useEffect(() => {
        if (!messageContainerRef.current) return;
        messageContainerRef.current.scrollTop =
            messageContainerRef.current.scrollHeight;
    }, [messages, isOpen, isSending, isSessionLoading]);

    const sessionStorageScope = useMemo(
        () => ({ isAuthenticated, userId }),
        [isAuthenticated, userId]
    );

    const applyLoadedSession = useCallback(
        async (targetSessionId, guestId) => {
            const items = await aiChatService.fetchRecentSessionMessages(
                targetSessionId,
                { guestId }
            );

            if (bootstrapCancelledRef.current) return false;

            setStoredChatSessionId(targetSessionId, sessionStorageScope);
            setSessionId(targetSessionId);
            setMessages(withWelcomeIfEmpty(mapApiMessagesToWidget(items)));
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
                            undefined
                        );
                        if (loaded) return;
                    } catch (error) {
                        if (!isSessionAccessError(error)) {
                            throw error;
                        }
                    }
                }
            }

            const storedSessionId = getStoredChatSessionId(sessionStorageScope);

            if (storedSessionId) {
                try {
                    const loaded = await applyLoadedSession(
                        storedSessionId,
                        guestId
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

            setStoredChatSessionId(session.id, sessionStorageScope);
            setSessionId(session.id);
            setMessages([WELCOME_MESSAGE]);
        } catch (error) {
            if (bootstrapCancelledRef.current) return;
            toast.error(getErrorMessage(error));
            setSessionId(null);
            setMessages([WELCOME_MESSAGE]);
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
            setMessages([]);
        }

        bootstrapCancelledRef.current = false;
        bootstrapSession();

        return () => {
            bootstrapCancelledRef.current = true;
        };
    }, [isOpen, isHydrated, isAuthenticated, userId, bootstrapSession]);

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

                setMessages((prev) => {
                    const withoutTemp = prev.filter(
                        (message) => message.id !== tempUserId
                    );
                    const next = [...withoutTemp];
                    if (userMessage) next.push(userMessage);
                    if (assistantMessage) next.push(assistantMessage);
                    return next;
                });
            } catch (error) {
                setMessages((prev) =>
                    prev.filter((message) => message.id !== tempUserId)
                );

                if (isSessionAccessError(error)) {
                    clearStoredChatSessionId(sessionStorageScope);
                    setSessionId(null);
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
            isSending,
            isSessionLoading,
            isAuthenticated,
            bootstrapSession,
            sessionStorageScope,
        ]
    );

    const handleSend = () => {
        sendMessage(draft);
    };

    return (
        <>
            <div className="pointer-events-none fixed bottom-5 right-4 z-[9999] md:bottom-8 md:right-8">
                <button
                    type="button"
                    aria-label="Mở EventHub AI chat"
                    onClick={() => setIsOpen(true)}
                    className={`pointer-events-auto ml-auto flex h-12 w-12 items-center justify-center rounded-full border border-(--border-color) bg-(--primary-color) text-white shadow-[0_0_24px_var(--primary-color)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_34px_var(--primary-color)] ${
                        isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'
                    }`}
                >
                    <MessageCircle size={20} />
                </button>

                {isOpen && (
                    <div
                        className={`pointer-events-auto mt-3 overflow-hidden border border-(--border-color) bg-(--card-surface-color) text-(--text-primary) shadow-2xl backdrop-blur-md transition-all duration-200 ${
                            isExpanded
                                ? 'fixed inset-4 mt-0 rounded-2xl sm:inset-6 md:inset-10'
                                : 'h-[500px] w-[calc(100vw-2rem)] rounded-2xl sm:w-[360px]'
                        }`}
                    >
                        <header className="flex items-center justify-between border-b border-(--border-color) bg-(--soft-surface-color) px-4 py-3">
                            <div className="flex items-center gap-2.5">
                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-(--primary-color)/20 text-(--primary-color)">
                                    <Bot size={18} />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold">
                                        EventHub AI
                                    </p>
                                    <p className="text-xs text-(--muted-text)">
                                        Trợ lý hỗ trợ sự kiện
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
                                        {messages.map((message) => {
                                            if (message.role === 'system') {
                                                return (
                                                    <div
                                                        key={message.id}
                                                        className="py-1 text-center text-xs text-(--muted-text)"
                                                    >
                                                        {message.content}
                                                    </div>
                                                );
                                            }

                                            const isUser =
                                                message.role === 'user';

                                            return (
                                                <div
                                                    key={message.id}
                                                    className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                                                >
                                                    <div className="max-w-[84%]">
                                                        <div
                                                            className={`rounded-2xl px-3 py-2 ${
                                                                isUser
                                                                    ? 'rounded-br-sm bg-(--primary-color) text-sm leading-relaxed text-white'
                                                                    : 'rounded-bl-sm border border-(--border-color) bg-(--surface-color) text-(--text-primary)'
                                                            }`}
                                                        >
                                                            <p className="text-sm leading-relaxed">
                                                                {
                                                                    message.content
                                                                }
                                                            </p>
                                                            {!isUser &&
                                                            message.actions
                                                                ?.length > 0 ? (
                                                                <ChatMessageActions
                                                                    messageId={
                                                                        message.id
                                                                    }
                                                                    actions={
                                                                        message.actions
                                                                    }
                                                                    onSendMessage={
                                                                        sendMessage
                                                                    }
                                                                    onOpenRefundForm={() =>
                                                                        setIsRefundDialogOpen(
                                                                            true
                                                                        )
                                                                    }
                                                                />
                                                            ) : null}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}

                                        {isSending ? (
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
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={draft}
                                        onChange={(event) =>
                                            setDraft(event.target.value)
                                        }
                                        onKeyDown={(event) => {
                                            if (event.key === 'Enter') {
                                                event.preventDefault();
                                                handleSend();
                                            }
                                        }}
                                        disabled={isSessionLoading || isSending}
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
                                        <SendHorizontal size={16} />
                                    </button>
                                </div>
                                <p className="mt-2 inline-flex items-center gap-1 text-[11px] text-(--muted-text)">
                                    <Sparkles size={12} />
                                    Hỗ trợ tự động bởi EventHub AI
                                </p>
                            </div>
                        </div>
                    </div>
                )}
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
