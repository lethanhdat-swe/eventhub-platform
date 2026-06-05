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

function ChatSessionItem({ session, isSelected, onSelect }) {
    const displayName = getDisplayName(session);
    const subtitle = session.lastMessage?.content ?? 'Chưa có tin nhắn';
    const avatarText = getInitials(displayName);
    const statusBadge = session.statusBadge;
    const isWaiting = statusBadge?.isWaiting;

    return (
        <button
            type="button"
            onClick={() => onSelect(session.id)}
            className={`w-full rounded-xl border px-3 py-2 text-left transition ${
                isSelected
                    ? 'border-primary/30 bg-primary/5'
                    : isWaiting
                      ? 'border-amber-500/40 bg-amber-500/5 hover:border-amber-500/50'
                      : 'border-transparent hover:border-border hover:bg-muted/50'
            }`}
        >
            <div className="flex items-start gap-3">
                {session.user?.avatarUrl ? (
                    <img
                        src={resolvePublicAssetUrl(session.user.avatarUrl)}
                        alt={displayName}
                        className="h-10 w-10 rounded-full border object-cover"
                    />
                ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border bg-muted text-xs font-semibold">
                        {avatarText}
                    </div>
                )}

                <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                                <p className="truncate text-sm font-semibold">
                                    {displayName}
                                </p>
                                {statusBadge ? (
                                    <span
                                        className={`inline-flex shrink-0 rounded-full border px-1.5 py-0.5 text-[10px] font-medium ${statusBadge.className}`}
                                    >
                                        {statusBadge.label}
                                    </span>
                                ) : null}
                            </div>
                        </div>
                        <span className="shrink-0 text-xs text-muted-foreground">
                            {session.updatedAtText}
                        </span>
                    </div>

                    <p className="mt-1 truncate text-xs text-muted-foreground">
                        {subtitle}
                    </p>
                </div>
            </div>

            {session.unreadCount > 0 && (
                <div className="mt-2 flex justify-end">
                    <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-primary px-1.5 py-0.5 text-[11px] font-semibold text-primary-foreground">
                        {session.unreadCount}
                    </span>
                </div>
            )}
        </button>
    );
}

export default ChatSessionItem;
