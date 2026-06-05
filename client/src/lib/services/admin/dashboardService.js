import { axiosInstance } from '@/lib/http/axiosInstance';
import { getApiData } from '@/lib/http/unwrapApiSuccess';

const resourceBase = '/api/admin/dashboard';

export const dashboardService = {
  /**
   * @param {{ from?: string, to?: string }} query
   */
  getSummary: async (query = {}) => {
    const params = {};
    if (query.from) params.from = query.from;
    if (query.to) params.to = query.to;

    const body = await axiosInstance.get(`${resourceBase}/summary`, { params });
    return getApiData(body);
  },
};
