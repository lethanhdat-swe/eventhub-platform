import { useCallback, useEffect, useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { getErrorMessage } from '@/lib/http/apiError';
import { paymentTransactionService } from '@/lib/services/admin/paymentTransactionService';
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
import ManualConfirmPaymentDialog from '@/pages/(admin)/PaymentTransactions/components/ManualConfirmPaymentDialog';
import PaymentTransactionDetailDialog from '@/pages/(admin)/PaymentTransactions/components/PaymentTransactionDetailDialog';
import PaymentTransactionTable from '@/pages/(admin)/PaymentTransactions/components/PaymentTransactionTable';
import {
  mapPaymentTransactionRow,
  PAYMENT_TRANSACTION_STATUS_LABELS,
} from '@/pages/(admin)/PaymentTransactions/data';

const PAGE_SIZE = 10;

function PaymentTransactions() {
  const [transactions, setTransactions] = useState([]);
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
  const [successMessage, setSuccessMessage] = useState(null);
  const [selectedIds, setSelectedIds] = useState(() => new Set());
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailTransaction, setDetailTransaction] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [manualTransaction, setManualTransaction] = useState(null);
  const [manualSubmitting, setManualSubmitting] = useState(false);
  const [manualError, setManualError] = useState(null);

  const statusFilterOptions = useMemo(
    () => [
      { value: 'all', label: 'Tất cả' },
      ...Object.entries(PAYMENT_TRANSACTION_STATUS_LABELS).map(
        ([value]) => ({
          value,
          label: value,
        })
      ),
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

  const loadTransactions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const payload = await paymentTransactionService.list({
        page,
        limit: PAGE_SIZE,
        search: debouncedSearch,
        status: statusFilter,
      });
      const rows = payload.items ?? [];
      setTransactions(rows.map(mapPaymentTransactionRow));
      setSelectedIds(new Set());
      const m = payload.meta ?? {};
      setMeta({
        totalItems: m.total ?? 0,
        totalPages: Math.max(1, m.totalPages ?? 1),
        currentPage: m.page ?? page,
        itemsPerPage: m.limit ?? PAGE_SIZE,
      });
    } catch (e) {
      setError(getErrorMessage(e));
      setTransactions([]);
    } finally {
      setIsLoading(false);
    }
  }, [page, debouncedSearch, statusFilter]);

  useEffect(() => {
    void loadTransactions();
  }, [loadTransactions]);

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedIds(new Set(transactions.map((transaction) => transaction.id)));
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

  const handleView = async (transaction) => {
    setDetailOpen(true);
    setDetailTransaction(null);
    setDetailLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const full = await paymentTransactionService.getDetail(transaction.id);
      setDetailTransaction(full);
    } catch (e) {
      setDetailOpen(false);
      setError(getErrorMessage(e));
    } finally {
      setDetailLoading(false);
    }
  };

  const handleManualConfirm = (transaction) => {
    setManualTransaction(transaction);
    setManualError(null);
    setSuccessMessage(null);
  };

  const handleManualConfirmSubmit = async (orderCode) => {
    if (!manualTransaction || manualSubmitting) return;

    setManualSubmitting(true);
    setManualError(null);
    setError(null);
    setSuccessMessage(null);
    try {
      await paymentTransactionService.manualConfirm(manualTransaction.id, {
        orderCode,
      });
      setSuccessMessage('Đã xác nhận giao dịch thủ công.');
      setManualTransaction(null);
      await loadTransactions();
    } catch (e) {
      setManualError(getErrorMessage(e));
    } finally {
      setManualSubmitting(false);
    }
  };

  const isEmpty = !isLoading && transactions.length === 0;
  const manualDialogOpen = Boolean(manualTransaction);

  return (
    <div className="space-y-4">
      <PageHeader
        title="Đối soát thanh toán"
        description="Theo dõi giao dịch SePay, trạng thái khớp đơn và xử lý khiếu nại thanh toán."
      />

      {error && transactions.length > 0 ? (
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
            onClick={() => void loadTransactions()}
          >
            Thử lại
          </Button>
        </div>
      ) : null}

      {successMessage ? (
        <div
          className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
          role="status"
        >
          {successMessage}
        </div>
      ) : null}

      <AdminToolbar
        searchPlaceholder="Tìm mã giao dịch, mã đơn, nội dung chuyển khoản..."
        searchValue={searchInput}
        onSearchChange={setSearchInput}
      >
        <AdminFilterDropdown
          label="Trạng thái"
          options={statusFilterOptions}
          value={statusFilter}
          onChange={setStatusFilter}
        />
      </AdminToolbar>

      <AdminBulkActions
        selectedCount={selectedIds.size}
        label={`Đã chọn ${selectedIds.size} giao dịch`}
      />

      {isLoading ? (
        <AdminLoadingState rows={6} columns={10} minWidth="min-w-[1280px]" />
      ) : isEmpty ? (
        <AdminEmptyState
          {...(error
            ? {
                title: 'Không tải được danh sách',
                description: error,
                actionLabel: 'Thử lại',
                onAction: () => void loadTransactions(),
              }
            : ADMIN_EMPTY_STATES.paymentTransactions)}
        />
      ) : (
        <>
          <PaymentTransactionTable
            transactions={transactions}
            selectedIds={selectedIds}
            onSelectAll={handleSelectAll}
            onSelectRow={handleSelectRow}
            onView={handleView}
            onManualConfirm={handleManualConfirm}
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

      <PaymentTransactionDetailDialog
        open={detailOpen}
        onOpenChange={(isOpen) => {
          setDetailOpen(isOpen);
          if (!isOpen) setDetailTransaction(null);
        }}
        transaction={detailTransaction}
        loading={detailLoading}
      />

      <ManualConfirmPaymentDialog
        open={manualDialogOpen}
        transaction={manualTransaction}
        submitting={manualSubmitting}
        error={manualError}
        onConfirm={(orderCode) => void handleManualConfirmSubmit(orderCode)}
        onCancel={() => {
          if (!manualSubmitting) {
            setManualTransaction(null);
            setManualError(null);
          }
        }}
      />
    </div>
  );
}

export default PaymentTransactions;
