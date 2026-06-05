import { Plus } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { getErrorMessage } from '@/lib/http/apiError';
import { couponService } from '@/lib/services/admin/couponService';
import PageHeader from '@/pages/(admin)/components/PageHeader';
import {
  buildCouponPayload,
} from '@/pages/(admin)/Coupons/data';
import { toast } from 'sonner';
import { useCoupons } from '@/hooks/useCoupons';
import CouponFilters from './components/CouponFilters/CouponFilters';
import CouponBulkActions from './components/CouponBulkActions/CouponBulkActions';
import CouponContent from './components/CouponContent/CouponContent';
import CouponDialogs from './components/CouponDialogs/CouponDialogs';
import { useTableSort } from '@/pages/(admin)/components/table';

const DEFAULT_COUPON_SORT = {
  sortBy: 'createdAt',
  sortOrder: 'desc',
};

function Coupons() {
  const pageResetRef = useRef(null);

  const { sortBy, sortOrder, handleSort } = useTableSort({
    defaultSort: DEFAULT_COUPON_SORT,
    initialSort: DEFAULT_COUPON_SORT,
    onSortChange: () => pageResetRef.current?.(),
  });

  const {
    coupons,

    searchInput,
    setSearchInput,

    statusFilter,
    setStatusFilter,

    validityFilter,
    setValidityFilter,

    meta,

    isLoading,

    error,
    setError,

    selectedIds,
    setSelectedIds,

    couponStatusFilterOptions,
    couponValidityFilterOptions,

    loadCoupons,

    handleSelectAll,
    handleSelectRow,

    setPage,
  } = useCoupons({ sortBy, sortOrder });

  pageResetRef.current = () => setPage(1);

  const [formDialog, setFormDialog] =
    useState(null);

  const [deleteDialog, setDeleteDialog] =
    useState(null);

  const [deleteSubmitting,
    setDeleteSubmitting] =
    useState(false);

  const handleEdit = (coupon) => {
    setFormDialog({
      mode: 'edit',
      coupon,
    });
  };

  const handleDelete = (coupon) => {
    setDeleteDialog({
      type: 'single',
      coupon,
    });
  };

  const handleSaveCoupon =
    async (values) => {
      setError(null);

      try {
        const payload =
          buildCouponPayload(
            values
          );

        if (
          formDialog?.mode ===
          'create'
        ) {
          await couponService.create(
            payload
          );

          toast.success(
            'Tạo mã giảm giá thành công'
          );

          setFormDialog(null);

          await loadCoupons();

          return;
        }

        await couponService.update(
          formDialog.coupon.id,
          {
            ...payload,
            description:
              values.description ||
              undefined,

            validUntil:
              values.validUntil,

            usageLimit:
              values.usageLimit,
          }
        );

        toast.success(
          'Cập nhật mã giảm giá thành công'
        );

        setFormDialog(null);

        await loadCoupons();
      } catch (e) {
        const message =
          getErrorMessage(e);

        setError(message);

        toast.error(
          message ||
            'Có lỗi xảy ra'
        );
      }
    };

  const handleDeleteConfirm =
    async () => {
      if (
        !deleteDialog ||
        deleteSubmitting
      ) {
        return;
      }

      setDeleteSubmitting(
        true
      );

      setError(null);

      try {
        if (
          deleteDialog.type ===
          'bulk'
        ) {
          await couponService.deleteMany(
            [...selectedIds]
          );

          toast.success(
            `Đã xóa ${selectedIds.size} mã giảm giá`
          );

          setSelectedIds(
            new Set()
          );
        } else {
          await couponService.deleteOne(
            deleteDialog.coupon.id
          );

          setSelectedIds(
            (prev) => {
              const next =
                new Set(prev);

              next.delete(
                deleteDialog.coupon.id
              );

              return next;
            }
          );

          toast.success(
            `Đã xóa mã giảm giá "${deleteDialog.coupon.code}"`
          );
        }

        setDeleteDialog(null);

        await loadCoupons();
      } catch (e) {
        const message =
          getErrorMessage(e);

        setError(message);

        toast.error(
          message ||
            'Xóa mã giảm giá thất bại'
        );
      } finally {
        setDeleteSubmitting(
          false
        );
      }
    };

  const formInitialValues =
    useMemo(() => {
      if (
        formDialog?.mode ===
        'edit'
      ) {
        return {
          ...formDialog.coupon,
          validUntil:
            formDialog.coupon
              .validUntil,
        };
      }

      return {
        code: '',
        description: '',
        discountPercent: '',
        usageLimit: '',
        validUntil: '',
        status: 'ACTIVE',
      };
    }, [formDialog]);

  return (
    <div className="space-y-4">
      <PageHeader
        title="Quản lý mã giảm giá"
        description="Tạo và quản lý mã giảm giá cho đơn đặt vé."
        actionLabel="Thêm mã giảm giá"
        actionIcon={
          <Plus className="size-4" />
        }
        onAction={() =>
          setFormDialog({
            mode: 'create',
          })
        }
      />

      {error &&
      coupons.length > 0 ? (
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
              void loadCoupons()
            }
          >
            Thử lại
          </Button>
        </div>
      ) : null}

      <CouponFilters
        searchInput={
          searchInput
        }
        setSearchInput={
          setSearchInput
        }
        statusFilter={
          statusFilter
        }
        setStatusFilter={
          setStatusFilter
        }
        validityFilter={
          validityFilter
        }
        setValidityFilter={
          setValidityFilter
        }
        couponStatusFilterOptions={
          couponStatusFilterOptions
        }
        couponValidityFilterOptions={
          couponValidityFilterOptions
        }
      />

      <CouponBulkActions
        selectedCount={
          selectedIds.size
        }
        onDelete={() =>
          setDeleteDialog({
            type: 'bulk',
          })
        }
      />

      <CouponContent
        coupons={coupons}
        meta={meta}
        error={error}
        isLoading={isLoading}
        selectedIds={
          selectedIds
        }
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={handleSort}
        onRetry={() =>
          void loadCoupons()
        }
        onPageChange={setPage}
        onSelectAll={
          handleSelectAll
        }
        onSelectRow={
          handleSelectRow
        }
        onEdit={handleEdit}
        onDelete={handleDelete}
        onCreate={() =>
          setFormDialog({
            mode: 'create',
          })
        }
      />

      <CouponDialogs
        formDialog={
          formDialog
        }
        deleteDialog={
          deleteDialog
        }
        selectedCount={
          selectedIds.size
        }
        deleteSubmitting={
          deleteSubmitting
        }
        formInitialValues={
          formInitialValues
        }
        onSave={
          handleSaveCoupon
        }
        onCloseForm={() =>
          setFormDialog(null)
        }
        onDeleteConfirm={() =>
          void handleDeleteConfirm()
        }
        onDeleteClose={() => {
          if (
            !deleteSubmitting
          ) {
            setDeleteDialog(
              null
            );
          }
        }}
      />
    </div>
  );
}

export default Coupons;