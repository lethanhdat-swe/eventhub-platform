import { AlertTriangle, CheckCircle2, Loader2, XCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { formatCurrency } from '@/pages/(admin)/Refunds/data';

const dialogContent = {
    complete: {
        title: 'Xác nhận đã hoàn tiền?',
        icon: CheckCircle2,
        iconClass: 'text-emerald-600',
        description:
            'Hệ thống sẽ đánh dấu yêu cầu là đã hoàn tiền, chuyển đơn hàng sang đã hoàn và mở lại ghế để tiếp tục bán.',
        confirmLabel: 'Xác nhận hoàn tiền',
        confirmVariant: 'default',
    },
    reject: {
        title: 'Từ chối yêu cầu hoàn vé?',
        icon: XCircle,
        iconClass: 'text-red-600',
        description:
            'Hệ thống sẽ từ chối yêu cầu hoàn vé và chuyển đơn hàng quay lại trạng thái đã thanh toán.',
        confirmLabel: 'Từ chối yêu cầu',
        confirmVariant: 'destructive',
    },
};

function RefundActionDialog({
    open,
    action,
    refund,
    submitting,
    onOpenChange,
    onConfirm,
}) {
    const config = action ? dialogContent[action] : null;
    const Icon = config?.icon ?? AlertTriangle;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[460px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Icon className={`size-5 ${config?.iconClass ?? ''}`} />
                        {config?.title}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 text-sm">
                    <p className="text-muted-foreground">
                        {config?.description}
                    </p>

                    {refund ? (
                        <div className="rounded-lg border bg-muted/30 p-3">
                            <div className="grid grid-cols-[120px_1fr] gap-y-2">
                                <span className="text-muted-foreground">
                                    Mã đơn
                                </span>
                                <span className="font-medium">
                                    {refund.orderCode}
                                </span>

                                <span className="text-muted-foreground">
                                    Khách hàng
                                </span>
                                <span className="font-medium">
                                    {refund.customerName}
                                </span>

                                <span className="text-muted-foreground">
                                    Ngân hàng
                                </span>
                                <span>
                                    {refund.bankName} -{' '}
                                    {refund.bankAccountNumber}
                                </span>

                                <span className="text-muted-foreground">
                                    Chủ tài khoản
                                </span>
                                <span>{refund.bankAccountHolder}</span>

                                <span className="text-muted-foreground">
                                    Số tiền hoàn
                                </span>
                                <span className="font-semibold">
                                    {formatCurrency(refund.refundAmount)} (
                                    {refund.refundPercent}%)
                                </span>
                            </div>
                        </div>
                    ) : null}
                </div>

                <DialogFooter className="-mx-0 -mb-0 flex flex-row flex-nowrap items-center justify-between gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        className="h-9"
                        disabled={submitting}
                        onClick={() => onOpenChange(false)}
                    >
                        Hủy
                    </Button>

                    <Button
                        type="button"
                        variant={config?.confirmVariant}
                        className="h-9"
                        disabled={submitting}
                        onClick={onConfirm}
                    >
                        {submitting ? (
                            <Loader2 className="mr-2 size-4 animate-spin" />
                        ) : null}
                        {config?.confirmLabel}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default RefundActionDialog;
