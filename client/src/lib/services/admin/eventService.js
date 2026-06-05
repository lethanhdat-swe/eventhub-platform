import { axiosInstance } from '@/lib/http/axiosInstance';
import { getApiData } from '@/lib/http/unwrapApiSuccess';

const resourceBase = '/api/events';

function buildListParams(query) {
  const {
    page = 1,
    limit = 10,
    search,
    status,
    categoryId,
    categoryIds,
    fromDate,
    toDate,
    sort,
    sortBy,
    sortOrder,
  } = query;

  const params = { page, limit };

  const q = typeof search === 'string' ? search.trim() : '';
  if (q) params.search = q;
  if (status && status !== 'all') params.status = status;
  if (categoryId && categoryId !== 'all') params.categoryId = categoryId;
  if (categoryIds?.length) params.categoryIds = categoryIds.join(',');
  if (fromDate) params.fromDate = new Date(fromDate).toISOString();
  if (toDate) params.toDate = new Date(toDate + 'T23:59:59').toISOString();
  if (sortBy && sortOrder) {
    params.sortBy = sortBy;
    params.sortOrder = sortOrder;
  } else if (sort) {
    params.sort = sort;
  }

  return params;
}

function buildSeatParams(query = {}) {
  const params = {
    page: query.page ?? 1,
    limit: query.limit ?? 100,
  };

  if (query.status && query.status !== 'all') params.status = query.status;
  if (query.ticketTypeId && query.ticketTypeId !== 'all') {
    params.ticketTypeId = query.ticketTypeId;
  }

  return params;
}

const getSeatResourceBase = (eventId) => `${resourceBase}/${eventId}/seats`;

export const eventService = {
  /**
   * @param {{ page?: number, limit?: number, search?: string, status?: string, categoryIds?: string[], fromDate?: string, toDate?: string, sort?: string }} query
 */
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

  eventTrend: async () => {
    const body = await axiosInstance.get(`${resourceBase}/trending`);
    return getApiData(body);
  },

  /**
   * @param {string} eventId
  */

  eventRelated: async (eventId) => {
    const body = await axiosInstance.get(`${resourceBase}/${eventId}/related`);
    return getApiData(body);
  },

  /**
   * @param {string} slug
   */

  getBySlug: async (slug) => {
    const body = await axiosInstance.get(`${resourceBase}/slug/${slug}`);
    return getApiData(body);
  },

  /**
   * @param {Record<string, unknown>} data
   */
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

  deleteArtists: async (eventId, artistIds) => {
    await axiosInstance.delete(`${resourceBase}/${eventId}/artists`, {
      data: { artistIds },
    });
  },

  getSeats: async (eventId, query = {}) => {
    const body = await axiosInstance.get(getSeatResourceBase(eventId), {
      params: buildSeatParams(query),
    });
    return getApiData(body);
  },

  updateSeat: async (eventId, seatId, data) => {
    const body = await axiosInstance.patch(
      `${resourceBase}/${eventId}/seats/${seatId}`,
      data
    );
    return getApiData(body);
  },

  createSeat: async (eventId, data) => {
    const body = await axiosInstance.post(getSeatResourceBase(eventId), data);
    return getApiData(body);
  },

  createSeatRow: async (eventId, data) => {
    const body = await axiosInstance.post(
      `${getSeatResourceBase(eventId)}/rows`,
      data
    );
    return getApiData(body);
  },

  deleteSeats: async (eventId, ids) => {
    await axiosInstance.delete(getSeatResourceBase(eventId), {
      data: { ids },
    });
  },
};
