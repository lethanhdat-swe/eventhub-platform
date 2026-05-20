import { axiosInstance } from '@/lib/http/axiosInstance';
import { getApiData } from '@/lib/http/unwrapApiSuccess';

const resourceBase = '/api/comments';

function buildListParams(query = {}) {
  const { page = 1, limit = 10 } = query;
  return { page, limit };
}

export const commentService = {
  list: async (eventId, query = {}) => {
    const body = await axiosInstance.get(`${resourceBase}/event/${eventId}`, {
      params: buildListParams(query),
    });
    return getApiData(body);
  },

  create: async (eventId, data) => {
    const body = await axiosInstance.post(
      `${resourceBase}/event/${eventId}`,
      data
    );
    return getApiData(body);
  },

  update: async (commentId, data) => {
    const body = await axiosInstance.patch(
      `${resourceBase}/${commentId}`,
      data
    );
    return getApiData(body);
  },

  deleteOne: async (commentId) => {
    await axiosInstance.delete(`${resourceBase}/${commentId}`);
  },
};
