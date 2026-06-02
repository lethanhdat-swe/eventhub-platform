import {
  AdminEmptyState,
  AdminLoadingState,
  AdminPagination,
} from '@/pages/(admin)/components/table';
import RefundTable from '../RefundTable/RefundTable';


function RefundContent({
  loading,
  error,
  refunds,
  meta,
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
    return (
      <AdminEmptyState
        title={
          error
            ? 'Không tải được danh sách'
            : 'Chưa có yêu cầu hoàn vé'
        }
        description={
          error ||
          'Các yêu cầu hoàn vé từ khách hàng sẽ được hiển thị tại đây.'
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