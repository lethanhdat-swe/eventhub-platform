import { axiosInstance } from '@/lib/http/axiosInstance';
import { getApiData } from '@/lib/http/unwrapApiSuccess';

const resourceBase = '/api/ai-chat';

function buildGuestParams(guestId) {
  if (!guestId) return {};
  return { guestId };
}

function buildListMessagesParams(query) {
  const { page = 1, limit = 100, guestId } = query;
  return { page, limit, ...buildGuestParams(guestId) };
}

const CHAT_MESSAGES_PAGE_LIMIT = 100;

export const aiChatService = {
  /**
   * Latest chat session for the authenticated user, or null if none.
   */
  getLatestMySession: async () => {
    const response = await axiosInstance.get(`${resourceBase}/sessions/me/latest`);
    return getApiData(response, { allowEmptyData: true });
  },

  /**
   * @param {{ guestId?: string }} [body]
   */
  createSession: async (body = {}) => {
    const response = await axiosInstance.post(`${resourceBase}/sessions`, body);
    return getApiData(response);
  },

  /**
   * @param {string} sessionId
   * @param {{ page?: number, limit?: number, guestId?: string }} [query]
   */
  getSessionMessages: async (sessionId, query = {}) => {
    const response = await axiosInstance.get(`${resourceBase}/sessions/${sessionId}/messages`, {
      params: buildListMessagesParams(query),
    });
    return getApiData(response);
  },

  /**
   * Most recent messages for a session (last page when paginated).
   * @param {string} sessionId
   * @param {{ guestId?: string }} [options]
   */
  async fetchRecentSessionMessages(sessionId, { guestId } = {}) {
    const firstPage = await this.getSessionMessages(sessionId, {
      page: 1,
      limit: CHAT_MESSAGES_PAGE_LIMIT,
      guestId,
    });

    const totalPages = firstPage?.meta?.totalPages ?? 1;
    if (totalPages <= 1) {
      return firstPage?.items ?? [];
    }

    const lastPage = await this.getSessionMessages(sessionId, {
      page: totalPages,
      limit: CHAT_MESSAGES_PAGE_LIMIT,
      guestId,
    });

    return lastPage?.items ?? [];
  },

  /**
   * @param {string} sessionId
   * @param {{ message: string, guestId?: string }} body
   */
  sendMessage: async (sessionId, body) => {
    const { message, guestId } = body;
    const payload = { message };
    if (guestId) {
      payload.guestId = guestId;
    }

    const response = await axiosInstance.post(
      `${resourceBase}/sessions/${sessionId}/messages`,
      payload
    );
    return getApiData(response);
  },
};
