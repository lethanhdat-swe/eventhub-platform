import { useState, useCallback } from 'react';

import { parseApiError } from '@/lib/http/apiError';
import { checkInLogService } from '@/lib/services/admin/checkInLogService';

import {
  normalizeScanResult,
  createErrorResult,
  getStatusFromErrorCode,
} from '../utils/checkInHelpers';

export function useCheckIn(onSuccess) {
  const [isSubmitting, setSubmitting] =
    useState(false);

  const [lastResult, setLastResult] =
    useState(null);

  const [notice, setNotice] =
    useState(null);

  const scanToken = useCallback(
    async (token) => {
      token = token.trim();

      if (!token) return;

      setSubmitting(true);

      try {
        const data =
          await checkInLogService.scan({
            token,
          });

        const result =
          normalizeScanResult(data, token);

        setLastResult(result);
        setNotice(result);

        await onSuccess?.();
      } catch (error) {
        const apiError =
          parseApiError(error);

        const result =
          createErrorResult({
            token,
            status:
              getStatusFromErrorCode(
                apiError.status
              ),
            message: apiError.message,
          });

        setLastResult(result);
        setNotice(result);
      } finally {
        setSubmitting(false);
      }
    },
    [onSuccess]
  );

  return {
    isSubmitting,
    lastResult,
    notice,
    setNotice,
    scanToken,
  };
}