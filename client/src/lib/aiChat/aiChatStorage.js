const LEGACY_CHAT_SESSION_ID_KEY = 'chatSessionId';
const GUEST_CHAT_SESSION_ID_KEY = 'chatSessionId:guest';
const GUEST_ID_KEY = 'guestId';

function userChatSessionKey(userId) {
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

/**
 * @param {{ isAuthenticated: boolean, userId?: string|null }} scope
 */
export function getStoredChatSessionId(scope) {
  const { isAuthenticated, userId } = scope;

  if (isAuthenticated && userId) {
    return readItem(userChatSessionKey(userId)) ?? readLegacySessionId();
  }

  return readItem(GUEST_CHAT_SESSION_ID_KEY) ?? readLegacySessionId();
}

/**
 * @param {string} sessionId
 * @param {{ isAuthenticated: boolean, userId?: string|null }} scope
 */
export function setStoredChatSessionId(sessionId, scope) {
  if (!sessionId) return;

  const { isAuthenticated, userId } = scope;

  if (isAuthenticated && userId) {
    writeItem(userChatSessionKey(userId), sessionId);
  } else {
    writeItem(GUEST_CHAT_SESSION_ID_KEY, sessionId);
  }

  clearLegacySessionId();
}

/**
 * @param {{ isAuthenticated: boolean, userId?: string|null }} scope
 */
export function clearStoredChatSessionId(scope) {
  const { isAuthenticated, userId } = scope;

  if (isAuthenticated && userId) {
    removeItem(userChatSessionKey(userId));
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
