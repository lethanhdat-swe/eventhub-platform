import { useCallback, useEffect, useMemo, useState } from 'react';

import { getErrorMessage } from '@/lib/http/apiError';
import { checkInLogService } from '@/lib/services/admin/checkInLogService';
import { eventService } from '@/lib/services/admin/eventService';
import { CHECKIN_LOG_STATUS_LABELS } from '@/pages/(admin)/CheckInLogs/data';

const PAGE_SIZE = 10;

export function useCheckInLogs() {
  const [logs, setLogs] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [eventFilter, setEventFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const [eventFilterOptions, setEventFilterOptions] = useState([
    { value: 'all', label: 'Tất cả' },
  ]);

  const [page, setPage] = useState(1);

  const [meta, setMeta] = useState({
    totalItems: 0,
    totalPages: 1,
    currentPage: 1,
    itemsPerPage: PAGE_SIZE,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const checkInStatusFilterOptions = useMemo(
    () => [
      { value: 'all', label: 'Tất cả' },
      ...Object.entries(CHECKIN_LOG_STATUS_LABELS).map(
        ([value, label]) => ({
          value,
          label,
        })
      ),
    ],
    []
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, eventFilter, statusFilter]);

  const loadEventOptions = useCallback(async () => {
    try {
      const payload = await eventService.list({
        page: 1,
        limit: 100,
      });

      const events = payload.data ?? [];

      setEventFilterOptions([
        { value: 'all', label: 'Tất cả' },
        ...events.map((event) => ({
          value: event.id,
          label: event.title,
        })),
      ]);
    } catch {
      setEventFilterOptions([
        { value: 'all', label: 'Tất cả' },
      ]);
    }
  }, []);

  const loadLogs = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const payload =
        await checkInLogService.history({
          page,
          limit: PAGE_SIZE,
          search: debouncedSearch,
          status: statusFilter,
          eventId: eventFilter,
        });

      const rows = payload.data ?? [];
      const m = payload.meta ?? {};

      setLogs(rows);

      setMeta({
        totalItems: m.totalItems ?? 0,
        totalPages: Math.max(
          1,
          m.totalPages ?? 1
        ),
        currentPage: m.currentPage ?? page,
        itemsPerPage:
          m.itemsPerPage ?? PAGE_SIZE,
      });
    } catch (e) {
      setError(getErrorMessage(e));
      setLogs([]);
    } finally {
      setIsLoading(false);
    }
  }, [
    page,
    debouncedSearch,
    eventFilter,
    statusFilter,
  ]);

  useEffect(() => {
    void loadEventOptions();
  }, [loadEventOptions]);

  useEffect(() => {
    void loadLogs();
  }, [loadLogs]);

  return {
    logs,
    meta,
    error,
    isLoading,

    searchInput,
    setSearchInput,

    eventFilter,
    setEventFilter,

    statusFilter,
    setStatusFilter,

    page,
    setPage,

    loadLogs,

    eventFilterOptions,
    checkInStatusFilterOptions,
  };
}