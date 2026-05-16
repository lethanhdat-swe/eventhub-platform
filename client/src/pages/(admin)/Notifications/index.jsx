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
import DeleteNotificationDialog from '@/pages/(admin)/Notifications/components/DeleteNotificationDialog';
import NotificationFormDialog from '@/pages/(admin)/Notifications/components/NotificationFormDialog';
import NotificationTable from '@/pages/(admin)/Notifications/components/NotificationTable';
import {
  filterNotifications,
  MOCK_NOTIFICATIONS,
  NOTIFICATION_AUDIENCE_OPTIONS,
  NOTIFICATION_STATUS_OPTIONS,
} from '@/pages/(admin)/Notifications/data';

function createNotificationId() {
  return `ntf-${crypto.randomUUID().slice(0, 8)}`;
}

function Notifications() {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [audienceFilter, setAudienceFilter] = useState('__all__');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedIds, setSelectedIds] = useState(() => new Set());
  const [formDialog, setFormDialog] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(null);

  const notificationAudienceFilterOptions = useMemo(
    () => [
      { value: '__all__', label: 'Tất cả' },
      ...NOTIFICATION_AUDIENCE_OPTIONS.map((o) => ({
        value: o.value,
        label: o.label,
      })),
    ],
    []
  );

  const notificationStatusFilterOptions = useMemo(
    () => [
      { value: 'all', label: 'Tất cả' },
      ...NOTIFICATION_STATUS_OPTIONS.map((o) => ({
        value: o.value,
        label: o.label,
      })),
    ],
    []
  );

  const filteredNotifications = useMemo(
    () =>
      filterNotifications(notifications, searchQuery, {
        audience: audienceFilter,
        status: statusFilter,
      }),
    [notifications, searchQuery, audienceFilter, statusFilter]
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

  const handleView = (notification) => {
    console.log('[Notification detail]', notification);
  };

  const handleEdit = (notification) => {
    setFormDialog({ mode: 'edit', notification });
  };

  const handleDelete = (notification) => {
    setDeleteDialog({ type: 'single', notification });
  };

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
        <AdminFilterDropdown
          label="Đối tượng"
          options={notificationAudienceFilterOptions}
          value={audienceFilter}
          onChange={setAudienceFilter}
        />
        <AdminFilterDropdown
          label="Trạng thái"
          options={notificationStatusFilterOptions}
          value={statusFilter}
          onChange={setStatusFilter}
        />
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
                  onView={handleView}
                  onEdit={handleEdit}
                  onResend={handleResend}
                  onDelete={handleDelete}
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
