import { useState } from 'react';

import { getErrorMessage } from '@/lib/http/apiError';
import { paymentTransactionService } from '@/lib/services/admin/paymentTransactionService';

export function useTransactionDetail() {
  const [open, setOpen] = useState(false);
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const openDetail = async (id) => {
    setLoading(true);
    setOpen(true);

    try {
      const detail =
        await paymentTransactionService.getDetail(id);

      setTransaction(detail);
    } catch (e) {
      setError(getErrorMessage(e));
      setOpen(false);
    } finally {
      setLoading(false);
    }
  };

  return {
    open,
    setOpen,
    transaction,
    loading,
    error,
    openDetail,
  };
}