import PageHeader from '@/pages/(admin)/components/PageHeader';
import ManualConfirmPaymentDialog from '@/pages/(admin)/PaymentTransactions/components/ManualConfirmPaymentDialog/ManualConfirmPaymentDialog';
import PaymentTransactionDetailDialog from '@/pages/(admin)/PaymentTransactions/components/PaymentTransactionDetailDialog/PaymentTransactionDetailDialog';
import { usePaymentTransactions } from '@/hooks/usePaymentTransactions';
import { useTransactionDetail } from '@/hooks/useTransactionDetail';
import { useManualConfirm } from '@/hooks/useManualConfirm';
import PaymentTransactionFilters from './components/PaymentTransactionFilters/PaymentTransactionFilters';
import PaymentTransactionContent from './components/PaymentTransactionContent/PaymentTransactionContent';
import { useEffect, useState } from 'react';
import { useTableSort } from '@/pages/(admin)/components/table';

const DEFAULT_PAYMENT_TRANSACTION_SORT = {
  sortBy: 'createdAt',
  sortOrder: 'desc',
};

function PaymentTransactions() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedIds, setSelectedIds] = useState(() => new Set());

  const { sortBy, sortOrder, handleSort } = useTableSort({
    defaultSort: DEFAULT_PAYMENT_TRANSACTION_SORT,
    initialSort: DEFAULT_PAYMENT_TRANSACTION_SORT,
    onSortChange: () => setPage(1),
  });

  const {
    transactions,
    meta,
    loading,
    error,
    loadTransactions,
  } = usePaymentTransactions(
    page,
    searchInput,
    statusFilter,
    { sortBy, sortOrder }
  );

  useEffect(() => {
    setSelectedIds(new Set());
  }, [page, searchInput, statusFilter]);

  const detail = useTransactionDetail();

  const manual = useManualConfirm(
    loadTransactions
  );

  return (
    <div className="space-y-4">
      <PageHeader
        title="Đối soát thanh toán"
        description="..."
      />

      <PaymentTransactionFilters
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      <PaymentTransactionContent
        loading={loading}
        error={error}
        transactions={transactions}
        meta={meta}
        selectedIds={selectedIds}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={handleSort}
        onSelectAll={(checked) => {
          if (checked) {
            setSelectedIds(new Set(transactions.map((item) => item.id)));
            return;
          }
          setSelectedIds(new Set());
        }}
        onSelectRow={(id, checked) => {
          setSelectedIds((prev) => {
            const next = new Set(prev);
            if (checked) {
              next.add(id);
            } else {
              next.delete(id);
            }
            return next;
          });
        }}
        onPageChange={setPage}
        onRetry={loadTransactions}
        onView={(row) => detail.openDetail(row.id)}
        onManualConfirm={manual.setTransaction}
      />

      <PaymentTransactionDetailDialog
        open={detail.open}
        transaction={detail.transaction}
        loading={detail.loading}
        onOpenChange={detail.setOpen}
      />

      <ManualConfirmPaymentDialog
        open={Boolean(manual.transaction)}
        transaction={manual.transaction}
        submitting={manual.submitting}
        error={manual.error}
        onConfirm={manual.submit}
        onCancel={() =>
          manual.setTransaction(null)
        }
      />
    </div>
  );
}

export default PaymentTransactions;
