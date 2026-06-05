import { axiosInstance } from '@/lib/http/axiosInstance';
import { appendSortParams } from '@/lib/http/buildListSortParams';
import { getApiData } from '@/lib/http/unwrapApiSuccess';

const resourceBase = '/api/users';

/**
 * @param {{ page?: number, limit?: number, search?: string, role?: string, emailVerified?: string }} query
 */
function buildListParams(query) {
  const { page = 1, limit = 10, search, role, emailVerified, sortBy, sortOrder } = query;
  const params = { page, limit };
  const q = typeof search === 'string' ? search.trim() : '';
  if (q) params.search = q;
  if (role && role !== 'all') params.role = role;
  if (emailVerified && emailVerified !== 'all')
    params.emailVerified = emailVerified;
  return appendSortParams(params, { sortBy, sortOrder });
}

export const userService = {
  /**
   * @param {{ page?: number, limit?: number, search?: string, role?: string, emailVerified?: string }} query
   * @returns {Promise<{ data: unknown[], meta: Record<string, number> }>}
   */
  list: async (query) => {
    const body = await axiosInstance.get(resourceBase, {
      params: buildListParams(query),
    });
    return getApiData(body);
  },

  getById: async (id) => {
    const body = await axiosInstance.get(`${resourceBase}/${id}`);
    return getApiData(body);
  },

  updateMe: async (data) => {
    const body = await axiosInstance.put(`${resourceBase}/update-me`, data);
    return getApiData(body);
  },

  changePassword: async (data) => {
    const body = await axiosInstance.patch(
      `${resourceBase}/change-password`,
      data
    );
    return getApiData(body);
  },

  changeRole: async ({ userId, role }) => {
    await axiosInstance.patch(`${resourceBase}/change-role`, { userId, role });
  },

  deleteMany: async (userIds) => {
    await axiosInstance.delete(resourceBase, { data: { userIds } });
  },
};
