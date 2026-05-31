import { axiosInstance } from '@/lib/http/axiosInstance';
import { getApiData } from '@/lib/http/unwrapApiSuccess';

const resourceBase = '/api/notifications';

/**
 * @param {{
 *  page?: number,
 *  limit?: number,
 *  isRead?: boolean | string,
 *  type?: string
 * }} query
 */
function buildListParams(query) {
  const { page = 1, limit = 10, isRead, type } = query;

  const params = { page, limit };

  if (typeof isRead === 'boolean') {
    params.isRead = String(isRead);
  }

  if (typeof isRead === 'string' && isRead !== 'all') {
    params.isRead = isRead;
  }

  if (type && type !== 'all') {
    params.type = type;
  }

  return params;
}

export const notificationService = {
  /**
   * @param {{
   *  page?: number,
   *  limit?: number,
   *  isRead?: boolean | string,
   *  type?: string
   * }} query
   * @returns {Promise<{ items: unknown[], meta: Record<string, number> }>}
   */
  list: async (query = {}) => {
    const body = await axiosInstance.get(resourceBase, {
      params: buildListParams(query),
    });

    return getApiData(body);
  },

  /**
   * @returns {Promise<{ unreadCount: number }>}
   */
  getUnreadCount: async () => {
    const body = await axiosInstance.get(`${resourceBase}/unread-count`);
    return getApiData(body);
  },

  /**
   * @param {string} id
   * @returns {Promise<unknown>}
   */
  markAsRead: async (id) => {
    const body = await axiosInstance.patch(`${resourceBase}/${id}/read`);
    return getApiData(body);
  },

  /**
   * @returns {Promise<{ updatedCount: number }>}
   */
  markAllAsRead: async () => {
    const body = await axiosInstance.patch(`${resourceBase}/read-all`);
    return getApiData(body);
  },

  /**
   * @param {string} id
   */
  delete: async (id) => {
    await axiosInstance.delete(`${resourceBase}/${id}`);
  },
};
