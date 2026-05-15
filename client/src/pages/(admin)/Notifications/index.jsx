import { Plus } from 'lucide-react';
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
import DeleteNotificationDialog from '@/pages/(admin)/Notifications/components/DeleteNotificationDialog';
import NotificationFormDialog from '@/pages/(admin)/Notifications/components/NotificationFormDialog';
import NotificationTable from '@/pages/(admin)/Notifications/components/NotificationTable';
import {
  filterNotifications,
  MOCK_NOTIFICATIONS,
} from '@/pages/(admin)/Notifications/data';

function createNotificationId() {
  return `ntf-${crypto.randomUUID().slice(0, 8)}`;
}

function Notifications() {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState(() => new Set());
  const [formDialog, setFormDialog] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(null);

  const filteredNotifications = useMemo(
    () => filterNotifications(notifications, searchQuery),
    [notifications, searchQuery]
  );

  const isLoading = false;
  const isEmpty = !isLoading && filteredNotifications.length === 0;

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedIds(
        new Set(filteredNotifications.map((item) => item.id))
      );
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

  const handleSaveNotification = ({
    title,
    shortContent,
    audience,
    channel,
    status,
  }) => {
    const now = new Date().toISOString();

    if (formDialog?.mode === 'create') {
      setNotifications((prev) => [
        ...prev,
        {
          id: createNotificationId(),
          title,
          shortContent,
          audience,
          channel,
          status,
          createdAt: now,
          updatedAt: now,
        },
      ]);
      setFormDialog(null);
      return;
    }

    if (formDialog?.mode === 'edit' && formDialog.notification) {
      setNotifications((prev) =>
        prev.map((item) =>
          item.id === formDialog.notification.id
            ? {
                ...item,
                title,
                shortContent,
                audience,
                channel,
                status,
                updatedAt: now,
              }
            : item
        )
      );
      setFormDialog(null);
    }
  };

  const handleResend = (notification) => {
    console.log('Gửi lại thông báo:', notification);
    setNotifications((prev) =>
      prev.map((item) =>
        item.id === notification.id
          ? {
              ...item,
              status: 'sent',
              updatedAt: new Date().toISOString(),
            }
          : item
      )
    );
  };

  const handleDeleteConfirm = () => {
    if (!deleteDialog) return;

    if (deleteDialog.type === 'bulk') {
      setNotifications((prev) =>
        prev.filter((item) => !selectedIds.has(item.id))
      );
      setSelectedIds(new Set());
      setDeleteDialog(null);
      return;
    }

    setNotifications((prev) =>
      prev.filter((item) => item.id !== deleteDialog.notification.id)
    );
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(deleteDialog.notification.id);
      return next;
    });
    setDeleteDialog(null);
  };

  const formDialogOpen = Boolean(formDialog);
  const formInitialValues =
    formDialog?.mode === 'edit'
      ? { ...formDialog.notification }
      : {
          title: '',
          shortContent: '',
          audience: 'all',
          channel: 'in_app',
          status: 'draft',
        };

  const deleteDialogOpen = Boolean(deleteDialog);
  const deleteIsBulk = deleteDialog?.type === 'bulk';
  const deleteNotificationTitle = deleteDialog?.notification?.title ?? '';

  return (
    <div className="space-y-4">
      <PageHeader
        title="Thông báo"
        description="Soạn và quản lý thông báo gửi đến người dùng trong hệ thống."
        actionLabel="Tạo thông báo"
        actionIcon={<Plus className="size-4" />}
        onAction={() => setFormDialog({ mode: 'create' })}
      />

      <AdminToolbar
        searchPlaceholder="Tìm kiếm tiêu đề thông báo..."
        onSearchChange={setSearchQuery}
      >
        <Button type="button" variant="outline" className="h-9 px-3 text-sm">
          Đối tượng
        </Button>
        <Button type="button" variant="outline" className="h-9 px-3 text-sm">
          Trạng thái
        </Button>
      </AdminToolbar>

            <AdminBulkActions
        selectedCount={selectedIds.size}
        label={`Đã chọn ${selectedIds.size} thông báo`}
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
        <AdminLoadingState rows={6} columns={8} minWidth="min-w-[960px]" />
      ) : isEmpty ? (
        <AdminEmptyState
          {...ADMIN_EMPTY_STATES.notifications}
          onAction={() => setFormDialog({ mode: 'create' })}
        />
      ) : (
        <>
          <NotificationTable
                  notifications={filteredNotifications}
                  selectedIds={selectedIds}
                  onSelectAll={handleSelectAll}
                  onSelectRow={handleSelectRow}
                  onView={(item) => console.log('Xem chi tiết thông báo:', item)}
                  onEdit={(item) => setFormDialog({ mode: 'edit', notification: item })}
                  onResend={handleResend}
                  onDelete={(item) =>
                    setDeleteDialog({ type: 'single', notification: item })
                  }
                />
          <AdminPagination
            currentPage={1}
            totalPages={1}
            totalItems={filteredNotifications.length}
            pageSize={10}
          />
        </>
      )}


      <NotificationFormDialog
        open={formDialogOpen}
        mode={formDialog?.mode ?? 'create'}
        initialValues={formInitialValues}
        onOpenChange={(isOpen) => {
          if (!isOpen) setFormDialog(null);
        }}
        onSave={handleSaveNotification}
      />

      <DeleteNotificationDialog
        open={deleteDialogOpen}
        isBulk={deleteIsBulk}
        notificationTitle={deleteNotificationTitle}
        selectedCount={selectedIds.size}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteDialog(null)}
      />
    </div>
  );
}

export default Notifications;
