import { axiosInstance } from '@/lib/http/axiosInstance';
import { getApiData } from '@/lib/http/unwrapApiSuccess';

const resourceBase = '/api/events';

/**
 * @param {{ page?: number, limit?: number, search?: string, status?: string, categoryId?: string }} query
 */
function buildListParams(query) {
  const { page = 1, limit = 10, search, status, categoryId } = query;
  const params = { page, limit };
  const q = typeof search === 'string' ? search.trim() : '';
  if (q) params.search = q;
  if (status && status !== 'all') params.status = status;
  if (categoryId && categoryId !== 'all') params.categoryId = categoryId;
  return params;
}

export const eventService = {
  /**
   * @param {{ page?: number, limit?: number, search?: string, status?: string, categoryId?: string }} query
   */
  list: async (query = {}) => {
    const body = await axiosInstance.get(resourceBase, {
      params: buildListParams(query),
    });
    return getApiData(body);
  },

  /**
   * @param {string} id
   */
  getById: async (id) => {
    const body = await axiosInstance.get(`${resourceBase}/${id}`);
    return getApiData(body);
  },

  /**
   * @param {Record<string, unknown>} data
   */
  create: async (data) => {
    const body = await axiosInstance.post(resourceBase, data);
    return getApiData(body);
  },

  /**
   * @param {string} id
   * @param {Record<string, unknown>} data
   */
  update: async (id, data) => {
    const body = await axiosInstance.patch(`${resourceBase}/${id}`, data);
    return getApiData(body);
  },

  /**
   * @param {string} eventId
   * @param {string[]} artistIds
   */
  deleteArtists: async (eventId, artistIds) => {
    await axiosInstance.delete(`${resourceBase}/${eventId}/artists`, {
      data: { artistIds },
    });
  },

  /**
   * @param {string} eventId
   * @param {{ page?: number, limit?: number, status?: string, ticketTypeId?: string }} query
   */
  getSeats: async (eventId, query = {}) => {
    const params = {
      page: query.page ?? 1,
      limit: query.limit ?? 100,
    };
    if (query.status) params.status = query.status;
    if (query.ticketTypeId) params.ticketTypeId = query.ticketTypeId;

    const body = await axiosInstance.get(`${resourceBase}/${eventId}/seats`, {
      params,
    });
    return getApiData(body);
  },

  /**
   * @param {string} eventId
   * @param {{ ids: string[]; status?: string; ticketTypeId?: string }} data
   */
  updateSeats: async (eventId, data) => {
    const body = await axiosInstance.patch(
      `${resourceBase}/${eventId}/seats`,
      data
    );
    return getApiData(body);
  },

  /**
   * @param {string[]} ids
   */
  deleteMany: async (ids) => {
    await axiosInstance.delete(resourceBase, { data: { ids } });
  },
};
