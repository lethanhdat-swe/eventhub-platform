export const CHAT_SESSION_STATUS = {
  ACTIVE: 'ACTIVE',
  WAITING_ADMIN: 'WAITING_ADMIN',
  ASSIGNED: 'ASSIGNED',
  CLOSED: 'CLOSED',
};

const VALID_STATUSES = new Set(Object.values(CHAT_SESSION_STATUS));

export function normalizeSessionStatus(status) {
  return VALID_STATUSES.has(status) ? status : CHAT_SESSION_STATUS.ACTIVE;
}

export function isHumanSupportStatus(status) {
  return (
    status === CHAT_SESSION_STATUS.WAITING_ADMIN ||
    status === CHAT_SESSION_STATUS.ASSIGNED
  );
}

export function isClosedStatus(status) {
  return normalizeSessionStatus(status) === CHAT_SESSION_STATUS.CLOSED;
}

export function getChatHeaderConfig(status) {
  const normalized = normalizeSessionStatus(status);

  if (normalized === CHAT_SESSION_STATUS.CLOSED) {
    return {
      title: 'EventHub Support',
      subtitle: 'Cuộc trò chuyện đã đóng',
      isHumanMode: true,
    };
  }

  if (normalized === CHAT_SESSION_STATUS.WAITING_ADMIN) {
    return {
      title: 'EventHub Support',
      subtitle: 'Đang chờ admin phản hồi',
      isHumanMode: true,
    };
  }

  if (normalized === CHAT_SESSION_STATUS.ASSIGNED) {
    return {
      title: 'EventHub Support',
      subtitle: 'Admin đang hỗ trợ bạn',
      isHumanMode: true,
    };
  }

  return {
    title: 'EventHub AI',
    subtitle: 'Trợ lý hỗ trợ sự kiện',
    isHumanMode: false,
  };
}

export function getChatFooterText(status) {
  const normalized = normalizeSessionStatus(status);

  if (normalized === CHAT_SESSION_STATUS.CLOSED) {
    return 'Cuộc trò chuyện đã đóng';
  }

  if (normalized === CHAT_SESSION_STATUS.WAITING_ADMIN) {
    return 'Bạn đang chờ admin hỗ trợ';
  }

  if (normalized === CHAT_SESSION_STATUS.ASSIGNED) {
    return 'Hỗ trợ bởi admin EventHub';
  }

  return 'Hỗ trợ tự động bởi EventHub AI';
}

export function getStatusNoticeText(status) {
  const normalized = normalizeSessionStatus(status);

  if (normalized === CHAT_SESSION_STATUS.WAITING_ADMIN) {
    return 'Cuộc trò chuyện đã được chuyển sang admin. Bạn vui lòng chờ phản hồi nhé.';
  }

  if (normalized === CHAT_SESSION_STATUS.ASSIGNED) {
    return 'Admin đang hỗ trợ cuộc trò chuyện này.';
  }

  return null;
}

/**
 * @param {string} status
 * @param {{ role?: string }[]} messages
 */
export function shouldShowStatusNotice(status, messages = []) {
  const noticeText = getStatusNoticeText(status);
  if (!noticeText) return false;

  const hasSystemMessage = (messages ?? []).some(
    (message) => message.role === 'system'
  );

  return !hasSystemMessage;
}

/**
 * @param {{ currentStatus: string, result: { session?: { status?: string }, assistantMessage?: { role?: string } | null } }} params
 */
export function resolveStatusAfterSend({ currentStatus, result }) {
  if (result?.session?.status) {
    return normalizeSessionStatus(result.session.status);
  }

  const normalizedCurrent = normalizeSessionStatus(currentStatus);

  if (normalizedCurrent === CHAT_SESSION_STATUS.ACTIVE) {
    const replyRole = result?.assistantMessage?.role;
    if (replyRole === 'SYSTEM' || replyRole === 'system') {
      return CHAT_SESSION_STATUS.WAITING_ADMIN;
    }
    if (replyRole === 'ASSISTANT' || replyRole === 'assistant') {
      return CHAT_SESSION_STATUS.ACTIVE;
    }
  }

  if (isHumanSupportStatus(normalizedCurrent)) {
    return normalizedCurrent;
  }

  return normalizedCurrent;
}

/**
 * @param {{ role?: string }[]} messages
 */
export function deriveStatusFromMessages(messages) {
  if ((messages ?? []).some((message) => message.role === 'admin')) {
    return CHAT_SESSION_STATUS.ASSIGNED;
  }

  return null;
}
