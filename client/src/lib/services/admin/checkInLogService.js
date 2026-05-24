import { axiosInstance } from '@/lib/http/axiosInstance';
import { getApiData } from '@/lib/http/unwrapApiSuccess';

const resourceBase = '/api/check-ins';

/**
 * @param {{ page?: number, limit?: number, search?: string, status?: 'VALID' | 'DUPLICATE' | 'INVALID', eventId?: string }} query
 */
function buildHistoryParams(query = {}) {
  const { page = 1, limit = 10, search, status, eventId } = query;

  const params = { page, limit };

  const q = typeof search === 'string' ? search.trim() : '';
  if (q) params.search = q;

  if (status && status !== 'all') params.status = status;
  if (eventId && eventId !== 'all') params.eventId = eventId;

  return params;
}

export const checkInLogService = {
  /**
   * @param {{ token: string }} data
   */
  scan: async (data) => {
    const body = await axiosInstance.post(`${resourceBase}/scan`, data);
    return getApiData(body);
  },

  /**
   * @param {{ page?: number, limit?: number, search?: string, status?: 'VALID' | 'DUPLICATE' | 'INVALID', eventId?: string }} query
   */
  history: async (query = {}) => {
    const body = await axiosInstance.get(`${resourceBase}/history`, {
      params: buildHistoryParams(query),
    });
    return getApiData(body);
  },
};
