import { Plus } from 'lucide-react';
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
import DeleteSeatDialog from '@/pages/(admin)/DefaultSeats/components/DeleteSeatDialog';
import SeatFormDialog from '@/pages/(admin)/DefaultSeats/components/SeatFormDialog';
import SeatTable from '@/pages/(admin)/DefaultSeats/components/SeatTable';
import {
  buildSeatLabel,
  filterSeats,
  getTicketTypeById,
  MOCK_SEATS,
  TICKET_TYPE_OPTIONS,
} from '@/pages/(admin)/DefaultSeats/data';

function createSeatId() {
  return `seat-${crypto.randomUUID().slice(0, 8)}`;
}

function buildSeatFromForm({ rowLabel, seatNumber, defaultTicketTypeId, status }) {
  const ticketType = getTicketTypeById(defaultTicketTypeId);
  return {
    rowLabel,
    seatNumber,
    seatLabel: buildSeatLabel(rowLabel, seatNumber),
    defaultTicketTypeId,
    defaultTicketType: ticketType
      ? { id: ticketType.id, name: ticketType.name, price: ticketType.price }
      : null,
    price: ticketType?.price ?? 0,
    status,
  };
}

function DefaultSeats() {
  const [seats, setSeats] = useState(MOCK_SEATS);
  const [searchQuery, setSearchQuery] = useState('');
  const [rowFilter, setRowFilter] = useState('all');
  const [ticketTypeFilter, setTicketTypeFilter] = useState('all');
  const [selectedIds, setSelectedIds] = useState(() => new Set());
  const [formDialog, setFormDialog] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(null);

  const rowFilterOptions = useMemo(() => {
    const rows = [...new Set(seats.map((s) => s.rowLabel))].sort();
    return [
      { value: 'all', label: 'Tất cả' },
      ...rows.map((row) => ({ value: row, label: `Hàng ${row}` })),
    ];
  }, [seats]);

  const ticketTypeFilterOptions = useMemo(
    () => [
      { value: 'all', label: 'Tất cả' },
      ...TICKET_TYPE_OPTIONS.map((t) => ({ value: t.id, label: t.name })),
    ],
    []
  );

  const filteredSeats = useMemo(
    () =>
      filterSeats(seats, searchQuery, {
        rowLabel: rowFilter,
        ticketTypeId: ticketTypeFilter,
      }),
    [seats, searchQuery, rowFilter, ticketTypeFilter]
  );

  const isLoading = false;
  const isEmpty = !isLoading && filteredSeats.length === 0;

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedIds(new Set(filteredSeats.map((seat) => seat.id)));
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

  const handleSaveSeat = (formValues) => {
    const seatData = buildSeatFromForm(formValues);

    if (formDialog?.mode === 'create') {
      setSeats((prev) => [...prev, { id: createSeatId(), ...seatData }]);
      setFormDialog(null);
      return;
    }

    if (formDialog?.mode === 'edit' && formDialog.seat) {
      setSeats((prev) =>
        prev.map((seat) =>
          seat.id === formDialog.seat.id ? { ...seat, ...seatData } : seat
        )
      );
      setFormDialog(null);
    }
  };

  const handleDuplicate = (seat) => {
    const nextNumber = seat.seatNumber + 1;
    const duplicate = buildSeatFromForm({
      rowLabel: seat.rowLabel,
      seatNumber: nextNumber,
      defaultTicketTypeId: seat.defaultTicketTypeId,
      status: seat.status,
    });
    setSeats((prev) => [...prev, { id: createSeatId(), ...duplicate }]);
  };

  const handleDeleteConfirm = () => {
    if (!deleteDialog) return;

    if (deleteDialog.type === 'bulk') {
      setSeats((prev) => prev.filter((seat) => !selectedIds.has(seat.id)));
      setSelectedIds(new Set());
      setDeleteDialog(null);
      return;
    }

    setSeats((prev) => prev.filter((seat) => seat.id !== deleteDialog.seat.id));
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(deleteDialog.seat.id);
      return next;
    });
    setDeleteDialog(null);
  };

  const formDialogOpen = Boolean(formDialog);
  const formInitialValues =
    formDialog?.mode === 'edit'
      ? {
          rowLabel: formDialog.seat.rowLabel,
          seatNumber: formDialog.seat.seatNumber,
          defaultTicketTypeId: formDialog.seat.defaultTicketTypeId,
          status: formDialog.seat.status,
        }
      : {
          rowLabel: '',
          seatNumber: '',
          defaultTicketTypeId: 'tt-std',
          status: 'active',
        };

  const deleteDialogOpen = Boolean(deleteDialog);
  const deleteIsBulk = deleteDialog?.type === 'bulk';
  const deleteSeatLabel = deleteDialog?.seat?.seatLabel ?? '';

  const handleView = (seat) => {
    console.log('[Seat detail]', seat);
  };

  const handleEdit = (seat) => {
    setFormDialog({ mode: 'edit', seat });
  };

  const handleToggleStatus = (seat) => {
    const nextStatus =
      seat.status === 'active' ? 'draft' : 'active';
    setSeats((prev) =>
      prev.map((item) =>
        item.id === seat.id ? { ...item, status: nextStatus } : item
      )
    );
  };

  const handleDelete = (seat) => {
    setDeleteDialog({ type: 'single', seat });
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Quản lý ghế ngồi mặc định"
        description="Thiết lập sơ đồ ghế mặc định và loại vé tương ứng cho từng ghế."
        actionLabel="Thêm ghế"
        actionIcon={<Plus className="size-4" />}
        onAction={() => setFormDialog({ mode: 'create' })}
      />

      <AdminToolbar
        searchPlaceholder="Tìm kiếm ghế..."
        onSearchChange={setSearchQuery}
      >
        <AdminFilterDropdown
          label="Hàng ghế"
          options={rowFilterOptions}
          value={rowFilter}
          onChange={setRowFilter}
        />
        <AdminFilterDropdown
          label="Loại vé"
          options={ticketTypeFilterOptions}
          value={ticketTypeFilter}
          onChange={setTicketTypeFilter}
        />
      </AdminToolbar>

            <AdminBulkActions
        selectedCount={selectedIds.size}
        label={`Đã chọn ${selectedIds.size} ghế`}
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
        <AdminLoadingState rows={6} columns={7} minWidth="min-w-[800px]" />
      ) : isEmpty ? (
        <AdminEmptyState
          {...ADMIN_EMPTY_STATES.defaultSeats}
          onAction={() => setFormDialog({ mode: 'create' })}
        />
      ) : (
        <>
          <SeatTable
                  seats={filteredSeats}
                  selectedIds={selectedIds}
                  onSelectAll={handleSelectAll}
                  onSelectRow={handleSelectRow}
                  onView={handleView}
                  onEdit={handleEdit}
                  onToggleStatus={handleToggleStatus}
                  onDuplicate={handleDuplicate}
                  onDelete={handleDelete}
                />
          <AdminPagination
            currentPage={1}
            totalPages={1}
            totalItems={filteredSeats.length}
            pageSize={10}
          />
        </>
      )}


      <SeatFormDialog
        open={formDialogOpen}
        mode={formDialog?.mode ?? 'create'}
        initialValues={formInitialValues}
        onOpenChange={(isOpen) => {
          if (!isOpen) setFormDialog(null);
        }}
        onSave={handleSaveSeat}
      />

      <DeleteSeatDialog
        open={deleteDialogOpen}
        isBulk={deleteIsBulk}
        seatLabel={deleteSeatLabel}
        selectedCount={selectedIds.size}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteDialog(null)}
      />
    </div>
  );
}

export default DefaultSeats;
