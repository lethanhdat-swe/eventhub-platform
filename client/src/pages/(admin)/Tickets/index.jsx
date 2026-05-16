import { useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import AdminFilterDropdown from '@/pages/(admin)/components/AdminFilterDropdown';
import AdminToolbar from '@/pages/(admin)/components/AdminToolbar';
import {
  AdminBulkActions,
  AdminEmptyState,
  AdminLoadingState,
  AdminPagination,
  ADMIN_EMPTY_STATES,
} from '@/pages/(admin)/components/table';

import PageHeader from '@/pages/(admin)/components/PageHeader';
import DeleteTicketDialog from '@/pages/(admin)/Tickets/components/DeleteTicketDialog';
import TicketQrDialog from '@/pages/(admin)/Tickets/components/TicketQrDialog';
import TicketTable from '@/pages/(admin)/Tickets/components/TicketTable';
import { filterTickets, MOCK_TICKETS } from '@/pages/(admin)/Tickets/data';

function Tickets() {
  const [tickets, setTickets] = useState(MOCK_TICKETS);
  const [searchQuery, setSearchQuery] = useState('');
  const [checkInFilter, setCheckInFilter] = useState('all');
  const [eventFilter, setEventFilter] = useState('all');
  const [selectedIds, setSelectedIds] = useState(() => new Set());
  const [deleteDialog, setDeleteDialog] = useState(null);
  const [qrDialog, setQrDialog] = useState(null);

  const checkInFilterOptions = useMemo(
    () => [
      { value: 'all', label: 'Tất cả' },
      { value: 'checked', label: 'Đã check-in' },
      { value: 'unchecked', label: 'Chưa check-in' },
    ],
    []
  );

  const ticketEventFilterOptions = useMemo(() => {
    const titles = [...new Set(tickets.map((t) => t.eventTitle))].sort();
    return [
      { value: 'all', label: 'Tất cả' },
      ...titles.map((title) => ({ value: title, label: title })),
    ];
  }, [tickets]);

  const filteredTickets = useMemo(
    () =>
      filterTickets(tickets, searchQuery, {
        checkIn: checkInFilter,
        eventTitle: eventFilter,
      }),
    [tickets, searchQuery, checkInFilter, eventFilter]
  );

  const isLoading = false;
  const isEmpty = !isLoading && filteredTickets.length === 0;

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedIds(new Set(filteredTickets.map((ticket) => ticket.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectRow = (id, checked) => {
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

  const handleCheckIn = (ticket) => {
    setTickets((prev) =>
      prev.map((item) =>
        item.id === ticket.id
          ? {
              ...item,
              isCheckedIn: true,
              checkedInAt: new Date().toISOString(),
            }
          : item
      )
    );
  };

  const handleDeleteConfirm = () => {
    if (!deleteDialog) return;

    if (deleteDialog.type === 'bulk') {
      setTickets((prev) =>
        prev.filter((ticket) => !selectedIds.has(ticket.id))
      );
      setSelectedIds(new Set());
      setDeleteDialog(null);
      return;
    }

    setTickets((prev) =>
      prev.filter((ticket) => ticket.id !== deleteDialog.ticket.id)
    );
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(deleteDialog.ticket.id);
      return next;
    });
    setDeleteDialog(null);
  };

  const handleView = (ticket) => {
    console.log('[Ticket detail]', ticket.id);
  };

  const handleEdit = (ticket) => {
    console.log('[Edit ticket]', ticket.id);
  };

  const handleDelete = (ticket) => {
    setDeleteDialog({ type: 'single', ticket });
  };

  const deleteDialogOpen = Boolean(deleteDialog);
  const deleteIsBulk = deleteDialog?.type === 'bulk';
  const deleteTicketCode = deleteDialog?.ticket?.ticketCode ?? '';

  return (
    <div className="space-y-4">
      <PageHeader
        title="Quản lý vé đã đặt"
        description="Theo dõi vé đã phát hành, trạng thái check-in và thông tin ghế."
      />

      <AdminToolbar
        searchPlaceholder="Tìm kiếm mã vé, đơn hàng, khách hàng..."
        onSearchChange={setSearchQuery}
      >
        <AdminFilterDropdown
          label="Trạng thái check-in"
          options={checkInFilterOptions}
          value={checkInFilter}
          onChange={setCheckInFilter}
        />
        <AdminFilterDropdown
          label="Sự kiện"
          options={ticketEventFilterOptions}
          value={eventFilter}
          onChange={setEventFilter}
        />
      </AdminToolbar>

            <AdminBulkActions
        selectedCount={selectedIds.size}
        label={`Đã chọn ${selectedIds.size} vé`}
      >
        <Button
            type="button"
            variant="destructive"
            className="h-9 px-3"
            onClick={() => setDeleteDialog({ type: 'bulk' })}
          >
            Xóa đã chọn
          </Button>
      </AdminBulkActions>

      {isLoading ? (
        <AdminLoadingState rows={6} columns={8} minWidth="min-w-[1000px]" />
      ) : isEmpty ? (
        <AdminEmptyState
          {...ADMIN_EMPTY_STATES.tickets}
        />
      ) : (
        <>
          <TicketTable
                  tickets={filteredTickets}
                  selectedIds={selectedIds}
                  onSelectAll={handleSelectAll}
                  onSelectRow={handleSelectRow}
                  onView={handleView}
                  onEdit={handleEdit}
                  onViewQr={(ticket) => setQrDialog(ticket)}
                  onCheckIn={handleCheckIn}
                  onDelete={handleDelete}
                />
          <AdminPagination
            currentPage={1}
            totalPages={1}
            totalItems={filteredTickets.length}
            pageSize={10}
          />
        </>
      )}


      <TicketQrDialog
        open={Boolean(qrDialog)}
        ticket={qrDialog}
        onOpenChange={(isOpen) => {
          if (!isOpen) setQrDialog(null);
        }}
      />

      <DeleteTicketDialog
        open={deleteDialogOpen}
        isBulk={deleteIsBulk}
        ticketCode={deleteTicketCode}
        selectedCount={selectedIds.size}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteDialog(null)}
      />
    </div>
  );
}

export default Tickets;
