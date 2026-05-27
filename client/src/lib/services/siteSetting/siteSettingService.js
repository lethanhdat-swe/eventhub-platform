import { axiosInstance } from '@/lib/http/axiosInstance';
import { getApiData } from '@/lib/http/unwrapApiSuccess';

const resourceBase = '/api/app-settings/site';

export const siteSettingService = {

  createSiteSetting: async (data) => {
    const body = await axiosInstance.post(resourceBase,data );
    return getApiData(body);
  },

  getSiteSetting: async () => {
    const body = await axiosInstance.get(resourceBase);
    return getApiData(body);
  },

  updateSiteSetting: async (data) => {
    const body = await axiosInstance.put(resourceBase,data);
    return getApiData(body);
  },

  deleteSiteSetting: async () => {
    const body = await axiosInstance.put(resourceBase);
    return getApiData(body);
  },
};
