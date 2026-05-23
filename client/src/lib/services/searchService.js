import { axiosInstance } from '@/lib/http/axiosInstance';
import { getApiData } from '@/lib/http/unwrapApiSuccess';

async function search(query) {
  try {
    const data = await axiosInstance.get('/api/search', {
      params: {
        q: query,
      },
    });

    const result = getApiData(data);

    return {
      events: result.events || [],
      artists: result.artists || [],
    };
  } catch (error) {
    console.error('Search error:', error);
    throw error;
  }
}

export const searchService = {
  search,
};