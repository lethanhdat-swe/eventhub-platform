import {
  AdminEmptyState,
  AdminLoadingState,
  AdminPagination,
  ADMIN_EMPTY_STATES,
} from '@/pages/(admin)/components/table';
import ContactTable from '../ContactTable/ContactTable';


export default function ContactContent({
  contacts,
  meta,
  error,
  isLoading,

  onRetry,

  selectedIds,
  onSelectAll,
  onSelectRow,

  onDelete,
  onViewDetail,

  onPageChange,
}) {
  if (isLoading) {
    return (
      <AdminLoadingState
        rows={6}
        columns={6}
        minWidth="min-w-[800px]"
      />
    );
  }

  if (contacts.length === 0) {
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
          : ADMIN_EMPTY_STATES.contacts)}
      />
    );
  }

  return (
    <>
      <ContactTable
        contacts={contacts}
        selectedIds={selectedIds}
        onSelectAll={onSelectAll}
        onSelectRow={onSelectRow}
        onDelete={onDelete}
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