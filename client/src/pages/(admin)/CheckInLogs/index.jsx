import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { getErrorMessage } from '@/lib/http/apiError';
import { checkInLogService } from '@/lib/services/admin/checkInLogService';
import { eventService } from '@/lib/services/admin/eventService';
import AdminFilterDropdown from '@/pages/(admin)/components/AdminFilterDropdown';
import AdminToolbar from '@/pages/(admin)/components/AdminToolbar';
import {
  AdminEmptyState,
  AdminLoadingState,
  AdminPagination,
  ADMIN_EMPTY_STATES,
} from '@/pages/(admin)/components/table';

import PageHeader from '@/pages/(admin)/components/PageHeader';
import CheckInLogDetailDialog from '@/pages/(admin)/CheckInLogs/components/CheckInLogDetailDialog';
import CheckInLogTable from '@/pages/(admin)/CheckInLogs/components/CheckInLogTable';
import { CHECKIN_LOG_STATUS_LABELS } from '@/pages/(admin)/CheckInLogs/data';

const PAGE_SIZE = 10;

function CheckInLogs() {
  const navigate = useNavigate();
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
  const [detailLog, setDetailLog] = useState(null);

  const checkInStatusFilterOptions = useMemo(
    () => [
      { value: 'all', label: 'Tất cả' },
      ...Object.entries(CHECKIN_LOG_STATUS_LABELS).map(([value, label]) => ({
        value,
        label,
      })),
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
      const payload = await eventService.list({ page: 1, limit: 100 });
      const events = payload.data ?? [];
      setEventFilterOptions([
        { value: 'all', label: 'Tất cả' },
        ...events.map((event) => ({
          value: event.id,
          label: event.title,
        })),
      ]);
    } catch {
      setEventFilterOptions([{ value: 'all', label: 'Tất cả' }]);
    }
  }, []);

  const loadCheckInLogs = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const payload = await checkInLogService.history({
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
        totalPages: Math.max(1, m.totalPages ?? 1),
        currentPage: m.currentPage ?? page,
        itemsPerPage: m.itemsPerPage ?? PAGE_SIZE,
      });
    } catch (e) {
      setError(getErrorMessage(e));
      setLogs([]);
      setMeta({
        totalItems: 0,
        totalPages: 1,
        currentPage: page,
        itemsPerPage: PAGE_SIZE,
      });
    } finally {
      setIsLoading(false);
    }
  }, [page, debouncedSearch, eventFilter, statusFilter]);

  useEffect(() => {
    void loadEventOptions();
  }, [loadEventOptions]);

  useEffect(() => {
    void loadCheckInLogs();
  }, [loadCheckInLogs]);

  const isEmpty = !isLoading && logs.length === 0;

  const handleView = (log) => {
    setDetailLog(log);
  };

  const handleDelete = (log) => {
    console.log('[Delete check-in log — placeholder]', log);
  };

  const handleViewTicket = (log) => {
    console.log('Xem vé liên kết:', log.ticketId);
    navigate('/admin/tickets');
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Lịch sử check-in"
        description="Theo dõi toàn bộ nhật ký quét QR, bao gồm hợp lệ, quét trùng và không hợp lệ."
      />

      {error && logs.length > 0 ? (
        <div
          className="flex flex-col gap-2 rounded-lg border border-destructive/25 bg-destructive/5 px-3 py-2 sm:flex-row sm:items-center sm:justify-between"
          role="alert"
        >
          <p className="text-sm text-destructive">{error}</p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 shrink-0"
            onClick={() => void loadCheckInLogs()}
          >
            Thử lại
          </Button>
        </div>
      ) : null}

      <AdminToolbar
        searchPlaceholder="Tìm token, khách hàng, sự kiện..."
        searchValue={searchInput}
        onSearchChange={setSearchInput}
      >
        <AdminFilterDropdown
          label="Sự kiện"
          options={eventFilterOptions}
          value={eventFilter}
          onChange={setEventFilter}
        />
        <AdminFilterDropdown
          label="Trạng thái"
          options={checkInStatusFilterOptions}
          value={statusFilter}
          onChange={setStatusFilter}
        />
      </AdminToolbar>

      {isLoading ? (
        <AdminLoadingState rows={6} columns={8} minWidth="min-w-[1100px]" />
      ) : isEmpty ? (
        <AdminEmptyState
          {...(error
            ? {
                title: 'Không tải được lịch sử check-in',
                description: error,
                actionLabel: 'Thử lại',
                onAction: () => void loadCheckInLogs(),
              }
            : ADMIN_EMPTY_STATES.checkInLogs)}
        />
      ) : (
        <>
          <CheckInLogTable
            logs={logs}
            onView={handleView}
            onViewTicket={handleViewTicket}
            onDelete={handleDelete}
          />
          <AdminPagination
            currentPage={meta.currentPage}
            totalPages={meta.totalPages}
            totalItems={meta.totalItems}
            pageSize={meta.itemsPerPage}
            onPageChange={setPage}
          />
        </>
      )}

      <CheckInLogDetailDialog
        open={Boolean(detailLog)}
        onOpenChange={(isOpen) => {
          if (!isOpen) setDetailLog(null);
        }}
        log={detailLog}
      />
    </div>
  );
}

export default CheckInLogs;
