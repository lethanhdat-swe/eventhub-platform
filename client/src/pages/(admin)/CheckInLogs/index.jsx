import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import AdminFilterDropdown from '@/pages/(admin)/components/AdminFilterDropdown';
import AdminToolbar from '@/pages/(admin)/components/AdminToolbar';
import {
  AdminBulkActions,
  AdminEmptyState,
  AdminLoadingState,
  AdminPagination,
  ADMIN_EMPTY_STATES,
} from '@/pages/(admin)/components/table';

import PageHeader from '@/pages/(admin)/components/PageHeader';
import CheckInLogTable from '@/pages/(admin)/CheckInLogs/components/CheckInLogTable';
import {
  CHECKIN_LOG_STATUS_LABELS,
  filterCheckInLogs,
  MOCK_CHECKIN_LOGS,
} from '@/pages/(admin)/CheckInLogs/data';

const CHECKIN_TIME_FILTER_OPTIONS = [
  { value: 'all', label: 'Tất cả' },
  { value: '7d', label: '7 ngày gần đây' },
  { value: '30d', label: '30 ngày gần đây' },
];

function CheckInLogs() {
  const navigate = useNavigate();
  const [logs, setLogs] = useState(MOCK_CHECKIN_LOGS);
  const [searchQuery, setSearchQuery] = useState('');
  const [eventFilter, setEventFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState('all');
  const [selectedIds, setSelectedIds] = useState(() => new Set());

  const checkInEventFilterOptions = useMemo(() => {
    const titles = [...new Set(logs.map((l) => l.eventTitle))].sort();
    return [
      { value: 'all', label: 'Tất cả' },
      ...titles.map((title) => ({ value: title, label: title })),
    ];
  }, [logs]);

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

  const filteredLogs = useMemo(
    () =>
      filterCheckInLogs(logs, searchQuery, {
        eventTitle: eventFilter,
        status: statusFilter,
        timeRange: timeFilter,
      }),
    [logs, searchQuery, eventFilter, statusFilter, timeFilter]
  );

  const isLoading = false;
  const isEmpty = !isLoading && filteredLogs.length === 0;

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedIds(new Set(filteredLogs.map((log) => log.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectRow = (id, checked) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (checked) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  };

  const markInvalidByIds = (ids) => {
    setLogs((prev) =>
      prev.map((log) =>
        ids.has(log.id) ? { ...log, status: 'invalid' } : log
      )
    );
  };

  const handleMarkInvalid = (log) => {
    markInvalidByIds(new Set([log.id]));
  };

  const handleBulkMarkInvalid = () => {
    markInvalidByIds(selectedIds);
    setSelectedIds(new Set());
  };

  const handleExport = () => {
    console.log('Xuất file check-in logs:', [...selectedIds]);
  };

  const handleView = (log) => {
    console.log('Xem chi tiết check-in log:', log);
  };

  const handleEdit = (log) => {
    console.log('[Edit check-in log]', log);
  };

  const handleDelete = (log) => {
    console.log('[Delete check-in log — placeholder]', log);
  };

  const handleViewTicket = () => {
    navigate('/admin/tickets');
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Lịch sử check-in"
        description="Theo dõi lịch sử quét vé, thời gian check-in và trạng thái xác thực."
      />

      <AdminToolbar
        searchPlaceholder="Tìm kiếm mã vé, khách hàng, sự kiện..."
        onSearchChange={setSearchQuery}
      >
        <AdminFilterDropdown
          label="Sự kiện"
          options={checkInEventFilterOptions}
          value={eventFilter}
          onChange={setEventFilter}
        />
        <AdminFilterDropdown
          label="Trạng thái"
          options={checkInStatusFilterOptions}
          value={statusFilter}
          onChange={setStatusFilter}
        />
        <AdminFilterDropdown
          label="Thời gian"
          options={CHECKIN_TIME_FILTER_OPTIONS}
          value={timeFilter}
          onChange={setTimeFilter}
        />
      </AdminToolbar>

            <AdminBulkActions
        selectedCount={selectedIds.size}
        label={`Đã chọn ${selectedIds.size} bản ghi`}
      >
        <Button type="button" variant="outline" className="h-9 px-3" onClick={handleExport}>
          Xuất file
        </Button>
        <Button type="button" variant="destructive" className="h-9 px-3" onClick={handleBulkMarkInvalid}>
          Đánh dấu lỗi
        </Button>
      </AdminBulkActions>

      {isLoading ? (
        <AdminLoadingState rows={6} columns={9} minWidth="min-w-[1000px]" />
      ) : isEmpty ? (
        <AdminEmptyState {...ADMIN_EMPTY_STATES.checkInLogs} />
      ) : (
        <>
          <CheckInLogTable
        logs={filteredLogs}
        selectedIds={selectedIds}
        onSelectAll={handleSelectAll}
        onSelectRow={handleSelectRow}
        onView={handleView}
        onEdit={handleEdit}
        onViewTicket={handleViewTicket}
        onMarkInvalid={handleMarkInvalid}
        onDelete={handleDelete}
      />
          <AdminPagination
            currentPage={1}
            totalPages={1}
            totalItems={filteredLogs.length}
            pageSize={10}
          />
        </>
      )}
    </div>
  );
}

export default CheckInLogs;
