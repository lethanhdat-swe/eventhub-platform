import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';

import PageHeader from '@/pages/(admin)/components/PageHeader';

import { getErrorMessage } from '@/lib/http/apiError';
import { ticketTypeService } from '@/lib/services/admin/ticketTypeService';

import {
  DEFAULT_TICKET_COLOR,
  normalizeHexColor,
} from './colorUtils';

import { toast } from 'sonner';
import { useTicketTypes } from '@/hooks/useTicketTypes';
import TicketTypeErrorAlert from './components/TicketTypeErrorAlert/TicketTypeErrorAlert';
import TicketTypeToolbar from './components/TicketTypeToolbar/TicketTypeToolbar';
import TicketTypeBulkActions from './components/TicketTypeBulkActions/TicketTypeBulkActions';
import TicketTypeContent from './components/TicketTypeContent/TicketTypeContent';
import TicketTypeFormDialog from './components/TicketTypeFormDialog/TicketTypeFormDialog';
import DeleteTicketTypeDialog from './components/DeleteTicketTypeDialog/DeleteTicketTypeDialog';

function TicketTypes() {
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const [page, setPage] = useState(1);

  const [selectedIds, setSelectedIds] = useState(
    () => new Set()
  );

  const [formDialog, setFormDialog] =
    useState(null);

  const [deleteDialog, setDeleteDialog] =
    useState(null);

  const [deleteSubmitting, setDeleteSubmitting] =
    useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchInput]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const {
    ticketTypes,
    meta,
    loading,
    error,
    setError,
    loadTicketTypes,
  } = useTicketTypes(page, debouncedSearch);

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedIds(
        new Set(
          ticketTypes.map((item) => item.id)
        )
      );
      return;
    }

    setSelectedIds(new Set());
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

  const handleEdit = (ticketType) => {
    setFormDialog({
      mode: 'edit',
      ticketType,
    });
  };

  const handleDelete = (ticketType) => {
    setDeleteDialog({
      type: 'single',
      ticketType,
    });
  };

  const handleSaveTicketType = async ({
    name,
    price,
    color,
  }) => {
    setError(null);

    const payload = {
      name,
      price,
      color: normalizeHexColor(color),
    };

    try {
      if (formDialog?.mode === 'create') {
        await ticketTypeService.create(payload);

        toast.success(
          'Tạo loại vé thành công'
        );

        setFormDialog(null);

        await loadTicketTypes();

        return;
      }

      if (
        formDialog?.mode === 'edit' &&
        formDialog.ticketType
      ) {
        await ticketTypeService.update(
          formDialog.ticketType.id,
          payload
        );

        toast.success(
          'Cập nhật loại vé thành công'
        );

        setFormDialog(null);

        await loadTicketTypes();
      }
    } catch (e) {
      const message = getErrorMessage(e);

      setError(message);

      toast.error(
        message || 'Có lỗi xảy ra'
      );
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteDialog || deleteSubmitting)
      return;

    setDeleteSubmitting(true);
    setError(null);

    try {
      if (deleteDialog.type === 'bulk') {
        await ticketTypeService.deleteMany([
          ...selectedIds,
        ]);

        toast.success(
          `Đã xóa ${selectedIds.size} loại vé`
        );

        setSelectedIds(new Set());
      } else {
        const id =
          deleteDialog.ticketType.id;

        await ticketTypeService.deleteMany([
          id,
        ]);

        setSelectedIds((prev) => {
          const next = new Set(prev);

          next.delete(id);

          return next;
        });

        toast.success(
          `Đã xóa loại vé "${deleteDialog.ticketType.name}"`
        );
      }

      setDeleteDialog(null);

      await loadTicketTypes();
    } catch (e) {
      const message = getErrorMessage(e);

      setError(message);

      toast.error(
        message || 'Xóa loại vé thất bại'
      );
    } finally {
      setDeleteSubmitting(false);
    }
  };

  const formDialogOpen =
    Boolean(formDialog);

  const formInitialValues =
    formDialog?.mode === 'edit'
      ? {
          name: formDialog.ticketType.name,
          price: formDialog.ticketType.price,
          color:
            formDialog.ticketType.color ??
            DEFAULT_TICKET_COLOR,
        }
      : {
          name: '',
          price: '',
          color: DEFAULT_TICKET_COLOR,
        };

  const deleteDialogOpen =
    Boolean(deleteDialog);

  const deleteIsBulk =
    deleteDialog?.type === 'bulk';

  const deleteTypeName =
    deleteDialog?.ticketType?.name ?? '';

  return (
    <div className="space-y-4">
      <PageHeader
        title="Quản lý loại vé"
        description="Quản lý các hạng vé, giá vé và cách áp dụng cho ghế/sự kiện."
        actionLabel="Thêm loại vé"
        actionIcon={
          <Plus className="size-4" />
        }
        onAction={() =>
          setFormDialog({
            mode: 'create',
          })
        }
      />

      <TicketTypeErrorAlert
        error={error}
        hasData={ticketTypes.length > 0}
        onRetry={() =>
          void loadTicketTypes()
        }
      />

      <TicketTypeToolbar
        searchInput={searchInput}
        setSearchInput={setSearchInput}
      />

      <TicketTypeBulkActions
        selectedCount={selectedIds.size}
        onDelete={() =>
          setDeleteDialog({
            type: 'bulk',
          })
        }
      />

      <TicketTypeContent
        loading={loading}
        error={error}
        ticketTypes={ticketTypes}
        meta={meta}
        selectedIds={selectedIds}
        onRetry={() =>
          void loadTicketTypes()
        }
        onSelectAll={handleSelectAll}
        onSelectRow={handleSelectRow}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onCreate={() =>
          setFormDialog({
            mode: 'create',
          })
        }
        onPageChange={setPage}
      />

      <TicketTypeFormDialog
        open={formDialogOpen}
        mode={
          formDialog?.mode ?? 'create'
        }
        initialValues={formInitialValues}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setFormDialog(null);
          }
        }}
        onSave={handleSaveTicketType}
      />

      <DeleteTicketTypeDialog
        open={deleteDialogOpen}
        isBulk={deleteIsBulk}
        typeName={deleteTypeName}
        selectedCount={selectedIds.size}
        isDeleting={deleteSubmitting}
        onConfirm={() =>
          void handleDeleteConfirm()
        }
        onCancel={() => {
          if (!deleteSubmitting) {
            setDeleteDialog(null);
          }
        }}
      />
    </div>
  );
}

export default TicketTypes;