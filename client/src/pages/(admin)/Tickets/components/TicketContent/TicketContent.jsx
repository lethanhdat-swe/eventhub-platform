import {
  AdminEmptyState,
  AdminLoadingState,
  AdminPagination,
  ADMIN_EMPTY_STATES,
} from '@/pages/(admin)/components/table';
import TicketTable from '../TicketTable/TicketTable';

function TicketContent({
  loading,
  error,
  tickets,
  meta,
  selectedIds,
  onRetry,
  onSelectAll,
  onSelectRow,
  onView,
  onDelete,
  onCheckIn,
  onPageChange,
}) {
  const isEmpty = tickets.length === 0;

  if (loading) {
    return (
      <AdminLoadingState
        rows={6}
        columns={8}
        minWidth="min-w-[1000px]"
      />
    );
  }

  if (isEmpty) {
    return (
      <AdminEmptyState
        {...(error
          ? {
              title: 'Không tải được danh sách',
              description: error,
              actionLabel: 'Thử lại',
              onAction: onRetry,
            }
          : ADMIN_EMPTY_STATES.tickets)}
      />
    );
  }

  return (
    <>
      <TicketTable
        tickets={tickets}
        selectedIds={selectedIds}
        onSelectAll={onSelectAll}
        onSelectRow={onSelectRow}
        onView={onView}
        onDelete={onDelete}
        onCheckIn={onCheckIn}
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

export default TicketContent;