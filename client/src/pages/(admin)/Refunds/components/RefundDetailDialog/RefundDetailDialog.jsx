import { CheckCircle2, XCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    formatCurrency,
    formatDateTime,
    REFUND_ORDER_STATUS_LABELS,
} from '@/pages/(admin)/Refunds/data';
import RefundStatusBadge from '../RefundStatusBadge/RefundStatusBadge';

function DetailRow({ label, children }) {
    return (
        <div className="grid grid-cols-[130px_1fr] gap-x-4 gap-y-1 text-sm">
            <span className="text-muted-foreground">{label}</span>
            <div className="min-w-0 font-medium break-words">{children}</div>
        </div>
    );
}

function RefundDetailDialog({
    open,
    refund,
    onOpenChange,
    onComplete,
    onReject,
}) {
    if (!refund) return null;

    const isPending = refund.status === 'PENDING';
    const orderStatusLabel =
        REFUND_ORDER_STATUS_LABELS[refund.orderStatus] ?? refund.orderStatus;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="flex max-h-[90vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-[520px]">
                <DialogHeader className="border-b px-5 py-4">
                    <div className="flex items-start justify-between gap-3 pr-6">
                        <DialogTitle>Chi tiết yêu cầu hoàn vé</DialogTitle>
                        <RefundStatusBadge status={refund.status} />
                    </div>
                </DialogHeader>

                <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-5 py-4">
                    <section className="space-y-3">
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            Đơn hàng
                        </p>
                        <div className="space-y-2.5 rounded-lg border bg-muted/30 p-3">
                            <DetailRow label="Mã đơn">
                                {refund.orderCode}
                            </DetailRow>
                            <DetailRow label="Trạng thái đơn">
                                {orderStatusLabel}
                            </DetailRow>
                            <DetailRow label="Tổng đơn">
                                {formatCurrency(refund.orderTotalAmount)}
                            </DetailRow>
                        </div>
                    </section>

                    <section className="space-y-3">
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            Khách hàng
                        </p>
                        <div className="space-y-2.5 rounded-lg border bg-muted/30 p-3">
                            <DetailRow label="Họ tên">
                                {refund.customerName}
                            </DetailRow>
                            <DetailRow label="Email">
                                {refund.customerEmail}
                            </DetailRow>
                            <DetailRow label="Số điện thoại">
                                {refund.customerPhone}
                            </DetailRow>
                        </div>
                    </section>

                    <section className="space-y-3">
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            Ngân hàng nhận hoàn
                        </p>
                        <div className="space-y-2.5 rounded-lg border bg-muted/30 p-3">
                            <DetailRow label="Ngân hàng">
                                {refund.bankName}
                            </DetailRow>
                            <DetailRow label="Số tài khoản">
                                {refund.bankAccountNumber}
                            </DetailRow>
                            <DetailRow label="Chủ tài khoản">
                                {refund.bankAccountHolder}
                            </DetailRow>
                        </div>
                    </section>

                    <section className="space-y-3">
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            Hoàn tiền
                        </p>
                        <div className="space-y-2.5 rounded-lg border bg-muted/30 p-3">
                            <DetailRow label="Số tiền hoàn">
                                <span className="text-primary">
                                    {formatCurrency(refund.refundAmount)}
                                </span>
                            </DetailRow>
                            <DetailRow label="Tỷ lệ hoàn">
                                {refund.refundPercent}%
                            </DetailRow>
                        </div>
                    </section>

                    {refund.note ? (
                        <section className="space-y-3">
                            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                Ghi chú
                            </p>
                            <p className="rounded-lg border bg-muted/30 p-3 text-sm leading-6">
                                {refund.note}
                            </p>
                        </section>
                    ) : null}

                    <section className="space-y-2.5 text-sm text-muted-foreground">
                        <DetailRow label="Ngày tạo">
                            {formatDateTime(refund.createdAt)}
                        </DetailRow>
                        {refund.updatedAt ? (
                            <DetailRow label="Cập nhật lúc">
                                {formatDateTime(refund.updatedAt)}
                            </DetailRow>
                        ) : null}
                    </section>
                </div>

                <DialogFooter
                    className={`-mx-0 -mb-0 flex flex-row flex-nowrap items-center gap-3 border-t bg-muted/20 px-5 py-4 ${
                        isPending ? 'justify-between' : 'justify-end'
                    }`}
                >
                    {isPending ? (
                        <div className="flex shrink-0 flex-nowrap items-center gap-2">
                            <Button
                                type="button"
                                className="h-9 gap-1.5"
                                onClick={() => onComplete(refund)}
                            >
                                <CheckCircle2 className="size-4" />
                                Hoàn tất
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                className="h-9 gap-1.5 border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
                                onClick={() => onReject(refund)}
                            >
                                <XCircle className="size-4" />
                                Từ chối
                            </Button>
                        </div>
                    ) : null}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default RefundDetailDialog;
