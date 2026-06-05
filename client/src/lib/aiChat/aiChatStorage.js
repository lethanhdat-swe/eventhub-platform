import { CHAT_SESSION_STATUS, normalizeSessionStatus } from './chatSessionStatus';

const LEGACY_CHAT_SESSION_ID_KEY = 'chatSessionId';
const GUEST_CHAT_SESSION_ID_KEY = 'chatSessionId:guest';
const GUEST_CHAT_SESSION_KEY = 'chatSession:guest';
const GUEST_ID_KEY = 'guestId';

function userChatSessionKey(userId) {
  return `chatSession:user:${userId}`;
}

function legacyUserChatSessionIdKey(userId) {
  return `chatSessionId:user:${userId}`;
}

function readItem(key) {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(key);
}

function writeItem(key, value) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, value);
}

function removeItem(key) {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(key);
}

function readLegacySessionId() {
  return readItem(LEGACY_CHAT_SESSION_ID_KEY);
}

function clearLegacySessionId() {
  removeItem(LEGACY_CHAT_SESSION_ID_KEY);
}

function getSessionStorageKey(scope) {
  const { isAuthenticated, userId } = scope;

  if (isAuthenticated && userId) {
    return userChatSessionKey(userId);
  }

  return GUEST_CHAT_SESSION_KEY;
}

function parseStoredSession(raw) {
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);
    if (!parsed?.sessionId) return null;

    return {
      sessionId: parsed.sessionId,
      status: normalizeSessionStatus(parsed.status),
    };
  } catch {
    return null;
  }
}

/**
 * @param {{ isAuthenticated: boolean, userId?: string|null }} scope
 * @returns {{ sessionId: string, status: string } | null}
 */
export function getStoredChatSession(scope) {
  const { isAuthenticated, userId } = scope;
  const storageKey = getSessionStorageKey(scope);
  const stored = parseStoredSession(readItem(storageKey));

  if (stored) {
    return stored;
  }

  let legacySessionId = null;

  if (isAuthenticated && userId) {
    legacySessionId =
      readItem(legacyUserChatSessionIdKey(userId)) ?? readLegacySessionId();
  } else {
    legacySessionId =
      readItem(GUEST_CHAT_SESSION_ID_KEY) ?? readLegacySessionId();
  }

  if (!legacySessionId) {
    return null;
  }

  return {
    sessionId: legacySessionId,
    status: CHAT_SESSION_STATUS.ACTIVE,
  };
}

/**
 * @param {{ sessionId: string, status?: string }} session
 * @param {{ isAuthenticated: boolean, userId?: string|null }} scope
 */
export function setStoredChatSession(session, scope) {
  if (!session?.sessionId) return;

  const storageKey = getSessionStorageKey(scope);
  const payload = {
    sessionId: session.sessionId,
    status: normalizeSessionStatus(session.status),
  };

  writeItem(storageKey, JSON.stringify(payload));

  if (scope.isAuthenticated && scope.userId) {
    removeItem(legacyUserChatSessionIdKey(scope.userId));
  } else {
    removeItem(GUEST_CHAT_SESSION_ID_KEY);
  }

  clearLegacySessionId();
}

/**
 * @param {{ isAuthenticated: boolean, userId?: string|null }} scope
 */
export function getStoredChatSessionId(scope) {
  return getStoredChatSession(scope)?.sessionId ?? null;
}

/**
 * @param {string} sessionId
 * @param {{ isAuthenticated: boolean, userId?: string|null }} scope
 */
export function setStoredChatSessionId(sessionId, scope) {
  if (!sessionId) return;

  const existing = getStoredChatSession(scope);

  setStoredChatSession(
    {
      sessionId,
      status: existing?.status ?? CHAT_SESSION_STATUS.ACTIVE,
    },
    scope
  );
}

/**
 * @param {{ isAuthenticated: boolean, userId?: string|null }} scope
 */
export function clearStoredChatSessionId(scope) {
  const { isAuthenticated, userId } = scope;
  const storageKey = getSessionStorageKey(scope);

  removeItem(storageKey);

  if (isAuthenticated && userId) {
    removeItem(legacyUserChatSessionIdKey(userId));
  } else {
    removeItem(GUEST_CHAT_SESSION_ID_KEY);
  }

  clearLegacySessionId();
}

/** @deprecated Use getStoredChatSessionId */
export function getChatSessionId() {
  return readLegacySessionId() ?? readItem(GUEST_CHAT_SESSION_ID_KEY);
}

/** @deprecated Use setStoredChatSessionId */
export function setChatSessionId(sessionId) {
  if (!sessionId) return;
  writeItem(LEGACY_CHAT_SESSION_ID_KEY, sessionId);
}

/** @deprecated Use clearStoredChatSessionId */
export function clearChatSessionId() {
  clearLegacySessionId();
}

export function getGuestId() {
  return readItem(GUEST_ID_KEY);
}

export function setGuestId(guestId) {
  if (!guestId) return;
  writeItem(GUEST_ID_KEY, guestId);
}

export function getOrCreateGuestId() {
  const existing = getGuestId();
  if (existing) return existing;

  const guestId = `guest-${crypto.randomUUID()}`;
  setGuestId(guestId);
  return guestId;
}
