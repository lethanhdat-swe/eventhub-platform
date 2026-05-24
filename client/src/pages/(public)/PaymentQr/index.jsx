import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  Building2,
  CheckCircle2,
  Clock,
  Copy,
  CreditCard,
  QrCode,
} from 'lucide-react';

import { orderService } from '@/lib/services/admin';
import { paymentService } from '@/lib/services/payment';

const COUNTDOWN_SECONDS = 15 * 60;

function formatCurrency(value) {
  return `${Number(value || 0).toLocaleString('vi-VN')} đ`;
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0');
  const remainingSeconds = (seconds % 60).toString().padStart(2, '0');

  return `${minutes}:${remainingSeconds}`;
}

function DetailRow({ icon: Icon, label, value, action, valueClassName = '' }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-(--text-primary)/10 bg-(--surface-color)/45 p-4">
      <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-(--primary-color)/10 text-(--primary-color)">
        <Icon size={18} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm text-(--text-primary)/55">{label}</p>
        <div
          className={`mt-1 wrap-break-word font-semibold text-(--text-primary) ${valueClassName}`}
        >
          {value}
        </div>
      </div>

      {action}
    </div>
  );
}

function CopyButton({ value, copied, onCopy }) {
  return (
    <button
      type="button"
      onClick={() => onCopy(value)}
      className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-(--primary-color)/30 px-3 py-2 text-sm font-semibold text-(--primary-color) transition hover:bg-(--primary-color)/10"
    >
      {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
      {copied ? 'Đã copy' : 'Sao chép'}
    </button>
  );
}

function PaymentQrPage() {
  const { orderId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state ?? {};
  const order = state.order ?? null;
  const sepay = state.sepay ?? null;
  const hasExpiredHandledRef = useRef(false);
  const hasTerminalStatusRef = useRef(false);
  const [remainingSeconds, setRemainingSeconds] = useState(COUNTDOWN_SECONDS);
  const [copiedField, setCopiedField] = useState('');

  const hasPaymentInfo = Boolean(order && sepay);
  const displayOrderId = order?.id ?? orderId;
  const amount = sepay?.amount ?? 0;
  const bankCode = sepay?.bankCode ?? '';
  const accountNumber = sepay?.accountNumber ?? '';
  const accountName = sepay?.accountName ?? '';
  const transferContent = sepay?.transferContent ?? '';

  const isExpired = remainingSeconds === 0;
  const canPollOrder = hasPaymentInfo && Boolean(order?.id) && !isExpired;
  const progressPercent = useMemo(
    () => Math.round((remainingSeconds / COUNTDOWN_SECONDS) * 100),
    [remainingSeconds]
  );

  useEffect(() => {
    if (!canPollOrder) return undefined;

    let isMounted = true;
    let isChecking = false;

    const checkOrderStatus = async () => {
      if (isChecking || hasTerminalStatusRef.current) return;

      isChecking = true;

      try {
        const latestOrder = await orderService.getDetail(order.id);
        const status = latestOrder?.status;

        if (!isMounted) return;

        if (status === 'PAID') {
          hasTerminalStatusRef.current = true;
          navigate(`/payment-success/${order.id}`, {
            replace: true,
            state: {
              order: latestOrder,
              sepay,
            },
          });
          return;
        }

        if (status === 'CANCELLED') {
          hasTerminalStatusRef.current = true;
          navigate(`/payment-failed/${order.id}`, {
            replace: true,
            state: {
              order: latestOrder,
              sepay,
            },
          });
        }
      } catch (error) {
        console.error('Failed to poll payment status:', error);
      } finally {
        isChecking = false;
      }
    };

    checkOrderStatus();
    const intervalId = window.setInterval(checkOrderStatus, 3000);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
  }, [canPollOrder, navigate, order?.id, sepay]);

  useEffect(() => {
    if (!hasPaymentInfo) return undefined;

    if (remainingSeconds === 0) {
      // TODO: Call payment failed API here when the real payment flow is connected.
      return undefined;
    }

    const timerId = window.setInterval(() => {
      setRemainingSeconds((seconds) => Math.max(seconds - 1, 0));
    }, 1000);

    return () => window.clearInterval(timerId);
  }, [hasPaymentInfo, remainingSeconds]);

  useEffect(() => {
    if (
      !hasPaymentInfo ||
      !order?.id ||
      !isExpired ||
      hasExpiredHandledRef.current ||
      hasTerminalStatusRef.current
    ) {
      return undefined;
    }

    hasExpiredHandledRef.current = true;

    const handleExpiredPayment = async () => {
      try {
        await paymentService.postPaymentFailed({ orderCode: order.orderCode });
      } catch (error) {
        console.error('Failed to mark payment as failed:', error);
      } finally {
        navigate(`/payment-failed/${order.id}`, {
          replace: true,
          state: {
            order,
            sepay,
            reason: 'expired',
          },
        });
      }
    };

    handleExpiredPayment();

    return undefined;
  }, [hasPaymentInfo, isExpired, navigate, order, sepay]);

  useEffect(() => {
    if (!copiedField) return undefined;

    const timeoutId = window.setTimeout(() => setCopiedField(''), 1500);

    return () => window.clearTimeout(timeoutId);
  }, [copiedField]);

  const handleCopy = async (value) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(value);
    } catch {
      setCopiedField('');
    }
  };

  const StatusIcon = isExpired ? AlertCircle : CheckCircle2;

  if (!hasPaymentInfo) {
    return (
      <div className="pt-(--header-height) mx-auto mb-8 flex min-h-[calc(100vh-var(--header-height))] w-full max-w-[760px] items-center px-5 lg:px-8">
        <section className="w-full rounded-3xl border border-(--text-primary)/10 bg-(--surface-color)/80 p-6 text-center shadow-[0_24px_80px_rgba(0,0,0,0.10)] lg:p-8">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500">
            <AlertCircle size={28} />
          </div>
          <h1 className="mt-5 text-2xl font-bold text-(--text-primary)">
            Không tìm thấy thông tin thanh toán
          </h1>
          <p className="mt-3 text-(--text-primary)/60">
            Không tìm thấy thông tin thanh toán. Vui lòng quay lại trang đặt vé.
          </p>
          <Link
            to="/booking"
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl bg-(--primary-color) px-5 py-3 font-semibold text-white transition hover:opacity-90"
          >
            <ArrowLeft size={18} />
            Quay lại trang đặt vé
          </Link>
        </section>
      </div>
    );
  }

  return (
    <div className="pt-(--header-height) mx-auto mb-8 w-full max-w-[1320px] px-5 lg:px-8">
      <div className="mt-4 flex flex-col gap-4">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <Link
            to="/payment"
            state={state}
            className="inline-flex w-fit items-center gap-2 rounded-full border border-(--text-primary)/10 bg-(--surface-color)/60 px-4 py-2 text-sm font-medium text-(--text-primary)/70 transition hover:border-(--primary-color)/40 hover:text-(--primary-color)"
          >
            <ArrowLeft size={16} />
            Quay lại PaymentPage
          </Link>

          <div className="inline-flex w-fit items-center gap-2 rounded-full bg-(--primary-color)/10 px-3 py-1.5 text-sm font-semibold text-(--primary-color)">
            <QrCode size={16} />
            SePay QR Transfer
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6 lg:gap-8">
          <section className="col-span-12 rounded-3xl border border-(--text-primary)/10 bg-(--surface-color)/80 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.10)] lg:col-span-7 lg:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-(--primary-color)">
                  QR Payment
                </p>
                <h1 className="mt-2 text-2xl font-bold text-(--text-primary)">
                  Thanh toán đơn hàng
                </h1>
                <p className="mt-2 text-sm text-(--text-primary)/60">
                  Quét mã QR bằng ứng dụng ngân hàng để hoàn tất đặt vé.
                </p>
              </div>

              <div
                className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold ${
                  isExpired
                    ? 'bg-red-500/10 text-red-500'
                    : 'bg-amber-500/10 text-amber-500'
                }`}
              >
                <StatusIcon size={16} />
                {isExpired ? 'Hết thời gian thanh toán' : 'Đang chờ thanh toán'}
              </div>
            </div>

            <div className="mt-5 flex justify-center">
              <div className="rounded-[2rem] border border-gray-200 bg-white p-4 shadow-[0_20px_60px_rgba(0,0,0,0.16)] sm:p-5">
                <img
                  src={sepay.qrUrl}
                  alt="Mã QR thanh toán EventHub"
                  className="h-64 w-64 rounded-2xl object-contain sm:h-72 sm:w-72 xl:h-80 xl:w-80"
                />
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-(--primary-color)/20 bg-(--primary-color)/10 p-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex size-11 items-center justify-center rounded-2xl bg-(--primary-color)/15 text-(--primary-color)">
                    <Clock size={22} />
                  </div>
                  <div>
                    <p className="text-sm text-(--text-primary)/60">
                      Thời gian còn lại
                    </p>
                    <p className="text-3xl font-bold tracking-tight text-(--text-primary)">
                      {formatTime(remainingSeconds)}
                    </p>
                  </div>
                </div>

                <p className="text-sm font-medium text-(--text-primary)/65">
                  {isExpired
                    ? 'Phiên thanh toán đã hết thời gian.'
                    : 'Vui lòng hoàn tất trước khi hết giờ.'}
                </p>
              </div>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-(--text-primary)/10">
                <div
                  className="h-full rounded-full bg-(--primary-color) transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <div className="mt-4 flex gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm text-(--text-primary)/70">
              <AlertCircle
                className="mt-0.5 shrink-0 text-amber-500"
                size={18}
              />
              <p>
                Vui lòng không đóng trang trong khi chờ xác nhận thanh toán.
              </p>
            </div>
          </section>

          <aside className="col-span-12 space-y-4 lg:col-span-5">
            <section className="rounded-3xl border border-(--text-primary)/10 bg-(--surface-color)/80 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.10)]">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-(--primary-color)">
                    Payment Details
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-(--text-primary)">
                    Thông tin chuyển khoản
                  </h2>
                </div>
                <div className="flex size-12 items-center justify-center rounded-2xl border border-(--text-primary)/10 bg-(--background-color)/80">
                  <CreditCard color="var(--primary-color)" size={24} />
                </div>
              </div>

              <div className="mt-5 space-y-3">
                <DetailRow
                  icon={CreditCard}
                  label="Số tiền"
                  value={formatCurrency(amount)}
                  valueClassName="text-xl text-(--primary-color)"
                />
                <DetailRow
                  icon={Building2}
                  label="Ngân hàng"
                  value={bankCode}
                />
                <DetailRow
                  icon={CreditCard}
                  label="Số tài khoản"
                  value={accountNumber}
                  action={
                    <CopyButton
                      value={accountNumber}
                      copied={copiedField === accountNumber}
                      onCopy={handleCopy}
                    />
                  }
                />
                <DetailRow
                  icon={CheckCircle2}
                  label="Chủ tài khoản"
                  value={accountName}
                />
              </div>

              <div className="mt-4 rounded-2xl border border-(--primary-color)/25 bg-(--primary-color)/10 p-4">
                <p className="text-sm text-(--text-primary)/60">
                  Nội dung chuyển khoản
                </p>
                <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <p className="flex-1 break-all rounded-xl bg-(--background-color)/70 px-4 py-3 font-mono text-base font-bold text-(--text-primary)">
                    {transferContent}
                  </p>
                  <CopyButton
                    value={transferContent}
                    copied={copiedField === transferContent}
                    onCopy={handleCopy}
                  />
                </div>
              </div>

              <div className="mt-4 flex gap-3 rounded-2xl border border-amber-500/25 bg-amber-500/10 p-4 text-sm text-(--text-primary)/75">
                <AlertTriangle
                  className="mt-0.5 shrink-0 text-amber-500"
                  size={18}
                />
                <p>
                  Vui lòng không thay đổi nội dung chuyển khoản. Nếu thay đổi,
                  hệ thống có thể không tự động xác nhận thanh toán.
                </p>
              </div>
            </section>

            <section className="rounded-3xl border border-(--text-primary)/10 bg-(--surface-color)/80 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.10)]">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-(--primary-color)">
                Đơn hàng
              </p>

              <div className="mt-4 grid gap-3 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-(--text-primary)/55">Sự kiện</span>
                  <span className="max-w-56 text-right font-semibold text-(--text-primary)">
                    {order.event?.title ?? 'EventHub'}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-(--text-primary)/55">Địa điểm</span>
                  <span className="max-w-56 text-right font-semibold text-(--text-primary)">
                    {order.event?.location ?? 'N/A'}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-(--text-primary)/55">Thời gian</span>
                  <span className="text-right font-semibold text-(--text-primary)">
                    {order.event?.startDate
                      ? new Date(order.event.startDate).toLocaleString(
                          'vi-VN',
                          {
                            dateStyle: 'medium',
                            timeStyle: 'short',
                          }
                        )
                      : 'N/A'}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-(--text-primary)/55">Số lượng vé</span>
                  <span className="font-semibold text-(--text-primary)">
                    {order.ticketCount ?? order.orderSeats?.length ?? 'N/A'}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-(--text-primary)/55">Tổng tiền</span>
                  <span className="font-semibold text-(--primary-color)">
                    {Number(order.totalAmount ?? 0).toLocaleString('vi-VN')}đ
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-(--text-primary)/55">Trạng thái</span>
                  <span className="rounded-full bg-yellow-500/10 px-2.5 py-1 text-xs font-semibold text-yellow-500">
                    {order.status === 'PENDING'
                      ? 'Đang chờ thanh toán'
                      : order.status}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-(--text-primary)/55">Mã đơn hàng</span>
                  <span className="font-mono font-semibold text-(--text-primary)">
                    {displayOrderId}
                  </span>
                </div>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default PaymentQrPage;
