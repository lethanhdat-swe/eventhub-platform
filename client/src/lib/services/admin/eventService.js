import { axiosInstance } from '@/lib/http/axiosInstance';
import { getApiData } from '@/lib/http/unwrapApiSuccess';

const resourceBase = '/api/events';

function buildListParams(query) {
  const { page = 1, limit = 10, search, status, categoryId } = query;
  const params = { page, limit };
  const q = typeof search === 'string' ? search.trim() : '';
  if (q) params.search = q;
  if (status && status !== 'all') params.status = status;
  if (categoryId && categoryId !== 'all') params.categoryId = categoryId;
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
