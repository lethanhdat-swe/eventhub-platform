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

export const aiChatService = {
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
