import { axiosInstance } from '@/lib/http/axiosInstance';
import { getApiData } from '@/lib/http/unwrapApiSuccess';

const resourceBase = '/api/comments';

function buildListParams(query = {}) {
  const { page = 1, limit = 10 } = query;

  return {
    page,
    limit,
  };
}

function normalizeCreatePayload(data = {}) {
  const { content, parentId = null, rating = null, imageUrls = [] } = data;

  return {
    content: content?.trim(),
    parentId,
    rating,
    imageUrls,
  };
}

function normalizeUpdatePayload(data = {}) {
  const payload = {};

  if (data.content !== undefined) {
    payload.content = data.content?.trim();
  }

  if (data.rating !== undefined) {
    payload.rating = data.rating;
  }

  if (data.imageUrls !== undefined) {
    payload.imageUrls = data.imageUrls;
  }

  return payload;
}

export const commentService = {
  list: async (eventId, query = {}) => {
    const response = await axiosInstance.get(
      `${resourceBase}/event/${eventId}`,
      {
        params: buildListParams(query),
      }
    );

    return getApiData(response);
  },

  create: async (eventId, data) => {
    const response = await axiosInstance.post(
      `${resourceBase}/event/${eventId}`,
      normalizeCreatePayload(data)
    );

    return getApiData(response);
  },

  update: async (commentId, data) => {
    const response = await axiosInstance.patch(
      `${resourceBase}/${commentId}`,
      normalizeUpdatePayload(data)
    );

    return getApiData(response);
  },

  deleteOne: async (commentId) => {
    const response = await axiosInstance.delete(`${resourceBase}/${commentId}`);

    return getApiData(response, { allowEmptyData: true });
  },
};
