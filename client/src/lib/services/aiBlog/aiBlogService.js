import { axiosInstance } from '@/lib/http/axiosInstance';
import { getApiData } from '@/lib/http/unwrapApiSuccess';

const resourceBase = '/api/blog-categories';

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
};
