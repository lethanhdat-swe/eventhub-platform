import { useCallback, useEffect, useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { getErrorMessage } from '@/lib/http/apiError';
import { orderService } from '@/lib/services/admin/orderService';
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
import DeleteOrderDialog from '@/pages/(admin)/Orders/components/DeleteOrderDialog/DeleteOrderDialog';
import OrderDetailDialog from '@/pages/(admin)/Orders/components/OrderDetailDialog/OrderDetailDialog';
import OrderTable from '@/pages/(admin)/Orders/components/OrderTable/OrderTable';
import { mapOrderRow, ORDER_STATUS_LABELS } from '@/pages/(admin)/Orders/data';
import { toast } from 'sonner';

const PAGE_SIZE = 10;

function Orders() {
  const [orders, setOrders] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
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
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailOrder, setDetailOrder] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const orderStatusFilterOptions = useMemo(
    () => [
      { value: 'all', label: 'Tất cả' },
      ...Object.entries(ORDER_STATUS_LABELS).map(([value, label]) => ({
        value,
        label,
      })),
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
  }, [debouncedSearch, statusFilter]);

  const loadOrders = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const payload = await orderService.list({
        page,
        limit: PAGE_SIZE,
        search: debouncedSearch,
        status: statusFilter,
      });
      const rows = payload.data ?? [];
      setOrders(rows.map(mapOrderRow));
      const m = payload.meta ?? {};
      setMeta({
        totalItems: m.totalItems ?? 0,
        totalPages: Math.max(1, m.totalPages ?? 1),
        currentPage: m.currentPage ?? page,
        itemsPerPage: m.itemsPerPage ?? PAGE_SIZE,
      });
    } catch (e) {
      setError(getErrorMessage(e));
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  }, [page, debouncedSearch, statusFilter]);

  useEffect(() => {
    void loadOrders();
  }, [loadOrders]);

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedIds(new Set(orders.map((order) => order.id)));
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

  const handleDeleteConfirm = async () => {
    if (!deleteDialog || deleteSubmitting) return;

    setDeleteSubmitting(true);
    setError(null);
    try {
      if (deleteDialog.type === 'bulk') {
        await orderService.deleteMany([...selectedIds]);
        setSelectedIds(new Set());
        toast.success(`Đã xóa ${selectedIds.size} đơn hàng`);
      } else {
        await orderService.deleteMany([deleteDialog.order.id]);
        setSelectedIds((prev) => {
          const next = new Set(prev);
          next.delete(deleteDialog.order.id);
          return next;
        });
        toast.success(`Đã xóa đơn hàng "${deleteDialog.order.id}"`);
      }
      setDeleteDialog(null);
      await loadOrders();
    } catch (e) {
      const message = getErrorMessage(e);
      setError(message);
      toast.error(message || 'Xóa đơn hàng thất bại');
    } finally {
      setDeleteSubmitting(false);
    }
  };

  const deleteDialogOpen = Boolean(deleteDialog);
  const deleteIsBulk = deleteDialog?.type === 'bulk';
  const deleteOrderCode = deleteDialog?.order?.orderCode ?? '';

  const handleView = async (order) => {
    setDetailOpen(true);
    setDetailOrder(null);
    setDetailLoading(true);
    setError(null);
    try {
      const full = await orderService.getById(order.id);
      setDetailOrder(full);
    } catch (e) {
      setDetailOpen(false);
      setError(getErrorMessage(e));
    } finally {
      setDetailLoading(false);
    }
  };

  const handleDelete = (order) => {
    setDeleteDialog({ type: 'single', order });
  };

  const isEmpty = !isLoading && orders.length === 0;

  return (
    <div className="space-y-4">
      <PageHeader
        title="Quản lý đơn hàng"
        description="Theo dõi đơn đặt vé, trạng thái thanh toán và thông tin khách hàng."
      />

      {error && orders.length > 0 ? (
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
            onClick={() => void loadOrders()}
          >
            Thử lại
          </Button>
        </div>
      ) : null}

      <AdminToolbar
        searchPlaceholder="Tìm kiếm mã đơn, khách hàng, email, SĐT..."
        searchValue={searchInput}
        onSearchChange={setSearchInput}
      >
        <AdminFilterDropdown
          label="Trạng thái"
          options={orderStatusFilterOptions}
          value={statusFilter}
          onChange={setStatusFilter}
        />
      </AdminToolbar>

      <AdminBulkActions
        selectedCount={selectedIds.size}
        label={`Đã chọn ${selectedIds.size} đơn hàng`}
      >
        <Button
          type="button"
          variant="destructive"
          className="px-3 h-9"
          disabled={selectedIds.size === 0}
          onClick={() => setDeleteDialog({ type: 'bulk' })}
        >
          Xóa đã chọn
        </Button>
      </AdminBulkActions>

      {isLoading ? (
        <AdminLoadingState rows={6} columns={10} minWidth="min-w-[1100px]" />
      ) : isEmpty ? (
        <AdminEmptyState
          {...(error
            ? {
                title: 'Không tải được danh sách',
                description: error,
                actionLabel: 'Thử lại',
                onAction: () => void loadOrders(),
              }
            : ADMIN_EMPTY_STATES.orders)}
        />
      ) : (
        <>
          <OrderTable
            orders={orders}
            selectedIds={selectedIds}
            onSelectAll={handleSelectAll}
            onSelectRow={handleSelectRow}
            onView={handleView}
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

      <OrderDetailDialog
        open={detailOpen}
        onOpenChange={(isOpen) => {
          setDetailOpen(isOpen);
          if (!isOpen) setDetailOrder(null);
        }}
        order={detailOrder}
        loading={detailLoading}
      />

      <DeleteOrderDialog
        open={deleteDialogOpen}
        isBulk={deleteIsBulk}
        orderCode={deleteOrderCode}
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

export default Orders;
