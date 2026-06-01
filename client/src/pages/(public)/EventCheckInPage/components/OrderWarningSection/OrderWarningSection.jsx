import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import StatusBadge from '../StatusBadge/StatusBadge';

function OrderWarningSection({ orderStatus, isCancelled, order, sepay }) {
    const Icon = orderStatus.icon;

    const canReturnToPayment =
        !isCancelled && orderStatus.tone === 'warning' && order?.id && sepay;

    return (
        <section className="rounded-3xl border border-red-400/20 bg-red-400/10 p-5 backdrop-blur-xl">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-red-400/10 text-red-300">
                    <Icon className="size-7" />
                </div>

                <div className="min-w-0 flex-1 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <div className="flex flex-wrap items-center gap-3">
                            <h2 className="text-xl font-bold text-(--text-primary)">
                                {orderStatus.title}
                            </h2>

                            <StatusBadge tone={orderStatus.tone}>
                                {orderStatus.label}
                            </StatusBadge>
                        </div>

                        <p className="mt-2 max-w-3xl text-sm leading-6 text-(--text-primary)/65">
                            {orderStatus.description}
                        </p>

                        {isCancelled ? (
                            <p className="mt-3 text-sm leading-6 text-red-200/80">
                                Bạn không cần xuất trình QR cho đơn hàng này vì
                                hệ thống chưa phát hành vé.
                            </p>
                        ) : null}
                    </div>

                    {canReturnToPayment ? (
                        <Link
                            to={`/payment/qr/${order.id}`}
                            state={{
                                order,
                                sepay,
                            }}
                            className="inline-flex w-fit shrink-0 items-center justify-center gap-2 rounded-2xl bg-yellow-400 px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-yellow-300"
                        >
                            Quay lại thanh toán
                            <ArrowRight className="size-4" />
                        </Link>
                    ) : null}
                </div>
            </div>
        </section>
    );
}

export default OrderWarningSection;
