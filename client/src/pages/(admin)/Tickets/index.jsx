import { useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
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
  const [selectedIds, setSelectedIds] = useState(() => new Set());
  const [deleteDialog, setDeleteDialog] = useState(null);
  const [qrDialog, setQrDialog] = useState(null);

  const filteredTickets = useMemo(
    () => filterTickets(tickets, searchQuery),
    [tickets, searchQuery]
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

  const handleViewTicket = (ticket) => {
    console.log('[Ticket detail]', ticket.id);
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
        <Button type="button" variant="outline" className="h-9 px-3 text-sm">
          Trạng thái check-in
        </Button>
        <Button type="button" variant="outline" className="h-9 px-3 text-sm">
          Sự kiện
        </Button>
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
                  onView={handleViewTicket}
                  onViewQr={(ticket) => setQrDialog(ticket)}
                  onCheckIn={handleCheckIn}
                  onDelete={(ticket) => setDeleteDialog({ type: 'single', ticket })}
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
