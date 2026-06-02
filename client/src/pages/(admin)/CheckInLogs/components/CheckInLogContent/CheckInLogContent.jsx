import {
  AdminEmptyState,
  AdminLoadingState,
  AdminPagination,
  ADMIN_EMPTY_STATES,
} from '@/pages/(admin)/components/table';
import CheckInLogTable from '../CheckInLogTable/CheckInLogTable';


export default function CheckInLogContent({
  logs,
  meta,
  error,
  isLoading,
  onRetry,
  onPageChange,
  onView,
  onViewTicket,
  onDelete,
}) {
  const isEmpty =
    !isLoading && logs.length === 0;

  if (isLoading) {
    return (
      <AdminLoadingState
        rows={6}
        columns={8}
        minWidth="min-w-[1100px]"
      />
    );
  }

  if (isEmpty) {
    return (
      <AdminEmptyState
        {...(error
          ? {
              title:
                'Không tải được lịch sử check-in',
              description: error,
              actionLabel: 'Thử lại',
              onAction: onRetry,
            }
          : ADMIN_EMPTY_STATES.checkInLogs)}
      />
    );
  }

  return (
    <>
      <CheckInLogTable
        logs={logs}
        onView={onView}
        onViewTicket={onViewTicket}
        onDelete={onDelete}
      />

      <AdminPagination
        currentPage={meta.currentPage}
        totalPages={meta.totalPages}
        totalItems={meta.totalItems}
        pageSize={meta.itemsPerPage}
        onPageChange={onPageChange}
      />
    </>
  );
}