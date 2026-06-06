import {
  AdminEmptyState,
  AdminLoadingState,
  AdminPagination,
} from '@/pages/(admin)/components/table';
import { ADMIN_EMPTY_STATES } from '@/pages/(admin)/components/table/adminEmptyStates';
import RefundTable from '../RefundTable/RefundTable';


function RefundContent({
  loading,
  error,
  refunds,
  meta,
  sortBy,
  sortOrder,
  onSort,
  onRetry,
  onViewDetail,
  onPageChange,
}) {
  const isEmpty = refunds.length === 0;

  if (loading) {
    return (
      <AdminLoadingState
        rows={6}
        columns={9}
        minWidth="min-w-[1180px]"
      />
    );
  }

  if (isEmpty) {
    const emptyState = ADMIN_EMPTY_STATES.refunds;

    return (
      <AdminEmptyState
        title={
          error
            ? 'Không tải được danh sách'
            : emptyState.title
        }
        description={
          error || emptyState.description
        }
        actionLabel={
          error ? 'Thử lại' : undefined
        }
        onAction={
          error ? onRetry : undefined
        }
      />
    );
  }

  return (
    <>
      <RefundTable
        refunds={refunds}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={onSort}
        onViewDetail={onViewDetail}
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

export default RefundContent;