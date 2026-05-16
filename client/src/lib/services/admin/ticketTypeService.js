import { axiosInstance } from '@/lib/http/axiosInstance';

const resourceBase = '/ticket-types';

export const ticketTypeService = {
  getAll: () => axiosInstance.get(resourceBase),
  getById: (id) => axiosInstance.get(`${resourceBase}/${id}`),
  create: (data) => axiosInstance.post(resourceBase, data),
  update: (id, data) => axiosInstance.put(`${resourceBase}/${id}`, data),
  delete: (id) => axiosInstance.delete(`${resourceBase}/${id}`),
};
