import { useEffect, useState } from 'react';
import PageHeader from '@/pages/(admin)/components/PageHeader';
import { getErrorMessage } from '@/lib/http/apiError';
import { ticketService } from '@/lib/services/admin/ticketService';
import { toast } from 'sonner';
import { useTickets } from '@/hooks/useTickets';
import { useTicketEvents } from '@/hooks/useTicketEvents';
import TicketErrorAlert from './components/TicketErrorAlert/TicketErrorAlert';
import TicketFilters from './components/TicketFilters/TicketFilters';
import TicketBulkActions from './components/TicketBulkActions/TicketBulkActions';
import TicketContent from './components/TicketContent/TicketContent';
import TicketDetailDialog from './components/TicketDetailDialog/TicketDetailDialog';
import DeleteTicketDialog from './components/DeleteTicketDialog/DeleteTicketDialog';

function Tickets() {
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const [checkInFilter, setCheckInFilter] =
    useState('all');

  const [eventFilter, setEventFilter] =
    useState('all');

  const [page, setPage] = useState(1);

  const [selectedIds, setSelectedIds] =
    useState(() => new Set());

  const [deleteDialog, setDeleteDialog] =
    useState(null);

  const [deleteSubmitting,
    setDeleteSubmitting] =
    useState(false);

  const [detailOpen, setDetailOpen] =
    useState(false);

  const [detailTicket, setDetailTicket] =
    useState(null);

  const [detailLoading,
    setDetailLoading] =
    useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(
        searchInput.trim()
      );
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchInput]);

  useEffect(() => {
    setPage(1);
  }, [
    debouncedSearch,
    checkInFilter,
    eventFilter,
  ]);

  const {
    tickets,
    meta,
    loading,
    error,
    setError,
    loadTickets,
  } = useTickets({
    page,
    search: debouncedSearch,
    checkInFilter,
    eventFilter,
  });

  const {
    eventFilterOptions,
  } = useTicketEvents();

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedIds(
        new Set(
          tickets.map(
            (ticket) => ticket.id
          )
        )
      );
      return;
    }

    setSelectedIds(new Set());
  };

  const handleSelectRow = (
    id,
    checked
  ) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);

      if (checked) {
        next.add(id);
      } else {
        next.delete(id);
      }

      return next;
    });
  };

  const handleCheckIn = async (
    ticket
  ) => {
    try {
      await ticketService.update(
        ticket.id,
        {
          isCheckedIn: true,
          checkedInAt:
            new Date().toISOString(),
        }
      );

      toast.success(
        `Check-in thành công cho vé ${ticket.ticketCode}`
      );

      await loadTickets();
    } catch (e) {
      const message =
        getErrorMessage(e);

      setError(message);

      toast.error(
        message ||
          'Check-in thất bại'
      );
    }
  };

  const handleView = async (
    ticket
  ) => {
    setDetailOpen(true);
    setDetailTicket(null);
    setDetailLoading(true);

    try {
      const full =
        await ticketService.getById(
          ticket.id
        );

      setDetailTicket(full);
    } catch (e) {
      const message =
        getErrorMessage(e);

      setDetailOpen(false);

      toast.error(
        message ||
          'Không thể tải chi tiết vé'
      );
    } finally {
      setDetailLoading(false);
    }
  };

  const handleDelete = (
    ticket
  ) => {
    setDeleteDialog({
      type: 'single',
      ticket,
    });
  };

  const handleDeleteConfirm =
    async () => {
      if (
        !deleteDialog ||
        deleteSubmitting
      )
        return;

      setDeleteSubmitting(true);

      try {
        if (
          deleteDialog.type ===
          'bulk'
        ) {
          await ticketService.deleteMany(
            [...selectedIds]
          );

          toast.success(
            `Đã xóa ${selectedIds.size} vé`
          );

          setSelectedIds(
            new Set()
          );
        } else {
          await ticketService.deleteOne(
            deleteDialog.ticket.id
          );

          toast.success(
            `Đã xóa vé ${deleteDialog.ticket.ticketCode}`
          );
        }

        setDeleteDialog(null);

        await loadTickets();
      } catch (e) {
        toast.error(
          getErrorMessage(e) ||
            'Xóa vé thất bại'
        );
      } finally {
        setDeleteSubmitting(false);
      }
    };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Quản lý vé đã đặt"
        description="Theo dõi vé đã phát hành, trạng thái check-in và thông tin ghế."
      />

      <TicketErrorAlert
        error={error}
        hasData={tickets.length > 0}
        onRetry={() =>
          void loadTickets()
        }
      />

      <TicketFilters
        searchInput={searchInput}
        setSearchInput={
          setSearchInput
        }
        checkInFilter={
          checkInFilter
        }
        setCheckInFilter={
          setCheckInFilter
        }
        eventFilter={
          eventFilter
        }
        setEventFilter={
          setEventFilter
        }
        eventFilterOptions={
          eventFilterOptions
        }
      />

      <TicketBulkActions
        selectedCount={
          selectedIds.size
        }
        onDelete={() =>
          setDeleteDialog({
            type: 'bulk',
          })
        }
      />

      <TicketContent
        loading={loading}
        error={error}
        tickets={tickets}
        meta={meta}
        selectedIds={
          selectedIds
        }
        onRetry={() =>
          void loadTickets()
        }
        onSelectAll={
          handleSelectAll
        }
        onSelectRow={
          handleSelectRow
        }
        onView={handleView}
        onDelete={
          handleDelete
        }
        onCheckIn={
          handleCheckIn
        }
        onPageChange={
          setPage
        }
      />

      <TicketDetailDialog
        open={detailOpen}
        onOpenChange={(
          open
        ) => {
          setDetailOpen(open);

          if (!open) {
            setDetailTicket(
              null
            );
          }
        }}
        ticket={detailTicket}
        loading={detailLoading}
      />

      <DeleteTicketDialog
        open={Boolean(
          deleteDialog
        )}
        isBulk={
          deleteDialog?.type ===
          'bulk'
        }
        ticketCode={
          deleteDialog?.ticket
            ?.ticketCode ?? ''
        }
        selectedCount={
          selectedIds.size
        }
        isDeleting={
          deleteSubmitting
        }
        onConfirm={() =>
          void handleDeleteConfirm()
        }
        onCancel={() => {
          if (
            !deleteSubmitting
          ) {
            setDeleteDialog(
              null
            );
          }
        }}
      />
    </div>
  );
}

export default Tickets;