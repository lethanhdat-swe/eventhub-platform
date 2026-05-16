import { Plus } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { getErrorMessage } from '@/lib/http/apiError';
import { couponService } from '@/lib/services/admin/couponService';
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
import CouponFormDialog from '@/pages/(admin)/Coupons/components/CouponFormDialog';
import CouponTable from '@/pages/(admin)/Coupons/components/CouponTable';
import DeleteCouponDialog from '@/pages/(admin)/Coupons/components/DeleteCouponDialog';
import {
  buildCouponPayload,
  COUPON_STATUS_OPTIONS,
  mapCouponRow,
} from '@/pages/(admin)/Coupons/data';

const PAGE_SIZE = 10;

function Coupons() {
  const [coupons, setCoupons] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [validityFilter, setValidityFilter] = useState('all');
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
  const [formDialog, setFormDialog] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

  const couponStatusFilterOptions = useMemo(
    () => [
      { value: 'all', label: 'Tất cả' },
      ...COUPON_STATUS_OPTIONS.map((o) => ({
        value: o.value,
        label: o.label,
      })),
    ],
    []
  );

  const couponValidityFilterOptions = useMemo(
    () => [
      { value: 'all', label: 'Tất cả' },
      { value: 'valid', label: 'Còn hạn' },
      { value: 'expired', label: 'Đã hết hạn' },
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
  }, [debouncedSearch, statusFilter, validityFilter]);

  const loadCoupons = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const payload = await couponService.list({
        page,
        limit: PAGE_SIZE,
        search: debouncedSearch,
        status: statusFilter,
        validity: validityFilter,
      });
      const rows = payload.data ?? [];
      setCoupons(rows.map(mapCouponRow));
      const m = payload.meta ?? {};
      setMeta({
        totalItems: m.totalItems ?? 0,
        totalPages: Math.max(1, m.totalPages ?? 1),
        currentPage: m.currentPage ?? page,
        itemsPerPage: m.itemsPerPage ?? PAGE_SIZE,
      });
    } catch (e) {
      setError(getErrorMessage(e));
      setCoupons([]);
    } finally {
      setIsLoading(false);
    }
  }, [page, debouncedSearch, statusFilter, validityFilter]);

  useEffect(() => {
    void loadCoupons();
  }, [loadCoupons]);

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedIds(new Set(coupons.map((coupon) => coupon.id)));
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

  const handleSaveCoupon = async (values) => {
    setError(null);
    const body = buildCouponPayload(values);

    if (formDialog?.mode === 'create') {
      await couponService.create(body);
      setFormDialog(null);
      await loadCoupons();
      return;
    }

    if (formDialog?.mode === 'edit' && formDialog.coupon) {
      const updateBody = {
        ...body,
        description: values.description || undefined,
        validUntil: values.validUntil,
        usageLimit: values.usageLimit,
      };
      await couponService.update(formDialog.coupon.id, updateBody);
      setFormDialog(null);
      await loadCoupons();
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteDialog || deleteSubmitting) return;

    setDeleteSubmitting(true);
    setError(null);
    try {
      if (deleteDialog.type === 'bulk') {
        await couponService.deleteMany([...selectedIds]);
        setSelectedIds(new Set());
      } else {
        await couponService.deleteOne(deleteDialog.coupon.id);
        setSelectedIds((prev) => {
          const next = new Set(prev);
          next.delete(deleteDialog.coupon.id);
          return next;
        });
      }
      setDeleteDialog(null);
      await loadCoupons();
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setDeleteSubmitting(false);
    }
  };

  const formDialogOpen = Boolean(formDialog);
  const formInitialValues =
    formDialog?.mode === 'edit'
      ? {
          ...formDialog.coupon,
          validUntil: formDialog.coupon.validUntil,
        }
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

  const handleEdit = (coupon) => {
    setFormDialog({ mode: 'edit', coupon });
  };

  const handleDelete = (coupon) => {
    setDeleteDialog({ type: 'single', coupon });
  };

  const isEmpty = !isLoading && coupons.length === 0;

  return (
    <div className="space-y-4">
      <PageHeader
        title="Quản lý mã giảm giá"
        description="Tạo và quản lý mã giảm giá cho đơn đặt vé."
        actionLabel="Thêm mã giảm giá"
        actionIcon={<Plus className="size-4" />}
        onAction={() => setFormDialog({ mode: 'create' })}
      />

      {error && coupons.length > 0 ? (
        <div
          className="flex flex-col gap-2 rounded-lg border border-destructive/25 bg-destructive/5 px-3 py-2 sm:flex-row sm:items-center sm:justify-between"
          role="alert"
        >
          <p className="text-sm text-destructive">{error}</p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 shrink-0"
            onClick={() => void loadCoupons()}
          >
            Thử lại
          </Button>
        </div>
      ) : null}

      <AdminToolbar
        searchPlaceholder="Tìm kiếm mã giảm giá..."
        searchValue={searchInput}
        onSearchChange={setSearchInput}
      >
        <AdminFilterDropdown
          label="Trạng thái"
          options={couponStatusFilterOptions}
          value={statusFilter}
          onChange={setStatusFilter}
        />
        <AdminFilterDropdown
          label="Hạn sử dụng"
          options={couponValidityFilterOptions}
          value={validityFilter}
          onChange={setValidityFilter}
        />
      </AdminToolbar>

      <AdminBulkActions
        selectedCount={selectedIds.size}
        label={`Đã chọn ${selectedIds.size} mã giảm giá`}
      >
        <Button
          type="button"
          variant="destructive"
          className="h-9 px-3"
          disabled={selectedIds.size === 0}
          onClick={() => setDeleteDialog({ type: 'bulk' })}
        >
          Xóa đã chọn
        </Button>
      </AdminBulkActions>

      {isLoading ? (
        <AdminLoadingState rows={6} columns={8} minWidth="min-w-[900px]" />
      ) : isEmpty ? (
        <AdminEmptyState
          {...(error
            ? {
                title: 'Không tải được danh sách',
                description: error,
                actionLabel: 'Thử lại',
                onAction: () => void loadCoupons(),
              }
            : {
                ...ADMIN_EMPTY_STATES.coupons,
                onAction: () => setFormDialog({ mode: 'create' }),
              })}
        />
      ) : (
        <>
          <CouponTable
            coupons={coupons}
            selectedIds={selectedIds}
            onSelectAll={handleSelectAll}
            onSelectRow={handleSelectRow}
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
        isDeleting={deleteSubmitting}
        onConfirm={() => void handleDeleteConfirm()}
        onCancel={() => {
          if (!deleteSubmitting) setDeleteDialog(null);
        }}
      />
    </div>
  );
}

export default Coupons;
