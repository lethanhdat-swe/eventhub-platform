import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { getErrorMessage } from '@/lib/http/apiError';
import { contactService } from '@/lib/services/contact';
import PageHeader from '@/pages/(admin)/components/PageHeader';


import { toast } from 'sonner';
import { useContacts } from '@/hooks/useContacts';
import ContactBulkActions from './components/ContactBulkActions/ContactBulkActions';
import ContactContent from './components/ContactContent/ContactContent';
import ContactDialogs from './components/ContactDialogs/ContactDialogs';

function Contacts() {
  const {
    contacts,
    meta,
    isLoading,
    error,
    setError,

    selectedIds,
    setSelectedIds,

    setPage,

    loadContacts,

    handleSelectAll,
    handleSelectRow,
  } = useContacts();

  const [deleteDialog, setDeleteDialog] =
    useState(null);

  const [detailDialog, setDetailDialog] =
    useState({
      open: false,
      contact: null,
    });

  const handleViewDetail = (
    contact
  ) => {
    setDetailDialog({
      open: true,
      contact,
    });
  };

  const handleDelete = (
    contact
  ) => {
    setDeleteDialog({
      type: 'single',
      contact,
    });
  };

  const handleDeleteConfirm =
    async () => {
      if (!deleteDialog) {
        return;
      }

      setError(null);

      try {
        if (
          deleteDialog.type ===
          'bulk'
        ) {
          await Promise.all(
            [...selectedIds].map(
              (id) =>
                contactService.deleteOne(
                  id
                )
            )
          );

          toast.success(
            `Đã xóa ${selectedIds.size} liên hệ`
          );

          setSelectedIds(
            new Set()
          );
        } else {
          await contactService.deleteOne(
            deleteDialog.contact.id
          );

          setSelectedIds(
            (prev) => {
              const next =
                new Set(prev);

              next.delete(
                deleteDialog.contact.id
              );

              return next;
            }
          );

          toast.success(
            `Đã xóa liên hệ "${deleteDialog.contact.fullName}"`
          );
        }

        setDeleteDialog(null);

        await loadContacts();
      } catch (e) {
        const message =
          getErrorMessage(e);

        setError(message);

        toast.error(
          message ||
            'Xóa liên hệ thất bại'
        );
      }
    };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Quản lý liên hệ"
        description="Danh sách các liên hệ từ khách hàng gửi về."
      />

      {error &&
        contacts.length > 0 && (
          <div
            className="flex flex-col gap-2 px-3 py-2 border rounded-lg border-destructive/25 bg-destructive/5 sm:flex-row sm:items-center sm:justify-between"
            role="alert"
          >
            <p className="text-sm text-destructive">
              {error}
            </p>

            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 shrink-0"
              onClick={() =>
                void loadContacts()
              }
            >
              Thử lại
            </Button>
          </div>
        )}

      <ContactBulkActions
        selectedCount={
          selectedIds.size
        }
        onDelete={() =>
          setDeleteDialog({
            type: 'bulk',
          })
        }
      />

      <ContactContent
        contacts={contacts}
        meta={meta}
        error={error}
        isLoading={isLoading}
        selectedIds={
          selectedIds
        }
        onRetry={() =>
          void loadContacts()
        }
        onSelectAll={
          handleSelectAll
        }
        onSelectRow={
          handleSelectRow
        }
        onDelete={handleDelete}
        onViewDetail={
          handleViewDetail
        }
        onPageChange={setPage}
      />

      <ContactDialogs
        deleteDialog={
          deleteDialog
        }
        selectedCount={
          selectedIds.size
        }
        detailDialog={
          detailDialog
        }
        onDeleteConfirm={
          handleDeleteConfirm
        }
        onDeleteClose={() =>
          setDeleteDialog(null)
        }
        onDetailChange={(
          open
        ) =>
          setDetailDialog({
            open,
            contact: open
              ? detailDialog.contact
              : null,
          })
        }
      />
    </div>
  );
}

export default Contacts;