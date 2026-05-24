import { axiosInstance } from '@/lib/http/axiosInstance';
import { getApiData } from '@/lib/http/unwrapApiSuccess';

const STORAGE_KEY = 'eventhub_like_status';

const BASE_LIKE_COUNTS = {
  1: 120,
  2: 82,
  3: 231,
  4: 76,
  5: 410,
  6: 54,
  7: 95,
  8: 142,
  9: 63,
};

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isUuid(value) {
  return typeof value === 'string' && UUID_REGEX.test(value);
}

function readStorage() {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

function writeStorage(data) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

async function getLikeInfoLocal(eventId) {
  const id = String(eventId ?? '');
  const stored = readStorage();
  const entry = stored[id] || {};

  const likeCount = typeof entry.likeCount === 'number' ? entry.likeCount : (BASE_LIKE_COUNTS[id] ?? 0);
  const isLiked = Boolean(entry.isLiked);

  return { likeCount, isLiked };
}

async function toggleLikeLocal(eventId) {
  const id = String(eventId ?? '');
  const stored = readStorage();
  const entry = stored[id] || {
    likeCount: BASE_LIKE_COUNTS[id] ?? 0,
    isLiked: false,
  };

  const nextLiked = !entry.isLiked;
  const nextCount = nextLiked ? entry.likeCount + 1 : Math.max(0, entry.likeCount - 1);
  const nextEntry = { likeCount: nextCount, isLiked: nextLiked };

  writeStorage({
    ...stored,
    [id]: nextEntry,
  });

  return nextEntry;
}

export async function getLikeInfo(eventId) {
  if (!eventId) {
    throw new Error('Missing event ID');
  }

  if (!isUuid(String(eventId))) {
    return getLikeInfoLocal(eventId);
  }

  const body = await axiosInstance.get(`/api/like-events/${eventId}`);
  return getApiData(body);
}

export async function toggleLike(eventId) {
  if (!eventId) {
    throw new Error('Missing event ID');
  }

  if (!isUuid(String(eventId))) {
    return toggleLikeLocal(eventId);
  }

  const body = await axiosInstance.post(`/api/like-events/${eventId}/toggle`);
  return getApiData(body);
}
