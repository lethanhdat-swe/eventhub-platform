import { axiosInstance } from '@/lib/http/axiosInstance';
import { getApiData } from '@/lib/http/unwrapApiSuccess';

const resourceBase = '/api/search';

export const searchService = {
  search: async (keyword = '') => {
    const response = await axiosInstance.get(resourceBase, {
      params: {
        q: keyword,
      },
    });

    return getApiData(response);
  },
};