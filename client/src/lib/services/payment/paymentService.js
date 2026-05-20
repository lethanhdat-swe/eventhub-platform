import { axiosInstance } from '@/lib/http/axiosInstance';
import { getApiData } from '@/lib/http/unwrapApiSuccess';

const resourceBase = '/api/payment';

export const paymentService = {
  postSepayWebhook: async (data) => {
    const body = await axiosInstance.post(
      `${resourceBase}/sepay/webhook`,
      data
    );
    return getApiData(body);
  },

  postPaymentFailed: async (data) => {
    const body = await axiosInstance.post(`${resourceBase}/sepay/failed`, data);
    return getApiData(body);
  },
};
