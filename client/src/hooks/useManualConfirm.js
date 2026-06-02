import { useState } from 'react';

import { getErrorMessage } from '@/lib/http/apiError';
import { paymentTransactionService } from '@/lib/services/admin/paymentTransactionService';

export function useManualConfirm(onSuccess) {
  const [transaction, setTransaction] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const submit = async (orderCode) => {
    if (!transaction) return;

    setSubmitting(true);
    setError(null);

    try {
      await paymentTransactionService.manualConfirm(
        transaction.id,
        { orderCode }
      );

      setTransaction(null);

      await onSuccess?.();
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setSubmitting(false);
    }
  };

  return {
    transaction,
    setTransaction,
    submitting,
    error,
    submit,
  };
}