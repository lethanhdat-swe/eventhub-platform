import { useCallback, useEffect, useState } from 'react';

import { getErrorMessage } from '@/lib/http/apiError';
import { refundService } from '@/lib/services/admin/refundService';
import { mapRefundRow } from '@/pages/(admin)/Refunds/data';

const PAGE_SIZE = 10;

export function useRefunds(
  page,
  search,
  status
) {
  const [refunds, setRefunds] = useState([]);
  const [meta, setMeta] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadRefunds = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const payload =
        await refundService.listAdmin({
          page,
          limit: PAGE_SIZE,
          search,
          status:
            status === 'all'
              ? ''
              : status,
        });

      const rows =
        payload.items ??
        payload.data ??
        [];

      setRefunds(
        rows.map(mapRefundRow)
      );

      const m = payload.meta ?? {};

      setMeta({
        totalItems:
          m.totalItems ?? 0,
        totalPages: Math.max(
          1,
          m.totalPages ?? 1
        ),
        currentPage:
          m.currentPage ?? page,
        itemsPerPage:
          m.itemsPerPage ??
          PAGE_SIZE,
      });
    } catch (e) {
      setError(getErrorMessage(e));
      setRefunds([]);
    } finally {
      setLoading(false);
    }
  }, [page, search, status]);

  useEffect(() => {
    void loadRefunds();
  }, [loadRefunds]);

  return {
    refunds,
    meta,
    loading,
    error,
    loadRefunds,
  };
}