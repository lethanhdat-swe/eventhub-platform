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

function getPaymentExpiredAt(order) {
  if (order?.paymentExpiredAt) {
    return new Date(order.paymentExpiredAt);
  }

  if (order?.expiresAt) {
    return new Date(order.expiresAt);
  }

  if (order?.createdAt) {
    return new Date(
      new Date(order.createdAt).getTime() + COUNTDOWN_SECONDS * 1000
    );
  }

  return null;
}

function getRemainingSeconds(order) {
  const expiredAt = getPaymentExpiredAt(order);

  if (!expiredAt) return COUNTDOWN_SECONDS;

  const diff = Math.floor((expiredAt.getTime() - Date.now()) / 1000);

  return Math.max(diff, 0);
}

function DetailRow({ icon: Icon, label, value, action, valueClassName = '' }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-(--text-primary)/10 bg-(--surface-color)/45 p-3 sm:p-4">
      <div className="mt-0.5 flex size-8 sm:size-9 shrink-0 items-center justify-center rounded-xl bg-(--primary-color)/10 text-(--primary-color)">
        <Icon size={16} />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-xs sm:text-sm text-(--text-primary)/55">{label}</p>

        <div
          className={`mt-1 break-all font-semibold text-(--text-primary) text-sm sm:text-base ${valueClassName}`}
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
      className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl border border-(--primary-color)/30 px-2.5 sm:px-3 py-2 text-xs sm:text-sm font-semibold text-(--primary-color) transition hover:bg-(--primary-color)/10"
    >
      {copied ? <CheckCircle2 size={14} /> : <Copy size={14} />}

      <span className="hidden xs:inline">
        {copied ? 'Đã copy' : 'Sao chép'}
      </span>
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

  const [remainingSeconds, setRemainingSeconds] = useState(() =>
    getRemainingSeconds(order)
  );
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

    const syncRemainingSeconds = () => {
      setRemainingSeconds(getRemainingSeconds(order));
    };

    syncRemainingSeconds();

    const timerId = window.setInterval(syncRemainingSeconds, 1000);

    return () => {
      window.clearInterval(timerId);
    };
  }, [hasPaymentInfo, order]);

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
        await paymentService.postPaymentFailed({
          orderCode: order.orderCode,
        });
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

    const timeoutId = window.setTimeout(() => {
      setCopiedField('');
    }, 1500);

    return () => {
      window.clearTimeout(timeoutId);
    };
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
      <div className="pt-(--header-height) mx-auto mb-8 flex min-h-[calc(100vh-var(--header-height))] w-full max-w-[760px] items-center px-4 sm:px-5 lg:px-8">
        <section className="w-full rounded-3xl border border-(--text-primary)/10 bg-(--surface-color)/80 p-5 sm:p-6 text-center shadow-[0_24px_80px_rgba(0,0,0,0.10)] lg:p-8">
          <div className="flex items-center justify-center mx-auto size-14 rounded-2xl bg-amber-500/10 text-amber-500">
            <AlertCircle size={28} />
          </div>

          <h1 className="mt-5 text-xl sm:text-2xl font-bold text-(--text-primary)">
            Không tìm thấy thông tin thanh toán
          </h1>

          <p className="mt-3 text-sm text-(--text-primary)/60">
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
    <div className="pt-(--header-height) mx-auto mb-8 w-full max-w-[1320px] px-4 sm:px-5 lg:px-8">
      <div className="flex flex-col gap-4 mt-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
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

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
          <section className="lg:col-span-7 rounded-3xl border border-(--text-primary)/10 bg-(--surface-color)/80 p-4 sm:p-5 shadow-[0_24px_80px_rgba(0,0,0,0.10)] lg:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-(--primary-color)">
                  QR Payment
                </p>

                <h1 className="mt-2 text-xl sm:text-2xl font-bold text-(--text-primary)">
                  Thanh toán đơn hàng
                </h1>

                <p className="mt-2 text-xs sm:text-sm text-(--text-primary)/60">
                  Quét mã QR bằng ứng dụng ngân hàng để hoàn tất đặt vé.
                </p>
              </div>

              <div
                className={`self-start inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs sm:text-sm font-semibold ${
                  isExpired
                    ? 'bg-red-500/10 text-red-500'
                    : 'bg-amber-500/10 text-amber-500'
                }`}
              >
                <StatusIcon size={15} />
                {isExpired ? 'Hết thời gian' : 'Đang chờ thanh toán'}
              </div>
            </div>

            <div className="flex justify-center mt-5">
              <div className="rounded-[2rem] border border-gray-200 bg-white p-3 sm:p-4 shadow-[0_20px_60px_rgba(0,0,0,0.16)]">
                <img
                  src={sepay.qrUrl}
                  alt="Mã QR thanh toán EventHub"
                  className="object-contain w-56 h-56 rounded-2xl sm:h-64 sm:w-64 xl:h-80 xl:w-80"
                />
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-(--primary-color)/20 bg-(--primary-color)/10 p-3 sm:p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 sm:size-11 items-center justify-center rounded-2xl bg-(--primary-color)/15 text-(--primary-color)">
                    <Clock size={20} />
                  </div>

                  <div>
                    <p className="text-xs sm:text-sm text-(--text-primary)/60">
                      Thời gian còn lại
                    </p>

                    <p className="text-2xl sm:text-3xl font-bold tracking-tight text-(--text-primary)">
                      {formatTime(remainingSeconds)}
                    </p>
                  </div>
                </div>

                <p className="text-xs sm:text-sm font-medium text-(--text-primary)/65">
                  {isExpired
                    ? 'Phiên thanh toán đã hết thời gian.'
                    : 'Vui lòng hoàn tất trước khi hết giờ.'}
                </p>
              </div>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-(--text-primary)/10">
                <div
                  className="h-full rounded-full bg-(--primary-color) transition-all duration-500"
                  style={{
                    width: `${progressPercent}%`,
                  }}
                />
              </div>
            </div>

            <div className="mt-4 flex gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-3 sm:p-4 text-xs sm:text-sm text-(--text-primary)/70">
              <AlertCircle
                className="mt-0.5 shrink-0 text-amber-500"
                size={16}
              />

              <p>
                Vui lòng không đóng trang trong khi chờ xác nhận thanh toán.
              </p>
            </div>
          </section>

          <aside className="space-y-4 lg:col-span-5">
            <section className="rounded-3xl border border-(--text-primary)/10 bg-(--surface-color)/80 p-4 sm:p-5 shadow-[0_24px_80px_rgba(0,0,0,0.10)]">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-(--primary-color)">
                    Payment Details
                  </p>

                  <h2 className="mt-2 text-xl sm:text-2xl font-bold text-(--text-primary)">
                    Thông tin chuyển khoản
                  </h2>
                </div>

                <div className="flex size-10 sm:size-12 shrink-0 items-center justify-center rounded-2xl border border-(--text-primary)/10 bg-(--background-color)/80">
                  <CreditCard color="var(--primary-color)" size={22} />
                </div>
              </div>

              <div className="mt-4 space-y-3 sm:mt-5">
                <DetailRow
                  icon={CreditCard}
                  label="Số tiền"
                  value={formatCurrency(amount)}
                  valueClassName="text-lg sm:text-xl text-(--primary-color)"
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

              <div className="mt-4 rounded-2xl border border-(--primary-color)/25 bg-(--primary-color)/10 p-3 sm:p-4">
                <p className="text-xs sm:text-sm text-(--text-primary)/60">
                  Nội dung chuyển khoản
                </p>

                <div className="flex flex-col gap-3 mt-3 sm:flex-row sm:items-center">
                  <p className="flex-1 break-all rounded-xl bg-(--background-color)/70 px-3 sm:px-4 py-2 sm:py-3 font-mono text-sm sm:text-base font-bold text-(--text-primary)">
                    {transferContent}
                  </p>

                  <CopyButton
                    value={transferContent}
                    copied={copiedField === transferContent}
                    onCopy={handleCopy}
                  />
                </div>
              </div>

              <div className="mt-4 flex gap-3 rounded-2xl border border-amber-500/25 bg-amber-500/10 p-3 sm:p-4 text-xs sm:text-sm text-(--text-primary)/75">
                <AlertTriangle
                  className="mt-0.5 shrink-0 text-amber-500"
                  size={16}
                />

                <p>
                  Vui lòng không thay đổi nội dung chuyển khoản. Nếu thay đổi,
                  hệ thống có thể không tự động xác nhận thanh toán.
                </p>
              </div>
            </section>

            <section className="rounded-3xl border border-(--text-primary)/10 bg-(--surface-color)/80 p-4 sm:p-5 shadow-[0_24px_80px_rgba(0,0,0,0.10)]">
              <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-(--primary-color)">
                Đơn hàng
              </p>

              <div className="grid gap-3 mt-4 text-xs sm:text-sm">
                {[
                  {
                    label: 'Sự kiện',
                    value: order.event?.title ?? 'EventHub',
                    className:
                      'max-w-[180px] sm:max-w-56 text-right font-semibold text-(--text-primary)',
                  },
                  {
                    label: 'Địa điểm',
                    value: order.event?.location ?? 'N/A',
                    className:
                      'max-w-[180px] sm:max-w-56 text-right font-semibold text-(--text-primary)',
                  },
                  {
                    label: 'Thời gian',
                    value: order.event?.startDate
                      ? new Date(order.event.startDate).toLocaleString(
                          'vi-VN',
                          {
                            dateStyle: 'medium',
                            timeStyle: 'short',
                          }
                        )
                      : 'N/A',
                    className: 'text-right font-semibold text-(--text-primary)',
                  },
                  {
                    label: 'Số lượng vé',
                    value:
                      order.ticketCount ?? order.orderSeats?.length ?? 'N/A',
                    className: 'font-semibold text-(--text-primary)',
                  },
                  {
                    label: 'Tổng tiền',
                    value: `${Number(order.totalAmount ?? 0).toLocaleString(
                      'vi-VN'
                    )}đ`,
                    className: 'font-semibold text-(--primary-color)',
                  },
                ].map(({ label, value, className }) => (
                  <div key={label} className="flex justify-between gap-4">
                    <span className="shrink-0 text-(--text-primary)/55">
                      {label}
                    </span>

                    <span className={className}>{value}</span>
                  </div>
                ))}

                <div className="flex justify-between gap-4">
                  <span className="shrink-0 text-(--text-primary)/55">
                    Trạng thái
                  </span>

                  <span className="rounded-full bg-yellow-500/10 px-2.5 py-1 text-xs font-semibold text-yellow-500">
                    {order.status === 'PENDING'
                      ? 'Đang chờ thanh toán'
                      : order.status}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="shrink-0 text-(--text-primary)/55">
                    Mã đơn hàng
                  </span>

                  <span className="font-mono text-xs font-semibold text-(--text-primary) break-all text-right">
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
