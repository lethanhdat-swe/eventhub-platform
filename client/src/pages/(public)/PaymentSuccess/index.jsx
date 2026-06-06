import { Link, useLocation, useParams } from 'react-router-dom';
import { CheckCircle2, Home, Mail, ShieldCheck, Ticket } from 'lucide-react';

function PaymentSuccessPage() {
  const { orderId } = useParams();
  const location = useLocation();
  const order = location.state?.order;
  const displayOrderId = order?.orderCode ?? orderId;
  const orderLabel = order?.orderCode ? 'Mã đơn hàng' : 'Mã tham chiếu';

  return (
    <div className="relative isolate mx-auto flex min-h-[calc(100vh+160px)] w-full max-w-295 items-center justify-center overflow-hidden px-5 py-[calc(var(--header-height)+48px)] lg:px-8">
      <div className="absolute left-1/2 top-28 -z-10 size-80 -translate-x-1/2 rounded-full bg-(--primary-color)/20 blur-3xl" />
      <div className="absolute rounded-full right-12 top-36 -z-10 size-56 bg-emerald-500/15 blur-3xl" />
      <div className="absolute bottom-28 left-10 -z-10 size-64 rounded-full bg-(--primary-color)/10 blur-3xl" />

      <section className="relative w-full max-w-215 overflow-hidden rounded-3xl border border-(--text-primary)/10 bg-(--surface-color)/90 p-6 text-center shadow-[0_32px_110px_rgba(0,0,0,0.18)] backdrop-blur-xl lg:p-10">
        <div className="absolute inset-x-10 top-0 h-px bg-linear-to-r from-transparent via-(--primary-color)/80 to-transparent" />
        <div className="absolute rounded-full -right-20 -top-20 size-48 bg-emerald-500/10 blur-3xl" />

        <div className="mx-auto flex size-24 items-center justify-center rounded-full bg-linear-to-br from-emerald-400/25 via-emerald-500/15 to-(--primary-color)/20 p-2 shadow-[0_24px_70px_rgba(16,185,129,0.22)]">
          <div className="flex size-full items-center justify-center rounded-full border border-emerald-500/25 bg-(--background-color)/80 text-emerald-500">
            <CheckCircle2 size={48} />
          </div>
        </div>

        <p className="mt-6 text-sm font-semibold uppercase tracking-[0.22em] text-(--primary-color)">
          Thanh toán hoàn tất
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-(--text-primary) lg:text-4xl">
          Thanh toán thành công
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-(--text-primary)/65">
          Vé của bạn đã được xác nhận. Chúng tôi đã gửi vé qua email.
        </p>

        <div className="mx-auto mt-8 max-w-2xl rounded-3xl border border-(--text-primary)/10 bg-(--background-color)/55 p-5 text-left">
          <div className="grid gap-4">
            <div className="flex items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-(--primary-color)/10 text-(--primary-color)">
                <Ticket size={20} />
              </div>
              <div className="min-w-0">
                <p className="text-sm text-(--text-primary)/55">
                  {orderLabel}
                </p>
                <p className="mt-1 break-all font-mono text-base font-bold text-(--text-primary)">
                  {displayOrderId ?? '—'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 border-t border-(--text-primary)/10 pt-4">
              <div className="flex items-center justify-center size-10 shrink-0 rounded-2xl bg-emerald-500/10 text-emerald-500">
                <ShieldCheck size={20} />
              </div>
              <div>
                <p className="text-sm text-(--text-primary)/55">Trạng thái</p>
                <p className="mt-1 font-semibold text-emerald-500">
                  Đã thanh toán
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 border-t border-(--text-primary)/10 pt-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-(--primary-color)/10 text-(--primary-color)">
                <Mail size={20} />
              </div>
              <div>
                <p className="text-sm text-(--text-primary)/55">Hướng dẫn</p>
                <p className="mt-1 font-medium text-(--text-primary)">
                  Vui lòng kiểm tra email để nhận vé và mã QR.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 mt-8 sm:flex-row sm:justify-center">
          <Link
            to="/profile"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-(--primary-color) px-6 py-3 font-semibold text-white shadow-[0_16px_50px_rgba(124,58,237,0.32)] transition hover:-translate-y-0.5 hover:opacity-90"
          >
            <Ticket size={18} />
            Xem vé của tôi
          </Link>
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-(--text-primary)/10 bg-(--background-color)/70 px-6 py-3 font-semibold text-(--text-primary) transition hover:border-(--primary-color)/40 hover:text-(--primary-color)"
          >
            <Home size={18} />
            Về trang chủ
          </Link>
        </div>

        <Link
          to="/events"
          className="mt-6 inline-flex text-sm font-semibold text-(--primary-color) hover:underline"
        >
          Tiếp tục khám phá sự kiện
        </Link>
      </section>
    </div>
  );
}

export default PaymentSuccessPage;
