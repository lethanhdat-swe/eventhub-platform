import { Loader2 } from 'lucide-react';

import {
    canAdminSwitchToAi,
    canAdminSwitchToHuman,
} from '@/lib/aiChat/adminChatSession';
import {
    CHAT_SESSION_STATUS,
    normalizeSessionStatus,
} from '@/lib/aiChat/chatSessionStatus';
import { resolvePublicAssetUrl } from '@/lib/url/resolvePublicAssetUrl';

function getInitials(name) {
    if (!name) return 'G';
    const words = name.trim().split(/\s+/).slice(0, 2);
    return words.map((word) => word[0]?.toUpperCase() ?? '').join('');
}

function getDisplayName(session) {
    if (session.user?.fullName) return session.user.fullName;
    const shortGuestId = session.guestId?.slice(0, 8) ?? 'không rõ';
    return `Khách ${shortGuestId}`;
}

function ChatConversationHeader({
    session,
    isUpdatingStatus,
    onSwitchToHuman,
    onBackToAi,
}) {
    const displayName = getDisplayName(session);
    const identityText =
        session.user?.email ?? session.guestId ?? 'Khách truy cập';
    const status = normalizeSessionStatus(session.status);
    const statusBadge = session.statusBadge;
    const isClosed = status === CHAT_SESSION_STATUS.CLOSED;

    return (
        <header className="flex flex-col gap-3 border-b px-4 py-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <div className="flex min-w-0 items-center gap-3">
                {session.user?.avatarUrl ? (
                    <img
                        src={resolvePublicAssetUrl(session.user.avatarUrl)}
                        alt={displayName}
                        className="h-11 w-11 rounded-full border object-cover"
                    />
                ) : (
                    <div className="flex h-11 w-11 items-center justify-center rounded-full border bg-muted text-sm font-semibold">
                        {getInitials(displayName)}
                    </div>
                )}

                <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate text-sm font-semibold">
                            {displayName}
                        </p>
                        {statusBadge ? (
                            <span
                                className={`inline-flex rounded-full border px-2 py-0.5 text-[11px] font-medium ${statusBadge.className}`}
                            >
                                {statusBadge.label}
                            </span>
                        ) : null}
                    </div>
                    <p className="truncate text-xs text-muted-foreground">
                        {identityText}
                    </p>
                </div>
            </div>

            <div className="flex w-full shrink-0 flex-wrap items-center gap-2 sm:w-auto sm:justify-end">
                {!isClosed ? (
                    <div className="flex flex-wrap justify-end gap-2">
                        {canAdminSwitchToHuman(status) ? (
                            <button
                                type="button"
                                onClick={onSwitchToHuman}
                                disabled={isUpdatingStatus}
                                className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-2.5 py-1 text-xs! font-medium text-amber-700 transition hover:bg-amber-500/20 disabled:cursor-not-allowed disabled:opacity-60 dark:text-amber-300"
                            >
                                {isUpdatingStatus ? (
                                    <Loader2
                                        size={12}
                                        className="inline animate-spin"
                                    />
                                ) : (
                                    'Chuyển sang hỗ trợ viên'
                                )}
                            </button>
                        ) : null}

                        {canAdminSwitchToAi(status) ? (
                            <button
                                type="button"
                                onClick={onBackToAi}
                                disabled={isUpdatingStatus}
                                className="rounded-lg border px-2.5 py-1 text-xs! font-medium transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                Trả lại cho AI
                            </button>
                        ) : null}
                    </div>
                ) : null}
                <p className="text-xs text-muted-foreground">
                    {session.lastActiveText ?? session.updatedAtText}
                </p>
            </div>
        </header>
    );
}

export default ChatConversationHeader;
