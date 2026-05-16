import { axiosInstance } from '@/lib/http/axiosInstance';

const resourceBase = '/artists';

export const artistService = {
  getAll: () => axiosInstance.get(resourceBase),
  getById: (id: string) => axiosInstance.get(`${resourceBase}/${id}`),
  create: (data: unknown) => axiosInstance.post(resourceBase, data),
  update: (id: string, data: unknown) =>
    axiosInstance.put(`${resourceBase}/${id}`, data),
  delete: (id: string) => axiosInstance.delete(`${resourceBase}/${id}`),
};
