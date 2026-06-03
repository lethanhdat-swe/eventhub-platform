const CHAT_SESSION_ID_KEY = 'chatSessionId';
const GUEST_ID_KEY = 'guestId';

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

export function getChatSessionId() {
  return readItem(CHAT_SESSION_ID_KEY);
}

export function setChatSessionId(sessionId) {
  if (!sessionId) return;
  writeItem(CHAT_SESSION_ID_KEY, sessionId);
}

export function clearChatSessionId() {
  removeItem(CHAT_SESSION_ID_KEY);
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
