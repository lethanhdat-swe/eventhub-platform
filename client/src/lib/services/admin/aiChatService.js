import { axiosInstance } from '@/lib/http/axiosInstance';
import { getApiData } from '@/lib/http/unwrapApiSuccess';

const resourceBase = '/api/ai-chat';

function buildListSessionsParams(query) {
  const { page = 1, limit = 20, search } = query;
  const params = { page, limit };

  const normalizedSearch = typeof search === 'string' ? search.trim() : '';
  if (normalizedSearch) {
    params.search = normalizedSearch;
  }

  return params;
}

function buildListMessagesParams(query) {
  const { page = 1, limit = 50 } = query;
  return { page, limit };
}

const CHAT_MESSAGES_PAGE_LIMIT = 100;

export const aiChatService = {
  /**
   * @param {{ page?: number, limit?: number, search?: string }} query
   * @returns {Promise<{ items: unknown[], meta: Record<string, number> }>}
   */
  listSessions: async (query = {}) => {
    const body = await axiosInstance.get(`${resourceBase}/admin/sessions`, {
      params: buildListSessionsParams(query),
    });

    return getApiData(body);
  },

  /**
   * @param {string} sessionId
   * @param {{ page?: number, limit?: number }} query
   * @returns {Promise<{ items: unknown[], meta: Record<string, number> }>}
   */
  getSessionMessages: async (sessionId, query = {}) => {
    const body = await axiosInstance.get(`${resourceBase}/sessions/${sessionId}/messages`, {
      params: buildListMessagesParams(query),
    });

    return getApiData(body);
  },

  /**
   * Most recent messages for a session (last page when paginated).
   * @param {string} sessionId
   * @param {{ limit?: number }} [options]
   */
  async fetchRecentSessionMessages(sessionId, { limit = CHAT_MESSAGES_PAGE_LIMIT } = {}) {
    const firstPage = await this.getSessionMessages(sessionId, {
      page: 1,
      limit,
    });

    const totalPages = firstPage?.meta?.totalPages ?? 1;
    if (totalPages <= 1) {
      return firstPage?.items ?? [];
    }

    const lastPage = await this.getSessionMessages(sessionId, {
      page: totalPages,
      limit,
    });

    return lastPage?.items ?? [];
  },
};
