import { useCallback, useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { getErrorMessage } from '@/lib/http/apiError';
import { contactService } from '@/lib/services/contact';
import {
  AdminBulkActions,
  AdminEmptyState,
  AdminLoadingState,
  AdminPagination,
  ADMIN_EMPTY_STATES,
} from '@/pages/(admin)/components/table';
import PageHeader from '@/pages/(admin)/components/PageHeader';
import ContactTable from './components/ContactTable/ContactTable';
import DeleteContactDialog from './components/DeleteContactDialog/DeleteContactDialog';
import ContactDetailDialog from './components/ContactDetailDialog/ContactDetailDialog';
import { toast } from 'sonner';

const PAGE_SIZE = 10;

function Contacts() {
  const [contacts, setContacts] = useState([]);
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
  const [detailDialog, setDetailDialog] = useState({
    open: false,
    contact: null,
    });

  const loadContacts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const payload = await contactService.list({ page, limit: PAGE_SIZE });
      setContacts(payload.items ?? []);
      const m = payload.meta ?? {};
      setMeta({
        totalItems: m.totalItems ?? 0,
        totalPages: Math.max(1, m.totalPages ?? 1),
        currentPage: m.currentPage ?? page,
        itemsPerPage: m.itemsPerPage ?? PAGE_SIZE,
      });
    } catch (e) {
      setError(getErrorMessage(e));
      setContacts([]);
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  useEffect(() => {
    loadContacts();
  }, [loadContacts]);

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedIds(new Set(contacts.map((c) => c.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleViewDetail = (contact) => {
    setDetailDialog({
        open: true,
        contact,
    });
    };

  const handleSelectRow = (id, checked) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteDialog) return;
    setError(null);
    try {
      if (deleteDialog.type === 'bulk') {
        await Promise.all([...selectedIds].map((id) => contactService.deleteOne(id)));
        setSelectedIds(new Set());
        toast.success(`Đã xóa ${selectedIds.size} liên hệ`);
      } else {
        await contactService.deleteOne(deleteDialog.contact.id);
        setSelectedIds((prev) => {
          const next = new Set(prev);
          next.delete(deleteDialog.contact.id);
          return next;
        });
        toast.success(`Đã xóa liên hệ "${deleteDialog.contact.fullName}"`);
      }
      setDeleteDialog(null);
      await loadContacts();
    } catch (e) {
      const message = getErrorMessage(e);
      setError(message);
      toast.error(message || 'Xóa liên hệ thất bại');
    }
  };

  const handleDelete = (contact) => {
    setDeleteDialog({ type: 'single', contact });
  };

  const deleteDialogOpen = Boolean(deleteDialog);
  const deleteIsBulk = deleteDialog?.type === 'bulk';
  const deleteContactName = deleteDialog?.contact?.fullName ?? '';

  return (
    <div className="space-y-4">
      <PageHeader
        title="Quản lý liên hệ"
        description="Danh sách các liên hệ từ khách hàng gửi về."
      />

      {error && contacts.length > 0 && (
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
            onClick={loadContacts}
          >
            Thử lại
          </Button>
        </div>
      )}

      <AdminBulkActions
        selectedCount={selectedIds.size}
        label={`Đã chọn ${selectedIds.size} liên hệ`}
      >
        <Button
          type="button"
          variant="destructive"
          className="px-3 h-9"
          onClick={() => setDeleteDialog({ type: 'bulk' })}
        >
          Xóa đã chọn
        </Button>
      </AdminBulkActions>

      {isLoading ? (
        <AdminLoadingState rows={6} columns={6} minWidth="min-w-[800px]" />
      ) : contacts.length === 0 ? (
        <AdminEmptyState
          {...(error
            ? {
                title: 'Không tải được danh sách',
                description: error,
                actionLabel: 'Thử lại',
                onAction: loadContacts,
              }
            : ADMIN_EMPTY_STATES.contacts)}
        />
      ) : (
        <>
          <ContactTable
            contacts={contacts}
            selectedIds={selectedIds}
            onSelectAll={handleSelectAll}
            onSelectRow={handleSelectRow}
            onDelete={handleDelete}
            onViewDetail={handleViewDetail}
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

      <DeleteContactDialog
        open={deleteDialogOpen}
        isBulk={deleteIsBulk}
        contactName={deleteContactName}
        selectedCount={selectedIds.size}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteDialog(null)}
      />

      <ContactDetailDialog
        open={detailDialog.open}
        onOpenChange={(open) =>
            setDetailDialog({
            open,
            contact: open ? detailDialog.contact : null,
            })
        }
        contact={detailDialog.contact}
        loading={false}
        />
    </div>
  );
}

export default Contacts;