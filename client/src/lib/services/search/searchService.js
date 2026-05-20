import { axiosInstance } from '@/lib/http/axiosInstance';
import { getApiData } from '@/lib/http/unwrapApiSuccess';

const resourceBase = '/api/search';

export const searchService = {
  search: async (query = {}) => {
    const body = await axiosInstance.get(resourceBase, {
      params: query,
    });
    return getApiData(body);
  },
};
