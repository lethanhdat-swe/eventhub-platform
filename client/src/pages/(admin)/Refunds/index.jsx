import { useCallback, useEffect, useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { getErrorMessage } from '@/lib/http/apiError';
import AdminFilterDropdown from '@/pages/(admin)/components/AdminFilterDropdown';
import AdminToolbar from '@/pages/(admin)/components/AdminToolbar';
import {
    AdminEmptyState,
    AdminLoadingState,
    AdminPagination,
} from '@/pages/(admin)/components/table';
import PageHeader from '@/pages/(admin)/components/PageHeader';
import {
    mapRefundRow,
    REFUND_STATUS_LABELS,
} from '@/pages/(admin)/Refunds/data';
import { toast } from 'sonner';
import { refundService } from '@/lib/services/admin/refundService';
import RefundTable from './components/RefundTable/RefundTable';
import RefundActionDialog from './components/RefundActionDialog/RefundActionDialog';
import RefundDetailDialog from './components/RefundDetailDialog/RefundDetailDialog';

const PAGE_SIZE = 10;

function Refunds() {
    const [refunds, setRefunds] = useState([]);
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

    const [detailRefund, setDetailRefund] = useState(null);
    const [actionDialog, setActionDialog] = useState(null);
    const [actionSubmitting, setActionSubmitting] = useState(false);

    const refundStatusFilterOptions = useMemo(
        () => [
            { value: 'all', label: 'Tất cả' },
            ...Object.entries(REFUND_STATUS_LABELS).map(([value, label]) => ({
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

    const loadRefunds = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const payload = await refundService.listAdmin({
                page,
                limit: PAGE_SIZE,
                search: debouncedSearch,
                status: statusFilter === 'all' ? '' : statusFilter,
            });

            const rows = payload.items ?? payload.data ?? [];

            setRefunds(rows.map(mapRefundRow));

            const m = payload.meta ?? {};
            setMeta({
                totalItems: m.totalItems ?? 0,
                totalPages: Math.max(1, m.totalPages ?? 1),
                currentPage: m.currentPage ?? page,
                itemsPerPage: m.itemsPerPage ?? PAGE_SIZE,
            });
        } catch (e) {
            setError(getErrorMessage(e));
            setRefunds([]);
        } finally {
            setIsLoading(false);
        }
    }, [page, debouncedSearch, statusFilter]);

    useEffect(() => {
        void loadRefunds();
    }, [loadRefunds]);

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
        setError(null);

        try {
            if (actionDialog.action === 'complete') {
                await refundService.complete(actionDialog.refund.id);
                toast.success(
                    'Đã đánh dấu hoàn tiền thành công. Ghế của đơn đã được mở lại.'
                );
            }

            if (actionDialog.action === 'reject') {
                await refundService.reject(actionDialog.refund.id);
                toast.success('Đã từ chối yêu cầu hoàn vé');
            }

            setActionDialog(null);
            setDetailRefund(null);
            await loadRefunds();
        } catch (e) {
            const message = getErrorMessage(e);
            setError(message);
            toast.error(message || 'Xử lý yêu cầu hoàn vé thất bại');
        } finally {
            setActionSubmitting(false);
        }
    };

    const isEmpty = !isLoading && refunds.length === 0;

    return (
        <div className="space-y-4">
            <PageHeader
                title="Quản lý yêu cầu hoàn vé"
                description="Theo dõi yêu cầu hoàn tiền, thông tin ngân hàng và xử lý hoàn vé thủ công cho khách hàng."
            />

            {error && refunds.length > 0 ? (
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
                        onClick={() => void loadRefunds()}
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
                    options={refundStatusFilterOptions}
                    value={statusFilter}
                    onChange={setStatusFilter}
                />
            </AdminToolbar>

            {isLoading ? (
                <AdminLoadingState
                    rows={6}
                    columns={9}
                    minWidth="min-w-[1180px]"
                />
            ) : isEmpty ? (
                <AdminEmptyState
                    title={
                        error
                            ? 'Không tải được danh sách'
                            : 'Chưa có yêu cầu hoàn vé'
                    }
                    description={
                        error ||
                        'Các yêu cầu hoàn vé từ khách hàng sẽ được hiển thị tại đây.'
                    }
                    actionLabel={error ? 'Thử lại' : undefined}
                    onAction={error ? () => void loadRefunds() : undefined}
                />
            ) : (
                <>
                    <RefundTable
                        refunds={refunds}
                        onViewDetail={handleOpenDetail}
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

            <RefundDetailDialog
                open={Boolean(detailRefund)}
                refund={detailRefund}
                onOpenChange={(isOpen) => {
                    if (!isOpen && !actionSubmitting) setDetailRefund(null);
                }}
                onComplete={handleOpenComplete}
                onReject={handleOpenReject}
            />

            <RefundActionDialog
                open={Boolean(actionDialog)}
                action={actionDialog?.action}
                refund={actionDialog?.refund}
                submitting={actionSubmitting}
                onOpenChange={(isOpen) => {
                    if (!isOpen && !actionSubmitting) setActionDialog(null);
                }}
                onConfirm={() => void handleActionConfirm()}
            />
        </div>
    );
}

export default Refunds;
