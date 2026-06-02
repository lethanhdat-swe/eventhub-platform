import { useCallback, useEffect, useState } from 'react';
import { parseApiError } from '@/lib/http/apiError';
import { checkInLogService } from '@/lib/services/admin/checkInLogService';

const RECENT_LOG_LIMIT = 5;

export function useRecentCheckIns() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const payload =
        await checkInLogService.history({
          page: 1,
          limit: RECENT_LOG_LIMIT,
        });

      setItems(payload.data ?? []);
    } catch (e) {
      setError(parseApiError(e).message);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return {
    items,
    error,
    isLoading,
    reload: load,
  };
}