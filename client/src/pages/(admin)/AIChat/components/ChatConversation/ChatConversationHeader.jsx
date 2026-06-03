function getInitials(name) {
  if (!name) return 'G';
  const words = name.trim().split(/\s+/).slice(0, 2);
  return words.map((word) => word[0]?.toUpperCase() ?? '').join('');
}

function getDisplayName(session) {
  if (session.user?.fullName) return session.user.fullName;
  const shortGuestId = session.guestId?.slice(0, 8) ?? 'Unknown';
  return `Guest ${shortGuestId}`;
}

function ChatConversationHeader({ session }) {
  const displayName = getDisplayName(session);
  const identityText = session.user?.email ?? session.guestId ?? 'Guest conversation';

  return (
    <header className="flex items-center justify-between gap-4 border-b px-6 py-4">
      <div className="flex min-w-0 items-center gap-3">
        {session.user?.avatarUrl ? (
          <img
            src={session.user.avatarUrl}
            alt={displayName}
            className="h-11 w-11 rounded-full border object-cover"
          />
        ) : (
          <div className="flex h-11 w-11 items-center justify-center rounded-full border bg-muted text-sm font-semibold">
            {getInitials(displayName)}
          </div>
        )}

        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{displayName}</p>
          <p className="truncate text-xs text-muted-foreground">{identityText}</p>
          <p className="text-xs text-muted-foreground">AI support conversation</p>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">{session.lastActiveText ?? session.updatedAtText}</p>
    </header>
  );
}

export default ChatConversationHeader;
