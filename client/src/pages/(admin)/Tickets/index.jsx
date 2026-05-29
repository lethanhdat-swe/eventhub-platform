import { useCallback, useEffect, useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { getErrorMessage } from '@/lib/http/apiError';
import { axiosInstance } from '@/lib/http/axiosInstance';
import { getApiData } from '@/lib/http/unwrapApiSuccess';
import { ticketService } from '@/lib/services/admin/ticketService';
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
import TicketDetailDialog from '@/pages/(admin)/Tickets/components/TicketDetailDialog';
import TicketTable from '@/pages/(admin)/Tickets/components/TicketTable';
import { mapTicketRow } from '@/pages/(admin)/Tickets/data';
import { toast } from 'sonner';

const PAGE_SIZE = 10;

function buildCheckInQuery(filter) {
  if (filter === 'checked') return true;
  if (filter === 'unchecked') return false;
  return undefined;
}

function Tickets() {
  const [tickets, setTickets] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [checkInFilter, setCheckInFilter] = useState('all');
  const [eventFilter, setEventFilter] = useState('all');
  const [eventFilterOptions, setEventFilterOptions] = useState([
    { value: 'all', label: 'Tất cả' },
  ]);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({
    totalItems: 0,
    totalPages: 1,
    currentPage: 1,
    itemsPerPage: PAGE_SIZE,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedIds, setSelectedIds] = useState(() => new Set());
  const [deleteDialog, setDeleteDialog] = useState(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailTicket, setDetailTicket] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const checkInFilterOptions = useMemo(
    () => [
      { value: 'all', label: 'Tất cả' },
      { value: 'checked', label: 'Đã check-in' },
      { value: 'unchecked', label: 'Chưa check-in' },
    ],
    []
  );

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
    }, 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, checkInFilter, eventFilter]);

  useEffect(() => {
    async function loadEventOptions() {
      try {
        const body = await axiosInstance.get('/api/events', {
          params: { page: 1, limit: 100 },
        });
        const payload = getApiData(body);
        const events = payload.data ?? [];
        setEventFilterOptions([
          { value: 'all', label: 'Tất cả' },
          ...events.map((event) => ({
            value: event.id,
            label: event.title,
          })),
        ]);
      } catch {
        setEventFilterOptions([{ value: 'all', label: 'Tất cả' }]);
      }
    }
    void loadEventOptions();
  }, []);

  const loadTickets = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const payload = await ticketService.list({
        page,
        limit: PAGE_SIZE,
        search: debouncedSearch,
        isCheckedIn: buildCheckInQuery(checkInFilter),
        eventId: eventFilter,
      });
      const rows = payload.data ?? [];
      setTickets(rows.map(mapTicketRow));
      const m = payload.meta ?? {};
      setMeta({
        totalItems: m.totalItems ?? 0,
        totalPages: Math.max(1, m.totalPages ?? 1),
        currentPage: m.currentPage ?? page,
        itemsPerPage: m.itemsPerPage ?? PAGE_SIZE,
      });
    } catch (e) {
      setError(getErrorMessage(e));
      setTickets([]);
    } finally {
      setIsLoading(false);
    }
  }, [page, debouncedSearch, checkInFilter, eventFilter]);

  useEffect(() => {
    void loadTickets();
  }, [loadTickets]);

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedIds(new Set(tickets.map((ticket) => ticket.id)));
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

  const handleCheckIn = async (ticket) => {
    setError(null);
    try {
      await ticketService.update(ticket.id, {
        isCheckedIn: true,
        checkedInAt: new Date().toISOString(),
      });
      toast.success(`Check-in thành công cho vé ${ticket.ticketCode}`);
      await loadTickets();
    } catch (e) {
      const message = getErrorMessage(e);
      setError(message);
      toast.error(message || 'Check-in thất bại');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteDialog || deleteSubmitting) return;

    setDeleteSubmitting(true);
    setError(null);
    try {
      if (deleteDialog.type === 'bulk') {
        await ticketService.deleteMany([...selectedIds]);
        setSelectedIds(new Set());
        toast.success(`Đã xóa ${selectedIds.size} vé`);
      } else {
        await ticketService.deleteOne(deleteDialog.ticket.id);
        setSelectedIds((prev) => {
          const next = new Set(prev);
          next.delete(deleteDialog.ticket.id);
          return next;
        });
        toast.success(`Đã xóa vé ${deleteDialog.ticket.ticketCode}`);
      }
      setDeleteDialog(null);
      await loadTickets();
    } catch (e) {
      const message = getErrorMessage(e);
      setError(message);
      toast.error(message || 'Xóa vé thất bại');
    } finally {
      setDeleteSubmitting(false);
    }
  };

  const handleView = async (ticket) => {
    setDetailOpen(true);
    setDetailTicket(null);
    setDetailLoading(true);
    setError(null);
    try {
      const full = await ticketService.getById(ticket.id);
      setDetailTicket(full);
    } catch (e) {
      const message = getErrorMessage(e);
      setDetailOpen(false);
      setError(message);
      toast.error(message || 'Không thể tải chi tiết vé');
    } finally {
      setDetailLoading(false);
    }
  };

  const handleDelete = (ticket) => {
    setDeleteDialog({ type: 'single', ticket });
  };

  const deleteDialogOpen = Boolean(deleteDialog);
  const deleteIsBulk = deleteDialog?.type === 'bulk';
  const deleteTicketCode = deleteDialog?.ticket?.ticketCode ?? '';

  const isEmpty = !isLoading && tickets.length === 0;

  return (
    <div className="space-y-4">
      <PageHeader
        title="Quản lý vé đã đặt"
        description="Theo dõi vé đã phát hành, trạng thái check-in và thông tin ghế."
      />

      {error && tickets.length > 0 ? (
        <div
          className="flex flex-col gap-2 px-3 py-2 border rounded-lg border-destructive/25 bg-destructive/5 sm:flex-row sm:items-center sm:justify-between"
          role="alert"
        >
          <p className="text-sm text-destructive">{error}</p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 shrink-0"
            onClick={() => void loadTickets()}
          >
            Thử lại
          </Button>
        </div>
      ) : null}

      <AdminToolbar
        searchPlaceholder="Tìm kiếm mã vé, đơn hàng, khách hàng..."
        searchValue={searchInput}
        onSearchChange={setSearchInput}
      >
        <AdminFilterDropdown
          label="Trạng thái check-in"
          options={checkInFilterOptions}
          value={checkInFilter}
          onChange={setCheckInFilter}
        />
        <AdminFilterDropdown
          label="Sự kiện"
          options={eventFilterOptions}
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
          className="px-3 h-9"
          disabled={selectedIds.size === 0}
          onClick={() => setDeleteDialog({ type: 'bulk' })}
        >
          Xóa đã chọn
        </Button>
      </AdminBulkActions>

      {isLoading ? (
        <AdminLoadingState rows={6} columns={8} minWidth="min-w-[1000px]" />
      ) : isEmpty ? (
        <AdminEmptyState
          {...(error
            ? {
                title: 'Không tải được danh sách',
                description: error,
                actionLabel: 'Thử lại',
                onAction: () => void loadTickets(),
              }
            : ADMIN_EMPTY_STATES.tickets)}
        />
      ) : (
        <>
          <TicketTable
            tickets={tickets}
            selectedIds={selectedIds}
            onSelectAll={handleSelectAll}
            onSelectRow={handleSelectRow}
            onView={handleView}
            onCheckIn={handleCheckIn}
            onDelete={handleDelete}
          />
          <AdminPagination
            currentPage={meta.currentPage}
            totalPages={meta.totalPages}
            totalItems={meta.totalItems}
            pageSize={meta.itemsPerPage}
            onPageChange={setPage}
          />
        </>
      )}

      <TicketDetailDialog
        open={detailOpen}
        onOpenChange={(isOpen) => {
          setDetailOpen(isOpen);
          if (!isOpen) setDetailTicket(null);
        }}
        ticket={detailTicket}
        loading={detailLoading}
      />

      <DeleteTicketDialog
        open={deleteDialogOpen}
        isBulk={deleteIsBulk}
        ticketCode={deleteTicketCode}
        selectedCount={selectedIds.size}
        isDeleting={deleteSubmitting}
        onConfirm={() => void handleDeleteConfirm()}
        onCancel={() => {
          if (!deleteSubmitting) setDeleteDialog(null);
        }}
      />
    </div>
  );
}

export default Tickets;
