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
import CouponFormDialog from '@/pages/(admin)/Coupons/components/CouponFormDialog';
import CouponTable from '@/pages/(admin)/Coupons/components/CouponTable';
import DeleteCouponDialog from '@/pages/(admin)/Coupons/components/DeleteCouponDialog';
import { filterCoupons, MOCK_COUPONS } from '@/pages/(admin)/Coupons/data';

function createCouponId() {
  return `cpn-${crypto.randomUUID().slice(0, 8)}`;
}

function Coupons() {
  const [coupons, setCoupons] = useState(MOCK_COUPONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState(() => new Set());
  const [formDialog, setFormDialog] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(null);

  const filteredCoupons = useMemo(
    () => filterCoupons(coupons, searchQuery),
    [coupons, searchQuery]
  );

  const isLoading = false;
  const isEmpty = !isLoading && filteredCoupons.length === 0;

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedIds(new Set(filteredCoupons.map((coupon) => coupon.id)));
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

  const handleSaveCoupon = ({
    code,
    description,
    discountPercent,
    usageLimit,
    validUntil,
    status,
  }) => {
    const now = new Date().toISOString();

    if (formDialog?.mode === 'create') {
      setCoupons((prev) => [
        ...prev,
        {
          id: createCouponId(),
          code,
          description,
          discountPercent,
          usageLimit,
          validUntil,
          status,
          createdAt: now,
          updatedAt: now,
        },
      ]);
      setFormDialog(null);
      return;
    }

    if (formDialog?.mode === 'edit' && formDialog.coupon) {
      setCoupons((prev) =>
        prev.map((coupon) =>
          coupon.id === formDialog.coupon.id
            ? {
                ...coupon,
                code,
                description,
                discountPercent,
                usageLimit,
                validUntil,
                status,
                updatedAt: now,
              }
            : coupon
        )
      );
      setFormDialog(null);
    }
  };

  const handleToggleStatus = (coupon) => {
    setCoupons((prev) =>
      prev.map((item) =>
        item.id === coupon.id
          ? {
              ...item,
              status: item.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE',
              updatedAt: new Date().toISOString(),
            }
          : item
      )
    );
  };

  const handleDeleteConfirm = () => {
    if (!deleteDialog) return;

    if (deleteDialog.type === 'bulk') {
      setCoupons((prev) =>
        prev.filter((coupon) => !selectedIds.has(coupon.id))
      );
      setSelectedIds(new Set());
      setDeleteDialog(null);
      return;
    }

    setCoupons((prev) =>
      prev.filter((coupon) => coupon.id !== deleteDialog.coupon.id)
    );
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(deleteDialog.coupon.id);
      return next;
    });
    setDeleteDialog(null);
  };

  const formDialogOpen = Boolean(formDialog);
  const formInitialValues =
    formDialog?.mode === 'edit'
      ? { ...formDialog.coupon }
      : {
          code: '',
          description: '',
          discountPercent: '',
          usageLimit: '',
          validUntil: '',
          status: 'ACTIVE',
        };

  const deleteDialogOpen = Boolean(deleteDialog);
  const deleteIsBulk = deleteDialog?.type === 'bulk';
  const deleteCouponCode = deleteDialog?.coupon?.code ?? '';

  return (
    <div className="space-y-4">
      <PageHeader
        title="Quản lý mã giảm giá"
        description="Tạo và quản lý mã giảm giá cho đơn đặt vé."
        actionLabel="Thêm mã giảm giá"
        actionIcon={<Plus className="size-4" />}
        onAction={() => setFormDialog({ mode: 'create' })}
      />

      <AdminToolbar
        searchPlaceholder="Tìm kiếm mã giảm giá..."
        onSearchChange={setSearchQuery}
      >
        <Button type="button" variant="outline" className="h-9 px-3 text-sm">
          Trạng thái
        </Button>
        <Button type="button" variant="outline" className="h-9 px-3 text-sm">
          Hạn sử dụng
        </Button>
      </AdminToolbar>

            <AdminBulkActions
        selectedCount={selectedIds.size}
        label={`Đã chọn ${selectedIds.size} mã giảm giá`}
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
        <AdminLoadingState rows={6} columns={8} minWidth="min-w-[900px]" />
      ) : isEmpty ? (
        <AdminEmptyState
          {...ADMIN_EMPTY_STATES.coupons}
          onAction={() => setFormDialog({ mode: 'create' })}
        />
      ) : (
        <>
          <CouponTable
                  coupons={filteredCoupons}
                  selectedIds={selectedIds}
                  onSelectAll={handleSelectAll}
                  onSelectRow={handleSelectRow}
                  onEdit={(coupon) => setFormDialog({ mode: 'edit', coupon })}
                  onToggleStatus={handleToggleStatus}
                  onDelete={(coupon) => setDeleteDialog({ type: 'single', coupon })}
                />
          <AdminPagination
            currentPage={1}
            totalPages={1}
            totalItems={filteredCoupons.length}
            pageSize={10}
          />
        </>
      )}


      <CouponFormDialog
        open={formDialogOpen}
        mode={formDialog?.mode ?? 'create'}
        initialValues={formInitialValues}
        onOpenChange={(isOpen) => {
          if (!isOpen) setFormDialog(null);
        }}
        onSave={handleSaveCoupon}
      />

      <DeleteCouponDialog
        open={deleteDialogOpen}
        isBulk={deleteIsBulk}
        couponCode={deleteCouponCode}
        selectedCount={selectedIds.size}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteDialog(null)}
      />
    </div>
  );
}

export default Coupons;
