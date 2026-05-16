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
import DeleteUserDialog from '@/pages/(admin)/Users/components/DeleteUserDialog';
import UserRoleDialog from '@/pages/(admin)/Users/components/UserRoleDialog';
import UserTable from '@/pages/(admin)/Users/components/UserTable';
import {
  filterUsers,
  MOCK_USERS,
  USER_ROLE_OPTIONS,
} from '@/pages/(admin)/Users/data';

const USER_EMAIL_FILTER_OPTIONS = [
  { value: 'all', label: 'Tất cả' },
  { value: 'verified', label: 'Đã xác thực' },
  { value: 'unverified', label: 'Chưa xác thực' },
];

const USER_PROVIDER_FILTER_OPTIONS = [
  { value: 'all', label: 'Tất cả' },
  { value: 'google', label: 'Google' },
  { value: 'credentials', label: 'Email' },
];

function Users() {
  const [users, setUsers] = useState(MOCK_USERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [emailFilter, setEmailFilter] = useState('all');
  const [providerFilter, setProviderFilter] = useState('all');
  const [selectedIds, setSelectedIds] = useState(() => new Set());
  const [roleDialogUser, setRoleDialogUser] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(null);

  const userRoleFilterOptions = useMemo(
    () => [
      { value: 'all', label: 'Tất cả' },
      ...USER_ROLE_OPTIONS.map((o) => ({ value: o.value, label: o.label })),
    ],
    []
  );

  const filteredUsers = useMemo(
    () =>
      filterUsers(users, searchQuery, {
        role: roleFilter,
        emailVerified: emailFilter,
        provider: providerFilter,
      }),
    [users, searchQuery, roleFilter, emailFilter, providerFilter]
  );

  const isLoading = false;
  const isEmpty = !isLoading && filteredUsers.length === 0;

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedIds(new Set(filteredUsers.map((user) => user.id)));
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

  const handleSaveRole = (role) => {
    if (!roleDialogUser) return;

    setUsers((prev) =>
      prev.map((user) =>
        user.id === roleDialogUser.id
          ? { ...user, role, updatedAt: new Date().toISOString() }
          : user
      )
    );
    setRoleDialogUser(null);
  };

  const handleToggleLock = (user) => {
    setUsers((prev) =>
      prev.map((item) =>
        item.id === user.id
          ? {
              ...item,
              isLocked: !item.isLocked,
              updatedAt: new Date().toISOString(),
            }
          : item
      )
    );
  };

  const handleDeleteConfirm = () => {
    if (!deleteDialog) return;

    if (deleteDialog.type === 'bulk') {
      setUsers((prev) => prev.filter((user) => !selectedIds.has(user.id)));
      setSelectedIds(new Set());
      setDeleteDialog(null);
      return;
    }

    setUsers((prev) =>
      prev.filter((user) => user.id !== deleteDialog.user.id)
    );
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(deleteDialog.user.id);
      return next;
    });
    setDeleteDialog(null);
  };

  const handleNotifySelected = () => {
    console.log('Gửi thông báo cho users:', [...selectedIds]);
  };

  const handleView = (user) => {
    console.log('[User detail]', user);
  };

  const handleEdit = (user) => {
    setRoleDialogUser(user);
  };

  const handleDelete = (user) => {
    setDeleteDialog({ type: 'single', user });
  };

  const deleteDialogOpen = Boolean(deleteDialog);
  const deleteIsBulk = deleteDialog?.type === 'bulk';
  const deleteUserName = deleteDialog?.user?.fullName ?? '';

  return (
    <div className="space-y-4">
      <PageHeader
        title="Quản lý người dùng"
        description="Quản lý tài khoản khách hàng, quyền truy cập và trạng thái xác thực email."
      />

      <AdminToolbar
        searchPlaceholder="Tìm kiếm tên, email, số điện thoại..."
        onSearchChange={setSearchQuery}
      >
        <AdminFilterDropdown
          label="Vai trò"
          options={userRoleFilterOptions}
          value={roleFilter}
          onChange={setRoleFilter}
        />
        <AdminFilterDropdown
          label="Xác thực email"
          options={USER_EMAIL_FILTER_OPTIONS}
          value={emailFilter}
          onChange={setEmailFilter}
        />
        <AdminFilterDropdown
          label="Provider"
          options={USER_PROVIDER_FILTER_OPTIONS}
          value={providerFilter}
          onChange={setProviderFilter}
        />
      </AdminToolbar>

            <AdminBulkActions
        selectedCount={selectedIds.size}
        label={`Đã chọn ${selectedIds.size} người dùng`}
      >
        <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              className="h-9 px-3"
              onClick={handleNotifySelected}
            >
              Gửi thông báo
            </Button>
            <Button
              type="button"
              variant="destructive"
              className="h-9 px-3"
              onClick={() => setDeleteDialog({ type: 'bulk' })}
            >
              Xóa đã chọn
            </Button>
          </div>
      </AdminBulkActions>

      {isLoading ? (
        <AdminLoadingState rows={6} columns={9} minWidth="min-w-[1100px]" />
      ) : isEmpty ? (
        <AdminEmptyState
          {...ADMIN_EMPTY_STATES.users}
        />
      ) : (
        <>
          <UserTable
                  users={filteredUsers}
                  selectedIds={selectedIds}
                  onSelectAll={handleSelectAll}
                  onSelectRow={handleSelectRow}
                  onView={handleView}
                  onEdit={handleEdit}
                  onToggleLock={handleToggleLock}
                  onDelete={handleDelete}
                />
          <AdminPagination
            currentPage={1}
            totalPages={1}
            totalItems={filteredUsers.length}
            pageSize={10}
          />
        </>
      )}


      <UserRoleDialog
        open={Boolean(roleDialogUser)}
        user={roleDialogUser}
        onOpenChange={(isOpen) => {
          if (!isOpen) setRoleDialogUser(null);
        }}
        onSave={handleSaveRole}
      />

      <DeleteUserDialog
        open={deleteDialogOpen}
        isBulk={deleteIsBulk}
        userName={deleteUserName}
        selectedCount={selectedIds.size}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteDialog(null)}
      />
    </div>
  );
}

export default Users;
