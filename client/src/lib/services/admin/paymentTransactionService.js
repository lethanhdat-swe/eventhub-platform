import { axiosInstance } from '@/lib/http/axiosInstance';
import { getApiData } from '@/lib/http/unwrapApiSuccess';

const resourceBase = '/api/payment-transactions';

/**
 * @param {{ page?: number, limit?: number, search?: string, status?: string }} query
 */
function buildListParams(query) {
  const { page = 1, limit = 10, search, status } = query;
  const params = { page, limit };
  const q = typeof search === 'string' ? search.trim() : '';
  if (q) params.search = q;
  if (status && status !== 'all') params.status = status;
  return params;
}

export const paymentTransactionService = {
  /**
   * @param {{ page?: number, limit?: number, search?: string, status?: string }} query
   * @returns {Promise<{ items: unknown[], meta: Record<string, number> }>}
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
  getDetail: async (id) => {
    const body = await axiosInstance.get(`${resourceBase}/${id}`);
    return getApiData(body);
  },

  /**
   * @param {string} id
   * @param {{ orderCode: string }} data
   * @returns {Promise<unknown>}
   */
  manualConfirm: async (id, data) => {
    const body = await axiosInstance.post(
      `${resourceBase}/${id}/manual-confirm`,
      data
    );
    return getApiData(body);
  },
};
