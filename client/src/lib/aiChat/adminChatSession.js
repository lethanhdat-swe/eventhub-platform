import {
    CHAT_SESSION_STATUS,
    normalizeSessionStatus,
} from './chatSessionStatus';

export function formatRelativeTime(dateValue) {
    if (!dateValue) return '';

    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) return '';

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / 1000 / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMinutes < 1) return 'Vừa xong';
    if (diffMinutes < 60) return `${diffMinutes} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays < 2) return 'Hôm qua';
    if (diffDays < 7) return `${diffDays} ngày trước`;

    return date.toLocaleDateString('vi-VN', {
        month: 'short',
        day: '2-digit',
    });
}

export function formatClockTime(dateValue) {
    if (!dateValue) return '';

    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) return '';

    return date.toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    });
}

export function getSessionStatusBadge(status) {
    const normalized = normalizeSessionStatus(status);

    switch (normalized) {
        case CHAT_SESSION_STATUS.WAITING_ADMIN:
            return {
                label: 'Đang chờ',
                className:
                    'border-amber-500/40 bg-amber-500/15 text-amber-700 dark:text-amber-300',
                isWaiting: true,
            };
        case CHAT_SESSION_STATUS.ASSIGNED:
            return {
                label: 'Hỗ trợ viên',
                className:
                    'border-emerald-500/40 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300',
                isWaiting: false,
            };
        case CHAT_SESSION_STATUS.ACTIVE:
        default:
            return {
                label: 'Trợ lý AI',
                className: 'border-primary/30 bg-primary/10 text-primary',
                isWaiting: false,
            };
    }
}

export function canAdminSendMessage(status) {
    const normalized = normalizeSessionStatus(status);
    return (
        normalized === CHAT_SESSION_STATUS.WAITING_ADMIN ||
        normalized === CHAT_SESSION_STATUS.ASSIGNED
    );
}

export function canAdminSwitchToHuman(status) {
    return normalizeSessionStatus(status) === CHAT_SESSION_STATUS.ACTIVE;
}

export function canAdminSwitchToAi(status) {
    const normalized = normalizeSessionStatus(status);
    return (
        normalized === CHAT_SESSION_STATUS.WAITING_ADMIN ||
        normalized === CHAT_SESSION_STATUS.ASSIGNED
    );
}

export function canAdminCloseChat(status) {
    const normalized = normalizeSessionStatus(status);
    return (
        normalized === CHAT_SESSION_STATUS.WAITING_ADMIN ||
        normalized === CHAT_SESSION_STATUS.ASSIGNED
    );
}

/**
 * @param {Record<string, unknown>} payload
 */
export function mapRealtimeSessionToListItem(payload) {
    const updatedAt = payload.updatedAt ?? null;
    const lastMessage = payload.lastMessage ?? null;

    return {
        id: payload.id,
        userId: payload.userId ?? null,
        guestId: payload.guestId ?? null,
        user: payload.user ?? null,
        status: normalizeSessionStatus(payload.status),
        statusBadge: getSessionStatusBadge(payload.status),
        updatedAt,
        updatedAtText: formatRelativeTime(updatedAt),
        lastActiveText: `Hoạt động ${formatRelativeTime(updatedAt)}`,
        unreadCount: 0,
        messageCount: payload.messageCount ?? 0,
        lastMessage: lastMessage
            ? {
                  id: lastMessage.id,
                  role: lastMessage.role,
                  content: lastMessage.content,
                  createdAt: lastMessage.createdAt,
                  createdAtText: formatClockTime(lastMessage.createdAt),
              }
            : null,
    };
}

/**
 * @param {Array<Record<string, unknown>>} sessions
 * @param {Record<string, unknown>} updatedItem
 */
export function mergeSessionIntoList(sessions, updatedItem) {
    if (!updatedItem?.id) {
        return sessions ?? [];
    }

    const list = [...(sessions ?? [])];
    const index = list.findIndex((session) => session.id === updatedItem.id);

    if (index >= 0) {
        list[index] = {
            ...list[index],
            ...updatedItem,
        };
    } else {
        list.unshift(updatedItem);
    }

    return list.sort((left, right) => {
        const leftTime = left.updatedAt
            ? new Date(left.updatedAt).getTime()
            : 0;
        const rightTime = right.updatedAt
            ? new Date(right.updatedAt).getTime()
            : 0;
        return rightTime - leftTime;
    });
}
