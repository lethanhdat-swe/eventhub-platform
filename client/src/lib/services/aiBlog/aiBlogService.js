import { axiosInstance } from '@/lib/http/axiosInstance';
import { getApiData } from '@/lib/http/unwrapApiSuccess';


function buildListParams(query = {}) {
  const { page = 1, limit = 10, search } = query;
  const params = { page, limit };
  const q = typeof search === 'string' ? search.trim() : '';
  if (q) params.search = q;
  return params;
}

export const aiBlogConfigService = {
  getAIConfig: async () => {
    const body = await axiosInstance.get('/api/ai-content-config');
    return getApiData(body);
  },

   createIdeaAiWithQuantity: async (data) => {
    const body = await axiosInstance.post('/api/blog-ideas/generate',data);
    return getApiData(body);
  },

   listBlogAi: async (query = {}) => {
    const body = await axiosInstance.get('/api/blog-ideas', {
        params: buildListParams(query),
      });
    return getApiData(body);
  },

 updateAIConfig: async (configId, data) => {
    const body = await axiosInstance.patch(
      `/api/ai-content-config/${configId}`,
      data
    );

    return getApiData(body);
  },
};
