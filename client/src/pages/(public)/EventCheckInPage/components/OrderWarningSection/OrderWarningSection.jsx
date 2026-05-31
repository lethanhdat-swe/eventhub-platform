import StatusBadge from '../StatusBadge/StatusBadge';

function OrderWarningSection({ orderStatus, isCancelled }) {
  const Icon = orderStatus.icon;

  return (
    <section className="rounded-3xl border border-red-400/20 bg-red-400/10 p-5 backdrop-blur-xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-red-400/10 text-red-300">
          <Icon className="size-7" />
        </div>

        <div className="min-w-0">
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
              Bạn không cần xuất trình QR cho đơn hàng này vì hệ thống chưa phát
              hành vé.
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export default OrderWarningSection;
