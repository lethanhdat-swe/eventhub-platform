import { useMemo, useState } from 'react';
import { RefreshCcw, ShieldCheck } from 'lucide-react';

import RefundRequestDialog from './RefundRequestDialog';

function getEventStartDate(order) {
    return (
        order?.event?.startDate ||
        order?.event?.start_date ||
        order?.startDate ||
        null
    );
}

function getRefundAvailability(order) {
    if (!order) {
        return {
            canRefund: false,
            statusText: 'Không tìm thấy đơn hàng',
            description: 'Không thể kiểm tra điều kiện hoàn vé.',
            refundPercent: null,
        };
    }

    const orderStatus = String(order.status || '').toUpperCase();

    if (orderStatus === 'REFUND_PENDING') {
        return {
            canRefund: false,
            statusText: 'Đang chờ hoàn tiền',
            description:
                'Yêu cầu hoàn vé của đơn hàng này đang chờ quản trị viên xử lý.',
            refundPercent: null,
        };
    }

    if (orderStatus === 'REFUNDED') {
        return {
            canRefund: false,
            statusText: 'Đã hoàn tiền',
            description: 'Đơn hàng này đã được xử lý hoàn tiền.',
            refundPercent: null,
        };
    }

    if (orderStatus === 'CANCELLED') {
        return {
            canRefund: false,
            statusText: 'Không thể hoàn vé',
            description:
                'Đơn hàng đã bị hủy nên không thể gửi yêu cầu hoàn vé.',
            refundPercent: null,
        };
    }

    if (orderStatus !== 'PAID') {
        return {
            canRefund: false,
            statusText: 'Chưa đủ điều kiện',
            description:
                'Chỉ đơn hàng đã thanh toán mới có thể gửi yêu cầu hoàn vé.',
            refundPercent: null,
        };
    }

    const eventStartDate = getEventStartDate(order);

    if (!eventStartDate) {
        return {
            canRefund: false,
            statusText: 'Thiếu ngày sự kiện',
            description:
                'Không thể kiểm tra chính sách hoàn vé do thiếu ngày diễn ra sự kiện.',
            refundPercent: null,
        };
    }

    const now = new Date();
    const startDate = new Date(eventStartDate);

    if (Number.isNaN(startDate.getTime())) {
        return {
            canRefund: false,
            statusText: 'Ngày sự kiện không hợp lệ',
            description: 'Không thể kiểm tra chính sách hoàn vé.',
            refundPercent: null,
        };
    }

    if (now >= startDate) {
        return {
            canRefund: false,
            statusText: 'Hết hạn hoàn vé',
            description:
                'Sự kiện đã diễn ra hoặc đã đến ngày diễn ra nên không thể hoàn vé.',
            refundPercent: null,
        };
    }

    const threeDaysBeforeEvent = new Date(startDate);
    threeDaysBeforeEvent.setDate(threeDaysBeforeEvent.getDate() - 3);

    const refundPercent = now <= threeDaysBeforeEvent ? 100 : 50;

    return {
        canRefund: true,
        statusText: `Có thể hoàn ${refundPercent}%`,
        description:
            refundPercent === 100
                ? 'Đơn hàng đủ điều kiện hoàn 100% vì yêu cầu được gửi trước 3 ngày diễn ra sự kiện.'
                : 'Đơn hàng đủ điều kiện hoàn 50% vì yêu cầu được gửi trong vòng 3 ngày trước sự kiện.',
        refundPercent,
    };
}

function RefundRequestSection({ order, onRefundSuccess }) {
    const [dialogOpen, setDialogOpen] = useState(false);

    const refundMeta = useMemo(() => getRefundAvailability(order), [order]);

    return (
        <>
            <section className="rounded-[24px] border border-[var(--border-color)] bg-[var(--card-surface-color)] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.18)]">
                <div className="">
                    <div>
                        <div className="min-w-0 flex-1">
                            <div className="mb-5 flex items-center justify-between">
                                <div className="mb-3 flex items-center gap-2">
                                    <span className="flex size-9 items-center justify-center rounded-full bg-[var(--soft-surface-color)] text-[var(--primary-color)]">
                                        <RefreshCcw className="size-4" />
                                    </span>

                                    <div>
                                        <p className="text-[11px] font-bold uppercase tracking-[0.32em] text-[var(--primary-color)]">
                                            Hoàn vé
                                        </p>
                                        <h2 className="mt-1 text-xl font-bold text-[var(--text-primary)]">
                                            Chính sách hoàn vé
                                        </h2>
                                    </div>
                                </div>
                                {refundMeta.canRefund ? (
                                    <button
                                        type="button"
                                        onClick={() => setDialogOpen(true)}
                                        className="inline-flex h-11 shrink-0 items-center justify-center rounded-full border border-[var(--border-color)] bg-[var(--primary-color)] px-5 text-sm font-bold text-white transition hover:opacity-90"
                                    >
                                        Yêu cầu hoàn vé
                                    </button>
                                ) : null}
                            </div>

                            <p className="max-w-2xl text-sm leading-6 text-[var(--muted-text)]">
                                Bạn có thể gửi yêu cầu hoàn vé nếu sự kiện chưa
                                diễn ra. Hệ thống sẽ kiểm tra mã đơn, email và
                                số điện thoại để bảo mật thông tin đơn hàng.
                            </p>

                            <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
                                <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--soft-surface-color)] p-4">
                                    <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-text)]">
                                        Trước 3 ngày
                                    </p>
                                    <p className="mt-2 text-lg font-bold text-[var(--text-primary)]">
                                        Hoàn 100%
                                    </p>
                                </div>

                                <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--soft-surface-color)] p-4">
                                    <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-text)]">
                                        Trong 3 ngày
                                    </p>
                                    <p className="mt-2 text-lg font-bold text-[var(--text-primary)]">
                                        Hoàn 50%
                                    </p>
                                </div>

                                <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--soft-surface-color)] p-4">
                                    <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-text)]">
                                        Đến ngày diễn ra
                                    </p>
                                    <p className="mt-2 text-lg font-bold text-[var(--text-primary)]">
                                        Không hoàn
                                    </p>
                                </div>
                            </div>

                            <div className="mt-4 flex items-start gap-2 rounded-2xl border border-[var(--border-color)] bg-[var(--soft-surface-color)] px-4 py-3">
                                <ShieldCheck className="mt-0.5 size-4 shrink-0 text-[var(--primary-color)]" />
                                <div>
                                    <p className="text-sm font-semibold text-[var(--text-primary)]">
                                        {refundMeta.statusText}
                                    </p>
                                    <p className="mt-1 text-sm leading-5 text-[var(--muted-text)]">
                                        {refundMeta.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <RefundRequestDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                order={order}
                expectedRefundPercent={refundMeta.refundPercent}
                onSuccess={onRefundSuccess}
            />
        </>
    );
}

export default RefundRequestSection;
