import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import PageHeader from '@/pages/(admin)/components/PageHeader';
import CheckInLogDetailDialog from '@/pages/(admin)/CheckInLogs/components/CheckInLogDetailDialog/CheckInLogDetailDialog';
import { useCheckInLogs } from '@/hooks/useCheckInLogs';
import CheckInLogFilters from './components/CheckInLogFilters/CheckInLogFilters';
import CheckInLogContent from './components/CheckInLogContent/CheckInLogContent';
import { useTableSort } from '@/pages/(admin)/components/table';

const DEFAULT_CHECKIN_LOG_SORT = {
  sortBy: 'scannedAt',
  sortOrder: 'desc',
};

function CheckInLogs() {
  const navigate = useNavigate();
  const pageResetRef = useRef(null);

  const [detailLog, setDetailLog] =
    useState(null);

  const { sortBy, sortOrder, handleSort } = useTableSort({
    defaultSort: DEFAULT_CHECKIN_LOG_SORT,
    initialSort: DEFAULT_CHECKIN_LOG_SORT,
    onSortChange: () => pageResetRef.current?.(),
  });

  const {
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

    setPage,

    loadLogs,

    eventFilterOptions,
    checkInStatusFilterOptions,
  } = useCheckInLogs({ sortBy, sortOrder });

  pageResetRef.current = () => setPage(1);

  return (
    <div className="space-y-4">
      <PageHeader
        title="Lịch sử check-in"
        description="Theo dõi toàn bộ nhật ký quét QR."
      />

      <CheckInLogFilters
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        eventFilter={eventFilter}
        setEventFilter={setEventFilter}
        eventFilterOptions={eventFilterOptions}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        statusOptions={
          checkInStatusFilterOptions
        }
      />

      <CheckInLogContent
        logs={logs}
        meta={meta}
        error={error}
        isLoading={isLoading}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={handleSort}
        onRetry={() => void loadLogs()}
        onPageChange={setPage}
        onView={setDetailLog}
        onDelete={(log) =>
          console.log(log)
        }
        onViewTicket={(log) => {
          navigate('/admin/tickets');
        }}
      />

      <CheckInLogDetailDialog
        open={Boolean(detailLog)}
        onOpenChange={(open) =>
          !open && setDetailLog(null)
        }
        log={detailLog}
      />
    </div>
  );
}

export default CheckInLogs;
