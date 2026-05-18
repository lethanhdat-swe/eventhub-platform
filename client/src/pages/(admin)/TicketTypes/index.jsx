import { Plus } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { getErrorMessage } from '@/lib/http/apiError';
import { ticketTypeService } from '@/lib/services/admin/ticketTypeService';
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
import { DEFAULT_TICKET_COLOR, normalizeHexColor } from '@/pages/(admin)/TicketTypes/colorUtils';
import { mapTicketTypeRow } from '@/pages/(admin)/TicketTypes/data';

const PAGE_SIZE = 10;

function TicketTypes() {
  const [ticketTypes, setTicketTypes] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
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
  const [formDialog, setFormDialog] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
    }, 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const loadTicketTypes = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const payload = await ticketTypeService.list({
        page,
        limit: PAGE_SIZE,
        search: debouncedSearch,
      });
      const rows = payload.data ?? [];
      setTicketTypes(rows.map(mapTicketTypeRow));
      const m = payload.meta ?? {};
      setMeta({
        totalItems: m.totalItems ?? 0,
        totalPages: Math.max(1, m.totalPages ?? 1),
        currentPage: m.currentPage ?? page,
        itemsPerPage: m.itemsPerPage ?? PAGE_SIZE,
      });
    } catch (e) {
      setError(getErrorMessage(e));
      setTicketTypes([]);
    } finally {
      setIsLoading(false);
    }
  }, [page, debouncedSearch]);

  useEffect(() => {
    void loadTicketTypes();
  }, [loadTicketTypes]);

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedIds(new Set(ticketTypes.map((type) => type.id)));
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

  const handleSaveTicketType = async ({ name, price, color }) => {
    setError(null);
    const payload = {
      name,
      price,
      color: normalizeHexColor(color),
    };

    if (formDialog?.mode === 'create') {
      await ticketTypeService.create(payload);
      setFormDialog(null);
      await loadTicketTypes();
      return;
    }

    if (formDialog?.mode === 'edit' && formDialog.ticketType) {
      await ticketTypeService.update(formDialog.ticketType.id, payload);
      setFormDialog(null);
      await loadTicketTypes();
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteDialog || deleteSubmitting) return;

    setDeleteSubmitting(true);
    setError(null);
    try {
      if (deleteDialog.type === 'bulk') {
        await ticketTypeService.deleteMany([...selectedIds]);
        setSelectedIds(new Set());
      } else {
        const id = deleteDialog.ticketType.id;
        await ticketTypeService.deleteMany([id]);
        setSelectedIds((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      }
      setDeleteDialog(null);
      await loadTicketTypes();
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setDeleteSubmitting(false);
    }
  };

  const formDialogOpen = Boolean(formDialog);
  const formInitialValues =
    formDialog?.mode === 'edit'
      ? {
          name: formDialog.ticketType.name,
          price: formDialog.ticketType.price,
          color: formDialog.ticketType.color ?? DEFAULT_TICKET_COLOR,
        }
      : {
          name: '',
          price: '',
          color: DEFAULT_TICKET_COLOR,
        };

  const deleteDialogOpen = Boolean(deleteDialog);
  const deleteIsBulk = deleteDialog?.type === 'bulk';
  const deleteTypeName = deleteDialog?.ticketType?.name ?? '';

  const handleEdit = (ticketType) => {
    setFormDialog({ mode: 'edit', ticketType });
  };

  const handleDelete = (ticketType) => {
    setDeleteDialog({ type: 'single', ticketType });
  };

  const isEmpty = !isLoading && ticketTypes.length === 0;

  return (
    <div className="space-y-4">
      <PageHeader
        title="Quản lý loại vé"
        description="Quản lý các hạng vé, giá vé và cách áp dụng cho ghế/sự kiện."
        actionLabel="Thêm loại vé"
        actionIcon={<Plus className="size-4" />}
        onAction={() => setFormDialog({ mode: 'create' })}
      />

      {error && ticketTypes.length > 0 ? (
        <div
          className="flex flex-col gap-2 rounded-lg border border-destructive/25 bg-destructive/5 px-3 py-2 sm:flex-row sm:items-center sm:justify-between"
          role="alert"
        >
          <p className="text-sm text-destructive">{error}</p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 shrink-0"
            onClick={() => void loadTicketTypes()}
          >
            Thử lại
          </Button>
        </div>
      ) : null}

      <AdminToolbar
        searchPlaceholder="Tìm kiếm loại vé..."
        searchValue={searchInput}
        onSearchChange={setSearchInput}
      />

      <AdminBulkActions
        selectedCount={selectedIds.size}
        label={`Đã chọn ${selectedIds.size} loại vé`}
      >
        <Button
          type="button"
          variant="destructive"
          className="h-9 px-3"
          disabled={selectedIds.size === 0}
          onClick={() => setDeleteDialog({ type: 'bulk' })}
        >
          Xóa đã chọn
        </Button>
      </AdminBulkActions>

      {isLoading ? (
        <AdminLoadingState rows={6} columns={6} minWidth="min-w-[900px]" />
      ) : isEmpty ? (
        <AdminEmptyState
          {...(error
            ? {
                title: 'Không tải được danh sách',
                description: error,
                actionLabel: 'Thử lại',
                onAction: () => void loadTicketTypes(),
              }
            : {
                ...ADMIN_EMPTY_STATES.ticketTypes,
                onAction: () => setFormDialog({ mode: 'create' }),
              })}
        />
      ) : (
        <>
          <TicketTypeTable
            ticketTypes={ticketTypes}
            selectedIds={selectedIds}
            onSelectAll={handleSelectAll}
            onSelectRow={handleSelectRow}
            onEdit={handleEdit}
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
        isDeleting={deleteSubmitting}
        onConfirm={() => void handleDeleteConfirm()}
        onCancel={() => {
          if (!deleteSubmitting) setDeleteDialog(null);
        }}
      />
    </div>
  );
}

export default TicketTypes;
