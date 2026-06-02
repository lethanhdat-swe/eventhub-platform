import {
  AdminLoadingState,
  AdminEmptyState,
  AdminPagination,
  ADMIN_EMPTY_STATES,
} from '@/pages/(admin)/components/table';
import CouponTable from '../CouponTable/CouponTable';


export default function CouponContent({
  coupons,
  meta,

  error,
  isLoading,

  selectedIds,

  onRetry,
  onPageChange,

  onSelectAll,
  onSelectRow,

  onEdit,
  onDelete,

  onCreate,
}) {
  const isEmpty =
    !isLoading &&
    coupons.length === 0;

  if (isLoading) {
    return (
      <AdminLoadingState
        rows={6}
        columns={8}
        minWidth="min-w-[900px]"
      />
    );
  }

  if (isEmpty) {
    return (
      <AdminEmptyState
        {...(error
          ? {
              title:
                'Không tải được danh sách',
              description: error,
              actionLabel: 'Thử lại',
              onAction: onRetry,
            }
          : {
              ...ADMIN_EMPTY_STATES.coupons,
              onAction: onCreate,
            })}
      />
    );
  }

  return (
    <>
      <CouponTable
        coupons={coupons}
        selectedIds={selectedIds}
        onSelectAll={onSelectAll}
        onSelectRow={onSelectRow}
        onEdit={onEdit}
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