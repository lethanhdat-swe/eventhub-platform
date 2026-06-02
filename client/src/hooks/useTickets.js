import { useCallback, useEffect, useState } from 'react';

import { getErrorMessage } from '@/lib/http/apiError';
import { ticketService } from '@/lib/services/admin/ticketService';
import { mapTicketRow } from '@/pages/(admin)/Tickets/data';


const PAGE_SIZE = 10;

function buildCheckInQuery(filter) {
  if (filter === 'checked') return true;
  if (filter === 'unchecked') return false;
  return undefined;
}

export function useTickets({
  page,
  search,
  checkInFilter,
  eventFilter,
}) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [meta, setMeta] = useState({
    totalItems: 0,
    totalPages: 1,
    currentPage: 1,
    itemsPerPage: PAGE_SIZE,
  });

  const loadTickets = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const payload = await ticketService.list({
        page,
        limit: PAGE_SIZE,
        search,
        isCheckedIn: buildCheckInQuery(checkInFilter),
        eventId: eventFilter,
      });

      const rows = payload.data ?? [];

      setTickets(rows.map(mapTicketRow));

      const m = payload.meta ?? {};

      setMeta({
        totalItems: m.totalItems ?? 0,
        totalPages: Math.max(1, m.totalPages ?? 1),
        currentPage: m.currentPage ?? page,
        itemsPerPage: m.itemsPerPage ?? PAGE_SIZE,
      });
    } catch (e) {
      setError(getErrorMessage(e));
      setTickets([]);
    } finally {
      setLoading(false);
    }
  }, [page, search, checkInFilter, eventFilter]);

  useEffect(() => {
    void loadTickets();
  }, [loadTickets]);

  return {
    tickets,
    meta,
    loading,
    error,
    setError,
    loadTickets,
  };
}