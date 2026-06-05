import {
  AdminEmptyState,
  AdminLoadingState,
  AdminPagination,
  ADMIN_EMPTY_STATES,
} from '@/pages/(admin)/components/table';
import PaymentTransactionTable from '../PaymentTransactionTable/PaymentTransactionTable';


function PaymentTransactionContent({
  loading,
  error,
  transactions,
  meta,
  selectedIds,
  sortBy,
  sortOrder,
  onSort,
  onSelectAll,
  onSelectRow,
  onView,
  onManualConfirm,
  onRetry,
  onPageChange,
}) {
  const isEmpty = transactions.length === 0;

  if (loading) {
    return (
      <AdminLoadingState
        rows={6}
        columns={10}
        minWidth="min-w-[1280px]"
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
          : ADMIN_EMPTY_STATES.paymentTransactions)}
      />
    );
  }

  return (
    <>
      <PaymentTransactionTable
        transactions={transactions}
        selectedIds={selectedIds}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={onSort}
        onSelectAll={onSelectAll}
        onSelectRow={onSelectRow}
        onView={onView}
        onManualConfirm={onManualConfirm}
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

export default PaymentTransactionContent;