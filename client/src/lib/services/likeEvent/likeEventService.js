import { axiosInstance } from '@/lib/http/axiosInstance';
import { getApiData } from '@/lib/http/unwrapApiSuccess';

const resourceBase = '/api/like-events';

function buildListParams(query = {}) {
  const { page = 1, limit = 10 } = query;
  return { page, limit };
}

export const likeEventService = {
  toggle: async (eventId) => {
    const body = await axiosInstance.post(`${resourceBase}/${eventId}/toggle`);
    return getApiData(body);
  },

  list: async (query = {}) => {
    const body = await axiosInstance.get(resourceBase, {
      params: buildListParams(query),
    });
    return getApiData(body);
  },
};
