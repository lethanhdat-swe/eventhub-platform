import { axiosInstance } from '@/lib/http/axiosInstance';
import { appendSortParams } from '@/lib/http/buildListSortParams';
import { getApiData } from '@/lib/http/unwrapApiSuccess';

const resourceBase = '/api/ticket-types';

/**
 * @param {{ page?: number, limit?: number, search?: string }} query
 */
function buildListParams(query) {
  const { page = 1, limit = 10, search, sortBy, sortOrder } = query;
  const params = { page, limit };
  const q = typeof search === 'string' ? search.trim() : '';
  if (q) params.search = q;
  return appendSortParams(params, { sortBy, sortOrder });
}

export const ticketTypeService = {
  /**
   * @param {{ page?: number, limit?: number, search?: string }} query
   * @returns {Promise<{ data: unknown[], meta: Record<string, number> }>}
   */
  list: async (query = {}) => {
    const body = await axiosInstance.get(resourceBase, {
      params: buildListParams(query),
    });
    return getApiData(body);
  },

  /**
   * @param {string} id
   * @returns {Promise<unknown>}
   */
  getById: async (id) => {
    const body = await axiosInstance.get(`${resourceBase}/${id}`);
    return getApiData(body);
  },

  /**
   * @param {{ name: string, price: number, color?: string }} data
   */
  create: async (data) => {
    const body = await axiosInstance.post(resourceBase, data);
    return getApiData(body);
  },

  /**
   * @param {string} id
   * @param {{ name?: string, price?: number, color?: string }} data
   */
  update: async (id, data) => {
    const body = await axiosInstance.patch(`${resourceBase}/${id}`, data);
    return getApiData(body);
  },

  /**
   * @param {string[]} ids
   */
  deleteMany: async (ids) => {
    await axiosInstance.delete(resourceBase, { data: { ids } });
  },
};
