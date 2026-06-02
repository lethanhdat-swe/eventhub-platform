import { useEffect, useState } from 'react';
import PageHeader from '@/pages/(admin)/components/PageHeader';

import { getErrorMessage } from '@/lib/http/apiError';
import { userService } from '@/lib/services/admin/userService';
import { toast } from 'sonner';
import { useUsers } from '@/hooks/useUsers';
import UserErrorAlert from './components/UserErrorAlert/UserErrorAlert';
import UserFilters from './components/UserFilters/UserFilters';
import UserBulkActions from './components/UserBulkActions/UserBulkActions';
import UserContent from './components/UserContent/UserContent';
import UserRoleDialog from './components/UserRoleDialog/UserRoleDialog';
import DeleteUserDialog from './components/DeleteUserDialog/DeleteUserDialog';
import UserDetailDialog from './components/UserDetailDialog/UserDetailDialog';

function Users() {
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] =
    useState('');

  const [roleFilter, setRoleFilter] =
    useState('all');

  const [emailFilter, setEmailFilter] =
    useState('all');

  const [page, setPage] = useState(1);

  const [selectedIds, setSelectedIds] =
    useState(() => new Set());

  const [roleDialogUser,
    setRoleDialogUser] =
    useState(null);

  const [deleteDialog,
    setDeleteDialog] =
    useState(null);

  const [detailOpen,
    setDetailOpen] =
    useState(false);

  const [detailUser,
    setDetailUser] =
    useState(null);

  const [detailLoading,
    setDetailLoading] =
    useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(
        searchInput.trim()
      );
    }, 300);

    return () =>
      clearTimeout(timeout);
  }, [searchInput]);

  useEffect(() => {
    setPage(1);
  }, [
    debouncedSearch,
    roleFilter,
    emailFilter,
  ]);

  const {
    users,
    meta,
    loading,
    error,
    setError,
    loadUsers,
  } = useUsers({
    page,
    search: debouncedSearch,
    roleFilter,
    emailFilter,
  });

  const handleSelectAll = (
    checked
  ) => {
    if (checked) {
      setSelectedIds(
        new Set(
          users.map(
            (user) => user.id
          )
        )
      );
      return;
    }

    setSelectedIds(new Set());
  };

  const handleSelectRow = (
    id,
    checked
  ) => {
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

  const handleSaveRole =
    async (role) => {
      if (!roleDialogUser) return;

      try {
        setError(null);

        await userService.changeRole({
          userId:
            roleDialogUser.id,
          role,
        });

        toast.success(
          `Đã cập nhật vai trò của "${roleDialogUser.name}"`
        );

        setRoleDialogUser(null);

        await loadUsers();
      } catch (e) {
        const message =
          getErrorMessage(e);

        setError(message);

        toast.error(
          message ||
            'Cập nhật vai trò thất bại'
        );

        throw e;
      }
    };

  const handleDeleteConfirm =
    async () => {
      if (!deleteDialog) return;

      try {
        setError(null);

        if (
          deleteDialog.type ===
          'bulk'
        ) {
          await userService.deleteMany(
            [...selectedIds]
          );

          toast.success(
            `Đã xóa ${selectedIds.size} người dùng`
          );

          setSelectedIds(
            new Set()
          );
        } else {
          await userService.deleteMany(
            [
              deleteDialog.user.id,
            ]
          );

          setSelectedIds(
            (prev) => {
              const next =
                new Set(prev);

              next.delete(
                deleteDialog.user.id
              );

              return next;
            }
          );

          toast.success(
            `Đã xóa người dùng "${deleteDialog.user.name}"`
          );
        }

        setDeleteDialog(null);

        await loadUsers();
      } catch (e) {
        const message =
          getErrorMessage(e);

        setError(message);

        toast.error(
          message ||
            'Xóa người dùng thất bại'
        );
      }
    };

  const handleNotifySelected =
    () => {
      console.log(
        'Gửi thông báo cho users:',
        [...selectedIds]
      );
    };

  const handleView = async (
    user
  ) => {
    setDetailOpen(true);
    setDetailUser(null);
    setDetailLoading(true);

    try {
      setError(null);

      const detail =
        await userService.getById(
          user.id
        );

      setDetailUser(detail);
    } catch (e) {
      setDetailOpen(false);

      setError(
        getErrorMessage(e)
      );
    } finally {
      setDetailLoading(false);
    }
  };

  const handleEdit = (
    user
  ) => {
    setRoleDialogUser(user);
  };

  const handleDelete = (
    user
  ) => {
    setDeleteDialog({
      type: 'single',
      user,
    });
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Quản lý người dùng"
        description="Quản lý tài khoản khách hàng, quyền truy cập và trạng thái xác thực email."
      />

      <UserErrorAlert
        error={error}
        hasData={
          users.length > 0
        }
        onRetry={() =>
          void loadUsers()
        }
      />

      <UserFilters
        searchInput={
          searchInput
        }
        setSearchInput={
          setSearchInput
        }
        roleFilter={
          roleFilter
        }
        setRoleFilter={
          setRoleFilter
        }
        emailFilter={
          emailFilter
        }
        setEmailFilter={
          setEmailFilter
        }
      />

      <UserBulkActions
        selectedCount={
          selectedIds.size
        }
        onNotify={
          handleNotifySelected
        }
        onDelete={() =>
          setDeleteDialog({
            type: 'bulk',
          })
        }
      />

      <UserContent
        loading={loading}
        error={error}
        users={users}
        meta={meta}
        selectedIds={
          selectedIds
        }
        onRetry={() =>
          void loadUsers()
        }
        onSelectAll={
          handleSelectAll
        }
        onSelectRow={
          handleSelectRow
        }
        onView={handleView}
        onEdit={handleEdit}
        onDelete={
          handleDelete
        }
        onPageChange={
          setPage
        }
      />

      <UserRoleDialog
        open={Boolean(
          roleDialogUser
        )}
        user={roleDialogUser}
        onOpenChange={(
          open
        ) => {
          if (!open) {
            setRoleDialogUser(
              null
            );
          }
        }}
        onSave={
          handleSaveRole
        }
      />

      <UserDetailDialog
        open={detailOpen}
        onOpenChange={(
          open
        ) => {
          setDetailOpen(open);

          if (!open) {
            setDetailUser(
              null
            );
          }
        }}
        user={detailUser}
        loading={detailLoading}
      />

      <DeleteUserDialog
        open={Boolean(
          deleteDialog
        )}
        isBulk={
          deleteDialog?.type ===
          'bulk'
        }
        userName={
          deleteDialog?.user
            ?.fullName ?? ''
        }
        selectedCount={
          selectedIds.size
        }
        onConfirm={
          handleDeleteConfirm
        }
        onCancel={() =>
          setDeleteDialog(
            null
          )
        }
      />
    </div>
  );
}

export default Users;