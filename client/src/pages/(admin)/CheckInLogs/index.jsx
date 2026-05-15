import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
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
  filterCheckInLogs,
  MOCK_CHECKIN_LOGS,
} from '@/pages/(admin)/CheckInLogs/data';

function CheckInLogs() {
  const navigate = useNavigate();
  const [logs, setLogs] = useState(MOCK_CHECKIN_LOGS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState(() => new Set());

  const filteredLogs = useMemo(
    () => filterCheckInLogs(logs, searchQuery),
    [logs, searchQuery]
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
        <Button type="button" variant="outline" className="h-9 px-3 text-sm">
          Sự kiện
        </Button>
        <Button type="button" variant="outline" className="h-9 px-3 text-sm">
          Trạng thái
        </Button>
        <Button type="button" variant="outline" className="h-9 px-3 text-sm">
          Thời gian
        </Button>
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
        onViewTicket={handleViewTicket}
        onMarkInvalid={handleMarkInvalid}
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
