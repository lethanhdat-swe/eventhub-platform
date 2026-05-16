import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
import DeleteOrderDialog from '@/pages/(admin)/Orders/components/DeleteOrderDialog';
import OrderTable from '@/pages/(admin)/Orders/components/OrderTable';
import {
  filterOrders,
  MOCK_ORDERS,
  ORDER_PAYMENT_LABELS,
  ORDER_STATUS_LABELS,
} from '@/pages/(admin)/Orders/data';

function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [selectedIds, setSelectedIds] = useState(() => new Set());
  const [deleteDialog, setDeleteDialog] = useState(null);

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

  const orderPaymentFilterOptions = useMemo(() => {
    const methods = [...new Set(orders.map((o) => o.paymentMethod))];
    return [
      { value: 'all', label: 'Tất cả' },
      ...methods.map((m) => ({
        value: m,
        label: ORDER_PAYMENT_LABELS[m] ?? m,
      })),
    ];
  }, [orders]);

  const filteredOrders = useMemo(
    () =>
      filterOrders(orders, searchQuery, {
        status: statusFilter,
        paymentMethod: paymentFilter,
      }),
    [orders, searchQuery, statusFilter, paymentFilter]
  );

  const isLoading = false;
  const isEmpty = !isLoading && filteredOrders.length === 0;

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedIds(new Set(filteredOrders.map((order) => order.id)));
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

  const handleRefund = (order) => {
    setOrders((prev) =>
      prev.map((item) =>
        item.id === order.id
          ? {
              ...item,
              status: 'refunded',
              updatedAt: new Date().toISOString(),
            }
          : item
      )
    );
  };

  const handleDeleteConfirm = () => {
    if (!deleteDialog) return;

    if (deleteDialog.type === 'bulk') {
      setOrders((prev) => prev.filter((order) => !selectedIds.has(order.id)));
      setSelectedIds(new Set());
      setDeleteDialog(null);
      return;
    }

    setOrders((prev) => prev.filter((order) => order.id !== deleteDialog.order.id));
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(deleteDialog.order.id);
      return next;
    });
    setDeleteDialog(null);
  };

  const deleteDialogOpen = Boolean(deleteDialog);
  const deleteIsBulk = deleteDialog?.type === 'bulk';
  const deleteOrderCode = deleteDialog?.order?.orderCode ?? '';

  const handleView = (order) => {
    console.log('[Order detail]', order.id);
  };

  const handleEdit = (order) => {
    console.log('[Edit order]', order.id);
  };

  const handleDelete = (order) => {
    setDeleteDialog({ type: 'single', order });
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Quản lý đơn hàng"
        description="Theo dõi đơn đặt vé, trạng thái thanh toán và thông tin khách hàng."
      />

      <AdminToolbar
        searchPlaceholder="Tìm kiếm mã đơn, khách hàng, email..."
        onSearchChange={setSearchQuery}
      >
        <AdminFilterDropdown
          label="Trạng thái"
          options={orderStatusFilterOptions}
          value={statusFilter}
          onChange={setStatusFilter}
        />
        <AdminFilterDropdown
          label="Thanh toán"
          options={orderPaymentFilterOptions}
          value={paymentFilter}
          onChange={setPaymentFilter}
        />
      </AdminToolbar>

            <AdminBulkActions
        selectedCount={selectedIds.size}
        label={`Đã chọn ${selectedIds.size} đơn hàng`}
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
        <AdminLoadingState rows={6} columns={10} minWidth="min-w-[1100px]" />
      ) : isEmpty ? (
        <AdminEmptyState
          {...ADMIN_EMPTY_STATES.orders}
        />
      ) : (
        <>
          <OrderTable
                  orders={filteredOrders}
                  selectedIds={selectedIds}
                  onSelectAll={handleSelectAll}
                  onSelectRow={handleSelectRow}
                  onView={handleView}
                  onEdit={handleEdit}
                  onViewTickets={() => navigate('/admin/tickets')}
                  onRefund={handleRefund}
                  onDelete={handleDelete}
                />
          <AdminPagination
            currentPage={1}
            totalPages={1}
            totalItems={filteredOrders.length}
            pageSize={10}
          />
        </>
      )}


      <DeleteOrderDialog
        open={deleteDialogOpen}
        isBulk={deleteIsBulk}
        orderCode={deleteOrderCode}
        selectedCount={selectedIds.size}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteDialog(null)}
      />
    </div>
  );
}

export default Orders;
