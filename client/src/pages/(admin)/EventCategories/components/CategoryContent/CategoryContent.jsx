import {
  AdminEmptyState,
  AdminLoadingState,
  AdminPagination,
  ADMIN_EMPTY_STATES,
} from '@/pages/(admin)/components/table';

import CategoryTable from '../CategoryTable/CategoryTable';

function CategoryContent({
  isLoading,
  error,
  categories,
  meta,
  loadCategories,
  setPage,
  setFormDialog,
  selectedIds,
  onSelectAll,
  onSelectRow,
  onEdit,
  onDelete,
}) {
  const isEmpty = !isLoading && categories.length === 0;

  if (isLoading) {
    return (
      <AdminLoadingState
        rows={6}
        columns={5}
        minWidth="min-w-[720px]"
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
              onAction: () => void loadCategories(),
            }
          : {
              ...ADMIN_EMPTY_STATES.eventCategories,
              onAction: () =>
                setFormDialog({
                  mode: 'create',
                }),
            })}
      />
    );
  }

  return (
    <>
      <CategoryTable
        categories={categories}
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
        onPageChange={setPage}
      />
    </>
  );
}

export default CategoryContent;