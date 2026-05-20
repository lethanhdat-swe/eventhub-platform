import { axiosInstance } from '@/lib/http/axiosInstance';
import { getApiData } from '@/lib/http/unwrapApiSuccess';

const resourceBase = '/api/contacts';

export const contactService = {
  create: async (data) => {
    const body = await axiosInstance.post(resourceBase, data);
    return getApiData(body);
  },

  list: async (query = {}) => {
    const body = await axiosInstance.get(resourceBase, { params: query });
    return getApiData(body);
  },

  deleteOne: async (id) => {
    await axiosInstance.delete(`${resourceBase}/${id}`);
  },
};
