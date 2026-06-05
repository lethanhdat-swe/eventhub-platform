import { axiosInstance } from '@/lib/http/axiosInstance';
import { getApiData } from '@/lib/http/unwrapApiSuccess';

const resourceBase = '/api/app-settings/banners';

export const bannerService = {
  createBanners: async (data) => {
    const body = await axiosInstance.post(resourceBase, data);
    return getApiData(body);
  },

  getAllBanners: async () => {
    const body = await axiosInstance.get(resourceBase);
    return getApiData(body);
  },

  updateBanner: async (id, data) => {
    const body = await axiosInstance.patch(`${resourceBase}/${id}`, data);
    return getApiData(body);
  },

  deleteBanner: async (id) => {
    const body = await axiosInstance.delete(`${resourceBase}/${id}`);
    return getApiData(body);
  }
};
