import { axiosInstance } from '@/lib/http/axiosInstance';
import { getApiData } from '@/lib/http/unwrapApiSuccess';

const resourceBase = '/api/coupons';

/**
 * @param {{ page?: number, limit?: number, search?: string, status?: string, validity?: string }} query
 */
function buildListParams(query) {
  const { page = 1, limit = 10, search, status, validity } = query;
  const params = { page, limit };
  const q = typeof search === 'string' ? search.trim() : '';
  if (q) params.search = q;
  if (status && status !== 'all') params.status = status;
  if (validity && validity !== 'all') params.validity = validity;
  return params;
}

export const couponService = {
  /**
   * @param {{ page?: number, limit?: number, search?: string, status?: string, validity?: string }} query
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
   * @param {string} id
   */
  deleteOne: async (id) => {
    await axiosInstance.delete(`${resourceBase}/${id}`);
  },

  /**
   * @param {string[]} ids
   */
  deleteMany: async (ids) => {
    await axiosInstance.delete(resourceBase, { data: { ids } });
  },
};
