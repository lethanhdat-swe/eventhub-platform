import {
  AdminEmptyState,
  AdminLoadingState,
  AdminPagination,
  ADMIN_EMPTY_STATES,
} from '@/pages/(admin)/components/table';
import TicketTypeTable from '../TicketTypeTable/TicketTypeTable';


function TicketTypeContent({
  loading,
  error,
  ticketTypes,
  meta,
  selectedIds,
  onRetry,
  onSelectAll,
  onSelectRow,
  onEdit,
  onDelete,
  onCreate,
  onPageChange,
}) {
  const isEmpty =
    ticketTypes.length === 0;

  if (loading) {
    return (
      <AdminLoadingState
        rows={6}
        columns={6}
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
              description:
                error,
              actionLabel:
                'Thử lại',
              onAction:
                onRetry,
            }
          : {
              ...ADMIN_EMPTY_STATES.ticketTypes,
              onAction:
                onCreate,
            })}
      />
    );
  }

  return (
    <>
      <TicketTypeTable
        ticketTypes={
          ticketTypes
        }
        selectedIds={
          selectedIds
        }
        onSelectAll={
          onSelectAll
        }
        onSelectRow={
          onSelectRow
        }
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

export default TicketTypeContent;