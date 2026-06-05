import { axiosInstance } from '@/lib/http/axiosInstance';
import { appendSortParams } from '@/lib/http/buildListSortParams';
import { getApiData } from '@/lib/http/unwrapApiSuccess';

const resourceBase = '/api/blogs';

function buildListParams(query = {}) {
  const { page = 1, limit = 10, search, sortBy, sortOrder } = query;
  const params = { page, limit };
  const q = typeof search === 'string' ? search.trim() : '';
  if (q) params.search = q;
  return appendSortParams(params, { sortBy, sortOrder });
}

export const blogService = {
  list: async (query = {}) => {
    const body = await axiosInstance.get(resourceBase, {
      params: buildListParams(query),
    });
    return getApiData(body);
  },

  getById: async (id) => {
    const body = await axiosInstance.get(`${resourceBase}/${id}`);
    return getApiData(body);
  },

  getBySlug: async (slug) => {
    const body = await axiosInstance.get(`${resourceBase}/slug/${slug}`);
    return getApiData(body);
  },

  getByCategoryId: async (categoryId, query = {}) => {
    const body = await axiosInstance.get(
      `${resourceBase}/category/${categoryId}`,
      {
        params: buildListParams(query),
      }
    );
    return getApiData(body);
  },

  create: async (data) => {
    const body = await axiosInstance.post(resourceBase, data);
    return getApiData(body);
  },

  update: async (id, data) => {
    const body = await axiosInstance.patch(`${resourceBase}/${id}`, data);
    return getApiData(body);
  },

  deleteMany: async (ids) => {
    await axiosInstance.delete(resourceBase, { data: { ids } });
  },
};
