import PageHeader from '@/pages/(admin)/components/PageHeader';
import ManualConfirmPaymentDialog from '@/pages/(admin)/PaymentTransactions/components/ManualConfirmPaymentDialog/ManualConfirmPaymentDialog';
import PaymentTransactionDetailDialog from '@/pages/(admin)/PaymentTransactions/components/PaymentTransactionDetailDialog/PaymentTransactionDetailDialog';
import { usePaymentTransactions } from '@/hooks/usePaymentTransactions';
import { useTransactionDetail } from '@/hooks/useTransactionDetail';
import { useManualConfirm } from '@/hooks/useManualConfirm';
import PaymentTransactionFilters from './components/PaymentTransactionFilters/PaymentTransactionFilters';
import PaymentTransactionContent from './components/PaymentTransactionContent/PaymentTransactionContent';
import { useState } from 'react';

function PaymentTransactions() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const {
    transactions,
    meta,
    loading,
    loadTransactions,
  } = usePaymentTransactions(
    page,
    searchInput,
    statusFilter
  );

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
        transactions={transactions}
        meta={meta}
        setPage={setPage}
        onView={(row) =>
          detail.openDetail(row.id)
        }
        onManualConfirm={
          manual.setTransaction
        }
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
