import { useCallback, useEffect, useState } from 'react';

import { getErrorMessage } from '@/lib/http/apiError';
import { ticketTypeService } from '@/lib/services/admin/ticketTypeService';
import { mapTicketTypeRow } from '@/pages/(admin)/TicketTypes/data';


const PAGE_SIZE = 10;

export function useTicketTypes(page, search) {
  const [ticketTypes, setTicketTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [meta, setMeta] = useState({
    totalItems: 0,
    totalPages: 1,
    currentPage: 1,
    itemsPerPage: PAGE_SIZE,
  });

  const loadTicketTypes = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const payload =
        await ticketTypeService.list({
          page,
          limit: PAGE_SIZE,
          search,
        });

      const rows = payload.data ?? [];

      setTicketTypes(
        rows.map(mapTicketTypeRow)
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
      setTicketTypes([]);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    void loadTicketTypes();
  }, [loadTicketTypes]);

  return {
    ticketTypes,
    meta,
    loading,
    error,
    setError,
    loadTicketTypes,
  };
}