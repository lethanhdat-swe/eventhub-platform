import { axiosInstance } from '@/lib/http/axiosInstance';
import { getApiData } from '@/lib/http/unwrapApiSuccess';

const resourceBase = '/api/seats';

/**
 * @param {{ page?: number, limit?: number, search?: string }} query
 */
function buildListParams(query) {
  const { page = 1, limit = 10, search } = query;
  const params = { page, limit };
  const q = typeof search === 'string' ? search.trim() : '';
  if (q) params.search = q;
  return params;
}

export const seatService = {
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
   * @returns {Promise<unknown[]>}
   */
  listAll: async () => {
    const limit = 200;
    let page = 1;
    let all = [];
    let totalPages = 1;

    do {
      const payload = await seatService.list({ page, limit });
      all = all.concat(payload.data ?? []);
      totalPages = payload.meta?.totalPages ?? 1;
      page += 1;
    } while (page <= totalPages);

    return all;
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
   * @param {{ rowLabel: string, seatNumber: number, defaultTicketTypeId: string }} data
   */
  create: async (data) => {
    const body = await axiosInstance.post(resourceBase, data);
    return getApiData(body);
  },

  /**
   * @param {{ rowLabel: string, fromSeatNumber: number, toSeatNumber: number, defaultTicketTypeId: string }} data
   * @returns {Promise<unknown[]>}
   */
  createRow: async (data) => {
    const body = await axiosInstance.post(`${resourceBase}/rows`, data);
    return getApiData(body);
  },

  /**
   * @param {string} id
   * @param {{ rowLabel?: string, seatNumber?: number, defaultTicketTypeId?: string }} data
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
