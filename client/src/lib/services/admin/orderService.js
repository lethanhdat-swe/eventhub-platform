import { axiosInstance } from '@/lib/http/axiosInstance';
import { getApiData } from '@/lib/http/unwrapApiSuccess';

const resourceBase = '/api/orders';

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

export const orderService = {
  /**
   * @param {{ page?: number, limit?: number, search?: string, status?: string }} query
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
   * @param {string} id
   * @returns {Promise<unknown>}
   */
  getDetail: async (id) => {
    const body = await axiosInstance.get(`${resourceBase}/${id}`);
    return getApiData(body);
  },

  /**
   * @param {{ page?: number, limit?: number, status?: string }} params
   * @returns {Promise<{ data: unknown[], meta: Record<string, number> }>}
   */
  getMyOrders: async (params = {}) => {
    const body = await axiosInstance.get(`${resourceBase}/my`, {
      params: buildListParams(params),
    });
    return getApiData(body);
  },

  /**
   * @param {string} id
   * @returns {Promise<unknown>}
   */
  getMyOrderDetail: async (id) => {
    const body = await axiosInstance.get(`${resourceBase}/my/${id}`);
    return getApiData(body);
  },

  /**
   * Tra cứu đơn theo mã orderCode (public).
   * @param {string} orderCode
   * @returns {Promise<{
   *   id: string,
   *   orderCode: string,
   *   status: string,
   *   totalAmount: number,
   *   finalAmount: number,
   *   paymentMethod: string,
   *   createdAt: string,
   *   paidAt: string | null,
   *   customerName: string | null,
   *   customerEmail: string,
   *   customerPhone: string,
   *   event: object | null,
   *   tickets: object[],
   *   refundRequests: object[],
   *   latestRefundRequest: object | null,
   *   sepay: object | null,
   * }>}
   */
  lookupByOrderCode: async (orderCode) => {
    const code = typeof orderCode === 'string' ? orderCode.trim() : '';
    const body = await axiosInstance.get(
      `${resourceBase}/by-code/${encodeURIComponent(code)}`
    );
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
   * @param {string[]} ids
   */
  deleteMany: async (ids) => {
    await axiosInstance.delete(resourceBase, { data: { ids } });
  },

  exportMyOrderTicketPdf: async (id) => {
    const response = await axiosInstance.get(
      `${resourceBase}/my/${id}/ticket-pdf`,
      {
        responseType: 'blob',
      }
    );

    return response instanceof Blob ? response : response.data;
  },
};
