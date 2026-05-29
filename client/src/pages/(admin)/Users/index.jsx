import { useCallback, useEffect, useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { getErrorMessage } from '@/lib/http/apiError';
import { userService } from '@/lib/services/admin/userService';
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
import UserDetailDialog from '@/pages/(admin)/Users/components/UserDetailDialog';
import UserRoleDialog from '@/pages/(admin)/Users/components/UserRoleDialog';
import UserTable from '@/pages/(admin)/Users/components/UserTable';
import { USER_ROLE_OPTIONS } from '@/pages/(admin)/Users/data';
import { toast } from 'sonner';

const USER_EMAIL_FILTER_OPTIONS = [
  { value: 'all', label: 'Tất cả' },
  { value: 'verified', label: 'Đã xác thực' },
  { value: 'unverified', label: 'Chưa xác thực' },
];

const PAGE_SIZE = 10;

function Users() {
  const [users, setUsers] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [emailFilter, setEmailFilter] = useState('all');
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
  const [roleDialogUser, setRoleDialogUser] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailUser, setDetailUser] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const userRoleFilterOptions = useMemo(
    () => [
      { value: 'all', label: 'Tất cả' },
      ...USER_ROLE_OPTIONS.map((o) => ({ value: o.value, label: o.label })),
    ],
    []
  );

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
    }, 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, roleFilter, emailFilter]);

  const loadUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const payload = await userService.list({
        page,
        limit: PAGE_SIZE,
        search: debouncedSearch,
        role: roleFilter,
        emailVerified: emailFilter,
      });
      setUsers(payload.data ?? []);
      const m = payload.meta ?? {};
      setMeta({
        totalItems: m.totalItems ?? 0,
        totalPages: Math.max(1, m.totalPages ?? 1),
        currentPage: m.currentPage ?? page,
        itemsPerPage: m.itemsPerPage ?? PAGE_SIZE,
      });
    } catch (e) {
      setError(getErrorMessage(e));
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  }, [page, debouncedSearch, roleFilter, emailFilter]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedIds(new Set(users.map((user) => user.id)));
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

  const handleSaveRole = async (role) => {
    if (!roleDialogUser) return;

    setError(null);
    try {
      await userService.changeRole({ userId: roleDialogUser.id, role });
      toast.success(`Đã cập nhật vai trò của "${roleDialogUser.name}"`);
      setRoleDialogUser(null);
      await loadUsers();
    } catch (e) {
      const message = getErrorMessage(e);
      setError(message);
      toast.error(message || 'Cập nhật vai trò thất bại');
      throw e;
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteDialog) return;

    try {
      setError(null);
      if (deleteDialog.type === 'bulk') {
        await userService.deleteMany([...selectedIds]);
        setSelectedIds(new Set());
        toast.success(`Đã xóa ${selectedIds.size} người dùng`);
      } else {
        await userService.deleteMany([deleteDialog.user.id]);
        setSelectedIds((prev) => {
          const next = new Set(prev);
          next.delete(deleteDialog.user.id);
          return next;
        });
        toast.success(`Đã xóa người dùng "${deleteDialog.user.name}"`);
      }
      setDeleteDialog(null);
      await loadUsers();
    } catch (e) {
      const message = getErrorMessage(e);
      setError(message);
      toast.error(message || 'Xóa người dùng thất bại');
    }
  };

  const handleNotifySelected = () => {
    console.log('Gửi thông báo cho users:', [...selectedIds]);
  };

  const handleView = async (user) => {
    setDetailOpen(true);
    setDetailUser(null);
    setDetailLoading(true);
    setError(null);
    try {
      const u = await userService.getById(user.id);
      setDetailUser(u);
    } catch (e) {
      setDetailOpen(false);
      setError(getErrorMessage(e));
    } finally {
      setDetailLoading(false);
    }
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

      {error && users.length > 0 ? (
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
            onClick={() => loadUsers()}
          >
            Thử lại
          </Button>
        </div>
      ) : null}

      <AdminToolbar
        searchPlaceholder="Tìm kiếm tên, email, số điện thoại..."
        searchValue={searchInput}
        onSearchChange={setSearchInput}
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
      </AdminToolbar>

      <AdminBulkActions
        selectedCount={selectedIds.size}
        label={`Đã chọn ${selectedIds.size} người dùng`}
      >
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            className="px-3 h-9"
            onClick={handleNotifySelected}
          >
            Gửi thông báo
          </Button>
          <Button
            type="button"
            variant="destructive"
            className="px-3 h-9"
            onClick={() => setDeleteDialog({ type: 'bulk' })}
          >
            Xóa đã chọn
          </Button>
        </div>
      </AdminBulkActions>

      {isLoading ? (
        <AdminLoadingState rows={6} columns={9} minWidth="min-w-[1100px]" />
      ) : users.length === 0 ? (
        <AdminEmptyState
          {...(error
            ? {
                title: 'Không tải được danh sách',
                description: error,
                actionLabel: 'Thử lại',
                onAction: () => loadUsers(),
              }
            : ADMIN_EMPTY_STATES.users)}
        />
      ) : (
        <>
          <UserTable
            users={users}
            selectedIds={selectedIds}
            onSelectAll={handleSelectAll}
            onSelectRow={handleSelectRow}
            onView={handleView}
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

      <UserRoleDialog
        open={Boolean(roleDialogUser)}
        user={roleDialogUser}
        onOpenChange={(isOpen) => {
          if (!isOpen) setRoleDialogUser(null);
        }}
        onSave={handleSaveRole}
      />

      <UserDetailDialog
        open={detailOpen}
        onOpenChange={(isOpen) => {
          setDetailOpen(isOpen);
          if (!isOpen) {
            setDetailUser(null);
          }
        }}
        user={detailUser}
        loading={detailLoading}
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
