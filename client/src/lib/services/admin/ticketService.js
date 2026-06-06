import { axiosInstance } from '@/lib/http/axiosInstance';
import { getApiData } from '@/lib/http/unwrapApiSuccess';

const resourceBase = '/api/tickets';

/**
 * @param {{ page?: number, limit?: number, search?: string, isCheckedIn?: boolean, eventId?: string }} query
 */
function buildListParams(query) {
  const { page = 1, limit = 10, search, isCheckedIn, eventId } = query;
  const params = { page, limit };
  const q = typeof search === 'string' ? search.trim() : '';
  if (q) params.search = q;
  if (isCheckedIn !== undefined) params.isCheckedIn = String(isCheckedIn);
  if (eventId && eventId !== 'all') params.eventId = eventId;
  return params;
}

export const ticketService = {
  /**
   * @param {{ page?: number, limit?: number, search?: string, isCheckedIn?: boolean, eventId?: string }} query
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

  myTickets: async () => {
    const body = await axiosInstance.get(`${resourceBase}/my`);
    return getApiData(body);
  },

  /**
   * @param {string} id
   * @param {{ isCheckedIn?: boolean, checkedInAt?: string | null }} data
   */
  update: async (id, data) => {
    const body = await axiosInstance.patch(`${resourceBase}/${id}`, data);
    return getApiData(body);
  },

  /**
   * @param {{ token: string }} data
   */
  checkIn: async (data) => {
    const body = await axiosInstance.post('/api/check-ins/scan', data);
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
