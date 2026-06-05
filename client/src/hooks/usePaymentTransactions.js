import { useCallback, useEffect, useState } from 'react';

import { getErrorMessage } from '@/lib/http/apiError';
import { paymentTransactionService } from '@/lib/services/admin/paymentTransactionService';
import { mapPaymentTransactionRow } from '@/pages/(admin)/PaymentTransactions/data';

const PAGE_SIZE = 10;

export function usePaymentTransactions(
  page,
  search,
  statusFilter,
  { sortBy, sortOrder } = {}
) {
  const [transactions, setTransactions] = useState([]);
  const [meta, setMeta] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadTransactions = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const payload = await paymentTransactionService.list({
        page,
        limit: PAGE_SIZE,
        search,
        status: statusFilter,
        sortBy,
        sortOrder,
      });

      setTransactions(
        (payload.items ?? []).map(mapPaymentTransactionRow)
      );

      const m = payload.meta ?? {};

      setMeta({
        totalItems: m.total ?? 0,
        totalPages: Math.max(1, m.totalPages ?? 1),
        currentPage: m.page ?? page,
        itemsPerPage: m.limit ?? PAGE_SIZE,
      });
    } catch (e) {
      setError(getErrorMessage(e));
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter, sortBy, sortOrder]);

  useEffect(() => {
    void loadTransactions();
  }, [loadTransactions]);

  return {
    transactions,
    meta,
    loading,
    error,
    loadTransactions,
  };
}