import {
  AdminEmptyState,
  AdminLoadingState,
  AdminPagination,
  ADMIN_EMPTY_STATES,
} from '@/pages/(admin)/components/table';
import UserTable from '../UserTable/UserTable';


function UserContent({
  loading,
  error,
  users,
  meta,
  selectedIds,
  sortBy,
  sortOrder,
  onSort,
  onRetry,
  onSelectAll,
  onSelectRow,
  onView,
  onEdit,
  onDelete,
  onPageChange,
}) {
  if (loading) {
    return (
      <AdminLoadingState
        rows={6}
        columns={9}
        minWidth="min-w-[1100px]"
      />
    );
  }

  if (users.length === 0) {
    return (
      <AdminEmptyState
        {...(error
          ? {
              title:
                'Không tải được danh sách',
              description:
                error,
              actionLabel:
                'Thử lại',
              onAction:
                onRetry,
            }
          : ADMIN_EMPTY_STATES.users)}
      />
    );
  }

  return (
    <>
      <UserTable
        users={users}
        selectedIds={
          selectedIds
        }
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={onSort}
        onSelectAll={
          onSelectAll
        }
        onSelectRow={
          onSelectRow
        }
        onView={onView}
        onEdit={onEdit}
        onDelete={onDelete}
      />

      <AdminPagination
        currentPage={
          meta.currentPage
        }
        totalPages={
          meta.totalPages
        }
        totalItems={
          meta.totalItems
        }
        pageSize={
          meta.itemsPerPage
        }
        onPageChange={
          onPageChange
        }
      />
    </>
  );
}

export default UserContent;