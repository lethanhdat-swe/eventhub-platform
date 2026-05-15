import { Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
import DeleteTicketTypeDialog from '@/pages/(admin)/TicketTypes/components/DeleteTicketTypeDialog';
import TicketTypeFormDialog from '@/pages/(admin)/TicketTypes/components/TicketTypeFormDialog';
import TicketTypeTable from '@/pages/(admin)/TicketTypes/components/TicketTypeTable';
import {
  filterTicketTypes,
  MOCK_TICKET_TYPES,
} from '@/pages/(admin)/TicketTypes/data';

function createTicketTypeId() {
  return `tt-${crypto.randomUUID().slice(0, 8)}`;
}

function TicketTypes() {
  const navigate = useNavigate();
  const [ticketTypes, setTicketTypes] = useState(MOCK_TICKET_TYPES);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState(() => new Set());
  const [formDialog, setFormDialog] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(null);

  const filteredTicketTypes = useMemo(
    () => filterTicketTypes(ticketTypes, searchQuery),
    [ticketTypes, searchQuery]
  );

  const isLoading = false;
  const isEmpty = !isLoading && filteredTicketTypes.length === 0;

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedIds(new Set(filteredTicketTypes.map((type) => type.id)));
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

  const handleSaveTicketType = ({ name, price, status, description }) => {
    if (formDialog?.mode === 'create') {
      setTicketTypes((prev) => [
        ...prev,
        {
          id: createTicketTypeId(),
          name,
          price,
          status,
          description,
          defaultSeatCount: 0,
          eventSeatCount: 0,
        },
      ]);
      setFormDialog(null);
      return;
    }

    if (formDialog?.mode === 'edit' && formDialog.ticketType) {
      setTicketTypes((prev) =>
        prev.map((type) =>
          type.id === formDialog.ticketType.id
            ? { ...type, name, price, status, description }
            : type
        )
      );
      setFormDialog(null);
    }
  };

  const handleDeleteConfirm = () => {
    if (!deleteDialog) return;

    if (deleteDialog.type === 'bulk') {
      setTicketTypes((prev) =>
        prev.filter((type) => !selectedIds.has(type.id))
      );
      setSelectedIds(new Set());
      setDeleteDialog(null);
      return;
    }

    setTicketTypes((prev) =>
      prev.filter((type) => type.id !== deleteDialog.ticketType.id)
    );
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(deleteDialog.ticketType.id);
      return next;
    });
    setDeleteDialog(null);
  };

  const formDialogOpen = Boolean(formDialog);
  const formInitialValues =
    formDialog?.mode === 'edit'
      ? {
          name: formDialog.ticketType.name,
          price: formDialog.ticketType.price,
          status: formDialog.ticketType.status,
          description: formDialog.ticketType.description ?? '',
        }
      : {
          name: '',
          price: '',
          status: 'active',
          description: '',
        };

  const deleteDialogOpen = Boolean(deleteDialog);
  const deleteIsBulk = deleteDialog?.type === 'bulk';
  const deleteTypeName = deleteDialog?.ticketType?.name ?? '';

  return (
    <div className="space-y-4">
      <PageHeader
        title="Quản lý loại vé"
        description="Quản lý các hạng vé, giá vé và cách áp dụng cho ghế/sự kiện."
        actionLabel="Thêm loại vé"
        actionIcon={<Plus className="size-4" />}
        onAction={() => setFormDialog({ mode: 'create' })}
      />

      <AdminToolbar
        searchPlaceholder="Tìm kiếm loại vé..."
        onSearchChange={setSearchQuery}
      >
        <Button type="button" variant="outline" className="h-9 px-3 text-sm">
          Khoảng giá
        </Button>
      </AdminToolbar>

            <AdminBulkActions
        selectedCount={selectedIds.size}
        label={`Đã chọn ${selectedIds.size} loại vé`}
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
        <AdminLoadingState rows={6} columns={6} minWidth="min-w-[800px]" />
      ) : isEmpty ? (
        <AdminEmptyState
          {...ADMIN_EMPTY_STATES.ticketTypes}
          onAction={() => setFormDialog({ mode: 'create' })}
        />
      ) : (
        <>
          <TicketTypeTable
                  ticketTypes={filteredTicketTypes}
                  selectedIds={selectedIds}
                  onSelectAll={handleSelectAll}
                  onSelectRow={handleSelectRow}
                  onEdit={(ticketType) => setFormDialog({ mode: 'edit', ticketType })}
                  onViewSeats={() => navigate('/admin/default-seats')}
                  onDelete={(ticketType) =>
                    setDeleteDialog({ type: 'single', ticketType })
                  }
                />
          <AdminPagination
            currentPage={1}
            totalPages={1}
            totalItems={filteredTicketTypes.length}
            pageSize={10}
          />
        </>
      )}


      <TicketTypeFormDialog
        open={formDialogOpen}
        mode={formDialog?.mode ?? 'create'}
        initialValues={formInitialValues}
        onOpenChange={(isOpen) => {
          if (!isOpen) setFormDialog(null);
        }}
        onSave={handleSaveTicketType}
      />

      <DeleteTicketTypeDialog
        open={deleteDialogOpen}
        isBulk={deleteIsBulk}
        typeName={deleteTypeName}
        selectedCount={selectedIds.size}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteDialog(null)}
      />
    </div>
  );
}

export default TicketTypes;
