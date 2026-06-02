import { useEffect, useState } from 'react';
import PageHeader from '@/pages/(admin)/components/PageHeader';
import RefundActionDialog from './components/RefundActionDialog/RefundActionDialog';
import RefundDetailDialog from './components/RefundDetailDialog/RefundDetailDialog';
import { getErrorMessage } from '@/lib/http/apiError';
import { refundService } from '@/lib/services/admin/refundService';
import { toast } from 'sonner';
import { useRefunds } from '@/hooks/useRefunds';
import RefundErrorAlert from './components/RefundErrorAlert/RefundErrorAlert';
import RefundFilters from './components/RefundFilters/RefundFilters';
import RefundContent from './components/RefundContent/RefundContent';

function Refunds() {
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);

  const [detailRefund, setDetailRefund] = useState(null);

  const [actionDialog, setActionDialog] = useState(null);
  const [actionSubmitting, setActionSubmitting] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchInput]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, statusFilter]);

  const {
    refunds,
    meta,
    loading,
    error,
    loadRefunds,
  } = useRefunds(
    page,
    debouncedSearch,
    statusFilter
  );

  const handleOpenDetail = (refund) => {
    setDetailRefund(refund);
  };

  const handleOpenComplete = (refund) => {
    setActionDialog({
      action: 'complete',
      refund,
    });
  };

  const handleOpenReject = (refund) => {
    setActionDialog({
      action: 'reject',
      refund,
    });
  };

  const handleActionConfirm = async () => {
    if (!actionDialog || actionSubmitting) return;

    setActionSubmitting(true);

    try {
      if (actionDialog.action === 'complete') {
        await refundService.complete(
          actionDialog.refund.id
        );

        toast.success(
          'Đã đánh dấu hoàn tiền thành công. Ghế của đơn đã được mở lại.'
        );
      }

      if (actionDialog.action === 'reject') {
        await refundService.reject(
          actionDialog.refund.id
        );

        toast.success(
          'Đã từ chối yêu cầu hoàn vé'
        );
      }

      setActionDialog(null);
      setDetailRefund(null);

      await loadRefunds();
    } catch (e) {
      toast.error(
        getErrorMessage(e) ||
          'Xử lý yêu cầu hoàn vé thất bại'
      );
    } finally {
      setActionSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Quản lý yêu cầu hoàn vé"
        description="Theo dõi yêu cầu hoàn tiền, thông tin ngân hàng và xử lý hoàn vé thủ công cho khách hàng."
      />

      <RefundErrorAlert
        error={error}
        hasData={refunds.length > 0}
        onRetry={() => void loadRefunds()}
      />

      <RefundFilters
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      <RefundContent
        loading={loading}
        error={error}
        refunds={refunds}
        meta={meta}
        onRetry={() => void loadRefunds()}
        onViewDetail={handleOpenDetail}
        onPageChange={setPage}
      />

      <RefundDetailDialog
        open={Boolean(detailRefund)}
        refund={detailRefund}
        onOpenChange={(open) => {
          if (!open && !actionSubmitting) {
            setDetailRefund(null);
          }
        }}
        onComplete={handleOpenComplete}
        onReject={handleOpenReject}
      />

      <RefundActionDialog
        open={Boolean(actionDialog)}
        action={actionDialog?.action}
        refund={actionDialog?.refund}
        submitting={actionSubmitting}
        onOpenChange={(open) => {
          if (!open && !actionSubmitting) {
            setActionDialog(null);
          }
        }}
        onConfirm={() => void handleActionConfirm()}
      />
    </div>
  );
}

export default Refunds;