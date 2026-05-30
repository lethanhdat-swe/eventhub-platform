import { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  Armchair,
  Ban,
  CalendarDays,
  CheckCircle2,
  Circle,
  Clock3,
  Crown,
  Download,
  LockKeyhole,
  MapPin,
  ReceiptText,
  ShieldCheck,
  Ticket,
  User,
  XCircle,
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

import { images } from '@/assets';
import { getErrorMessage } from '@/lib/http/apiError';
import { orderService } from '@/lib/services/admin/orderService';
import { resolvePublicAssetUrl } from '@/lib/url/resolvePublicAssetUrl';

const moneyFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0,
});

const dateTimeFormatter = new Intl.DateTimeFormat('vi-VN', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

const dateFormatter = new Intl.DateTimeFormat('vi-VN', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

function getOrderPayload(payload) {
  return payload?.data ?? payload ?? null;
}

function formatDateTime(value) {
  if (!value) return '—';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return '—';

  return dateTimeFormatter.format(date);
}

function formatEventDate(startDate, endDate) {
  if (!startDate) return 'Chưa cập nhật thời gian';

  const startDateObj = new Date(startDate);

  if (Number.isNaN(startDateObj.getTime())) {
    return 'Thời gian không hợp lệ';
  }

  const start = dateFormatter.format(startDateObj);

  if (!endDate) return start;

  const endDateObj = new Date(endDate);

  if (Number.isNaN(endDateObj.getTime())) return start;

  const end = dateFormatter.format(endDateObj);

  return start === end ? start : `${start} - ${end}`;
}

function formatMoney(value) {
  if (value == null) return '—';

  return moneyFormatter.format(Number(value || 0));
}

function getSeatLabel(ticket) {
  const seat = ticket?.eventSeat;

  if (!seat) return '—';

  const label = [seat.rowLabel, seat.seatNumber]
    .filter((value) => value != null && value !== '')
    .join('');

  return label || '—';
}

function getTicketQrImageUrl(token) {
  if (!token) return null;

  return `https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encodeURIComponent(
    token
  )}`;
}

function getShortCode(value) {
  if (!value) return '—';

  return String(value).slice(0, 12).toUpperCase();
}

function isPaidOrder(order) {
  return order?.status === 'PAID';
}

function isPendingOrder(order) {
  return order?.status === 'PENDING';
}

function isCancelledOrder(order) {
  return order?.status === 'CANCELLED';
}

function getOrderStatusMeta(order) {
  switch (order?.status) {
    case 'PAID':
      return {
        tone: 'success',
        label: 'Đã thanh toán',
        title: 'Thanh toán thành công',
        description: order?.paidAt
          ? `Đơn hàng đã thanh toán lúc ${formatDateTime(order.paidAt)}.`
          : 'Đơn hàng đã được thanh toán thành công.',
        icon: ShieldCheck,
      };

    case 'PENDING':
      return {
        tone: 'warning',
        label: 'Chờ thanh toán',
        title: 'Đơn hàng đang chờ thanh toán',
        description:
          'Sau khi thanh toán thành công, hệ thống sẽ phát hành vé và mã QR check-in.',
        icon: AlertTriangle,
      };

    case 'CANCELLED':
      return {
        tone: 'destructive',
        label: 'Đã hủy',
        title: 'Đơn hàng không thành công',
        description:
          'Đơn hàng đã bị hủy hoặc thanh toán không hoàn tất, nên vé chưa được phát hành.',
        icon: Ban,
      };

    default:
      return {
        tone: 'neutral',
        label: order?.status || 'Không xác định',
        title: 'Trạng thái chưa xác định',
        description: 'Hệ thống chưa xác định được trạng thái của đơn hàng này.',
        icon: AlertTriangle,
      };
  }
}

function getTicketState(order, ticket) {
  const orderMeta = getOrderStatusMeta(order);

  if (!isPaidOrder(order)) {
    return {
      canShowQr: false,
      tone: orderMeta.tone,
      label: orderMeta.label,
      title: orderMeta.title,
      description: orderMeta.description,
      icon: orderMeta.icon,
    };
  }

  if (!ticket) {
    return {
      canShowQr: false,
      tone: 'warning',
      label: 'Chưa phát hành vé',
      title: 'Chưa có dữ liệu vé',
      description:
        'Đơn hàng đã thanh toán nhưng hệ thống chưa trả về vé. Vui lòng thử tải lại hoặc liên hệ hỗ trợ.',
      icon: AlertTriangle,
    };
  }

  if (ticket.isCheckedIn) {
    return {
      canShowQr: false,
      tone: 'destructive',
      label: 'Đã sử dụng',
      title: 'Vé đã được check-in',
      description: ticket.checkedInAt
        ? `Vé này đã được sử dụng lúc ${formatDateTime(ticket.checkedInAt)}.`
        : 'Vé này đã được sử dụng trước đó.',
      icon: LockKeyhole,
    };
  }

  if (!ticket.qrSecureToken) {
    return {
      canShowQr: false,
      tone: 'warning',
      label: 'Thiếu QR',
      title: 'Chưa có mã QR',
      description:
        'Vé đã được phát hành nhưng chưa có mã QR. Vui lòng thử lại sau.',
      icon: AlertTriangle,
    };
  }

  return {
    canShowQr: true,
    tone: 'success',
    label: 'Vé hợp lệ',
    title: 'QR Check-in',
    description: 'Xuất trình mã QR này tại cổng check-in của sự kiện.',
    icon: ShieldCheck,
  };
}

function StatusBadge({ children, tone = 'neutral' }) {
  const tones = {
    success: 'border-emerald-400/25 bg-emerald-400/10 text-emerald-300',
    warning: 'border-yellow-400/25 bg-yellow-400/10 text-yellow-300',
    destructive: 'border-red-400/25 bg-red-400/10 text-red-300',
    neutral:
      'border-(--text-primary)/15 bg-(--text-primary)/5 text-(--text-primary)',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${
        tones[tone] ?? tones.neutral
      }`}
    >
      {children}
    </span>
  );
}

function InfoRow({ icon, label, value, children }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-(--text-primary)/10 py-3 last:border-0">
      <div className="flex min-w-0 items-center gap-3 text-(--text-primary)/55">
        <span className="shrink-0 rounded-xl bg-(--primary-color)/10 p-2 text-(--primary-color)">
          {icon}
        </span>

        <span className="text-xs font-semibold uppercase tracking-[0.18em]">
          {label}
        </span>
      </div>

      <div className="max-w-[58%] text-right text-sm font-semibold text-(--text-primary)">
        {children ?? value ?? '—'}
      </div>
    </div>
  );
}

function TimelineItem({ active, tone = 'neutral', label, description }) {
  const Icon = active ? CheckCircle2 : Circle;

  const toneClass = active
    ? tone === 'destructive'
      ? 'text-red-300'
      : tone === 'warning'
        ? 'text-yellow-300'
        : 'text-emerald-300'
    : 'text-(--text-primary)/30';

  return (
    <div className="flex gap-3">
      <Icon className={`mt-0.5 size-5 shrink-0 ${toneClass}`} />

      <div>
        <p className="text-sm font-semibold text-(--text-primary)">{label}</p>
        <p className="mt-0.5 text-xs leading-5 text-(--text-primary)/50">
          {description}
        </p>
      </div>
    </div>
  );
}

function EmptyQrState({ state }) {
  const Icon = state.icon || AlertTriangle;
  const isWarning = state.tone === 'warning';

  return (
    <div className="flex aspect-square flex-col items-center justify-center rounded-2xl px-6 text-center">
      <div
        className={`mb-4 flex size-16 items-center justify-center rounded-2xl ${
          isWarning
            ? 'bg-yellow-400/10 text-yellow-300'
            : 'bg-red-400/10 text-red-300'
        }`}
      >
        <Icon className="size-8" />
      </div>

      <p className="text-base font-bold text-(--text-primary)">{state.title}</p>

      <p className="mt-2 max-w-[280px] text-sm leading-6 text-(--text-primary)/55">
        {state.description}
      </p>
    </div>
  );
}

function EventCheckInPage() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;

    async function loadOrder() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await orderService.getMyOrderDetail(id);
        const data = getOrderPayload(response);

        if (ignore) return;

        setOrder(data);
        setSelectedTicketId(data?.tickets?.[0]?.id ?? null);
      } catch (err) {
        if (ignore) return;

        setError(getErrorMessage(err));
        setOrder(null);
        setSelectedTicketId(null);
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    if (id) {
      void loadOrder();
    } else {
      setIsLoading(false);
      setError('Không tìm thấy mã đơn hàng.');
    }

    return () => {
      ignore = true;
    };
  }, [id]);

  const tickets = useMemo(() => order?.tickets ?? [], [order]);

  const selectedTicket = useMemo(() => {
    return (
      tickets.find((ticket) => ticket.id === selectedTicketId) ??
      tickets[0] ??
      null
    );
  }, [selectedTicketId, tickets]);

  const event = order?.event ?? {};
  const orderMeta = getOrderStatusMeta(order);
  const ticketState = getTicketState(order, selectedTicket);

  const bannerUrl = resolvePublicAssetUrl(event.bannerUrl) || images.home;
  const qrUrl = ticketState.canShowQr
    ? getTicketQrImageUrl(selectedTicket?.qrSecureToken)
    : null;

  const selectedSeatLabel = getSeatLabel(selectedTicket);
  const selectedTicketType = selectedTicket?.ticketType;
  const selectedTicketTypeName = selectedTicketType?.name ?? '—';

  if (isLoading) {
    return (
      <div className="px-4 pt-[calc(var(--header-height)+32px)] pb-10 sm:px-8">
        <div className="mx-auto grid max-w-[1180px] gap-5">
          <div className="h-72 animate-pulse rounded-3xl bg-(--text-primary)/5" />

          <div className="grid gap-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(360px,0.9fr)]">
            <div className="h-96 animate-pulse rounded-3xl bg-(--text-primary)/5" />
            <div className="h-96 animate-pulse rounded-3xl bg-(--text-primary)/5" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="px-4 pt-[calc(var(--header-height)+32px)] pb-10 sm:px-8">
        <div className="mx-auto max-w-[760px] rounded-3xl border border-red-500/20 bg-red-500/10 p-8 text-center text-red-200">
          <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-2xl bg-red-400/10 text-red-300">
            <XCircle className="size-8" />
          </div>

          <p className="text-xl font-semibold">Không tải được thông tin vé</p>

          <p className="mt-2 text-sm leading-6 text-red-200/80">
            {error ?? 'Không tìm thấy đơn hàng.'}
          </p>

          <Link
            to="/profile"
            className="mt-5 inline-flex rounded-full border border-red-300/20 px-4 py-2 text-sm font-semibold transition hover:bg-red-300/10"
          >
            Quay lại hồ sơ
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pt-[calc(var(--header-height)+32px)] pb-10 sm:px-8">
      <div className="mx-auto flex max-w-[1180px] flex-col gap-5">
        <section className="relative overflow-hidden rounded-3xl border border-(--primary-color)/20 bg-[#050816] shadow-[0_0_48px_rgba(168,85,247,0.12)]">
          <img
            src={bannerUrl}
            alt={event.title ?? 'Event banner'}
            className="absolute inset-0 h-full w-full object-cover opacity-45"
          />

          <div className="absolute inset-0 bg-linear-to-r from-[#050816] via-[#050816]/85 to-[#050816]/35" />
          <div className="absolute inset-0 bg-linear-to-br from-(--primary-color)/25 via-transparent to-blue-500/15" />

          <div className="relative flex min-h-72 flex-col justify-end gap-5 p-6 sm:p-8 lg:p-10">
            <div className="flex flex-wrap items-center gap-3">
              <StatusBadge tone={orderMeta.tone}>{orderMeta.label}</StatusBadge>
              <StatusBadge>{tickets.length} vé</StatusBadge>
              <StatusBadge>{order.orderCode}</StatusBadge>
            </div>

            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.28em] text-(--primary-color)">
                EventHub Ticket Pass
              </p>

              <h1 className="max-w-3xl text-3xl font-bold text-(--text-primary) sm:text-5xl">
                {event.title ?? 'Sự kiện'}
              </h1>

              <div className="mt-5 flex flex-wrap gap-4 text-sm text-(--text-primary)/75">
                <span className="flex items-center gap-2">
                  <CalendarDays className="size-4 text-(--primary-color)" />
                  {formatEventDate(event.startDate, event.endDate)}
                </span>

                <span className="flex items-center gap-2">
                  <MapPin className="size-4 text-(--primary-color)" />
                  {event.location ?? 'Chưa cập nhật địa điểm'}
                </span>
              </div>
            </div>
          </div>
        </section>

        {!isPaidOrder(order) ? (
          <section className="rounded-3xl border border-red-400/20 bg-red-400/10 p-5 backdrop-blur-xl">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-red-400/10 text-red-300">
                <orderMeta.icon className="size-7" />
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-xl font-bold text-(--text-primary)">
                    {orderMeta.title}
                  </h2>

                  <StatusBadge tone={orderMeta.tone}>
                    {orderMeta.label}
                  </StatusBadge>
                </div>

                <p className="mt-2 max-w-3xl text-sm leading-6 text-(--text-primary)/65">
                  {orderMeta.description}
                </p>

                {isCancelledOrder(order) ? (
                  <p className="mt-3 text-sm leading-6 text-red-200/80">
                    Bạn không cần xuất trình QR cho đơn hàng này vì hệ thống
                    chưa phát hành vé.
                  </p>
                ) : null}
              </div>
            </div>
          </section>
        ) : null}

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(360px,0.9fr)]">
          <div className="flex flex-col gap-5">
            <section className="rounded-3xl border border-(--text-primary)/10 bg-(--text-primary)/4 p-4 backdrop-blur-xl sm:p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-(--primary-color)">
                    Danh sách vé
                  </p>

                  <h2 className="mt-1 text-xl font-bold text-(--text-primary)">
                    {tickets.length > 0
                      ? `${tickets.length} vé trong đơn hàng`
                      : isPaidOrder(order)
                        ? 'Chưa phát hành vé'
                        : 'Không có vé được phát hành'}
                  </h2>
                </div>
              </div>

              {tickets.length > 0 ? (
                <div className="flex gap-3 overflow-x-auto pb-1 lg:grid lg:grid-cols-2 lg:overflow-visible">
                  {tickets.map((ticket, index) => {
                    const isActive = selectedTicket?.id === ticket.id;
                    const itemState = getTicketState(order, ticket);

                    return (
                      <button
                        key={ticket.id}
                        type="button"
                        onClick={() => setSelectedTicketId(ticket.id)}
                        className={`min-w-[230px] rounded-2xl border p-4 text-left transition-all ${
                          isActive
                            ? 'border-(--primary-color)/60 bg-(--primary-color)/12 shadow-[0_0_28px_rgba(168,85,247,0.18)]'
                            : 'border-(--text-primary)/10 bg-black/15 hover:border-(--primary-color)/30'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-semibold text-(--text-primary)">
                            Vé {index + 1}
                          </p>

                          <StatusBadge tone={itemState.tone}>
                            {itemState.label}
                          </StatusBadge>
                        </div>

                        <p className="mt-4 text-2xl font-bold text-(--text-primary)">
                          Ghế {getSeatLabel(ticket)}
                        </p>

                        <div className="mt-2 flex items-center gap-2 text-sm text-(--text-primary)/55">
                          {ticket.ticketType?.color ? (
                            <span
                              className="size-2.5 rounded-full"
                              style={{
                                backgroundColor: ticket.ticketType.color,
                              }}
                            />
                          ) : null}

                          <span>{ticket.ticketType?.name ?? '—'}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div
                  className={`rounded-2xl border p-5 text-sm leading-6 ${
                    isPaidOrder(order)
                      ? 'border-yellow-400/20 bg-yellow-400/10 text-yellow-200'
                      : 'border-red-400/20 bg-red-400/10 text-red-200'
                  }`}
                >
                  {isPaidOrder(order)
                    ? 'Đơn hàng đã thanh toán nhưng chưa có dữ liệu vé. Đây có thể là lỗi phát hành vé, vui lòng thử tải lại hoặc liên hệ hỗ trợ.'
                    : 'Đơn hàng chưa thanh toán thành công nên hệ thống không phát hành vé check-in.'}
                </div>
              )}
            </section>

            <section className="rounded-3xl border border-(--text-primary)/10 bg-(--text-primary)/4 p-5 backdrop-blur-xl">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-(--primary-color)">
                    Thông tin vé
                  </p>

                  <p className="mt-2 text-sm leading-6 text-(--text-primary)/55">
                    Chi tiết của vé đang được chọn.
                  </p>
                </div>

                <StatusBadge tone={ticketState.tone}>
                  {ticketState.label}
                </StatusBadge>
              </div>

              <div className="mt-4">
                <InfoRow
                  icon={<Crown className="size-4" />}
                  label="Hạng vé"
                  value={selectedTicketTypeName}
                />

                <InfoRow
                  icon={<Armchair className="size-4" />}
                  label="Số ghế"
                  value={selectedSeatLabel}
                />

                <InfoRow
                  icon={<User className="size-4" />}
                  label="Người đặt"
                  value={order.user?.name ?? '—'}
                />

                <InfoRow
                  icon={<Ticket className="size-4" />}
                  label="Mã vé"
                  value={getShortCode(selectedTicket?.id)}
                />

                <InfoRow
                  icon={<ShieldCheck className="size-4" />}
                  label="Trạng thái"
                >
                  <StatusBadge tone={ticketState.tone}>
                    {ticketState.label}
                  </StatusBadge>
                </InfoRow>

                <InfoRow
                  icon={<Clock3 className="size-4" />}
                  label="Check-in"
                  value={formatDateTime(selectedTicket?.checkedInAt)}
                />
              </div>
            </section>

            <section className="rounded-3xl border border-(--text-primary)/10 bg-(--text-primary)/4 p-5 backdrop-blur-xl">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-(--primary-color)">
                    Thông tin đơn hàng
                  </p>

                  <p className="mt-2 text-sm leading-6 text-(--text-primary)/55">
                    Tổng quan thanh toán và thời gian tạo đơn.
                  </p>
                </div>

                <StatusBadge tone={orderMeta.tone}>
                  {orderMeta.label}
                </StatusBadge>
              </div>

              <div className="mt-4">
                <InfoRow
                  icon={<ReceiptText className="size-4" />}
                  label="Mã đơn"
                  value={order.orderCode}
                />

                <InfoRow
                  icon={<ShieldCheck className="size-4" />}
                  label="Thanh toán"
                >
                  <StatusBadge tone={orderMeta.tone}>
                    {orderMeta.label}
                  </StatusBadge>
                </InfoRow>

                <InfoRow
                  icon={<Ticket className="size-4" />}
                  label="Số lượng"
                  value={`${tickets.length} vé`}
                />

                <InfoRow
                  icon={<ReceiptText className="size-4" />}
                  label="Tổng tiền"
                  value={formatMoney(order.totalAmount)}
                />

                <InfoRow
                  icon={<ReceiptText className="size-4" />}
                  label="Thành tiền"
                  value={formatMoney(order.finalAmount)}
                />

                <InfoRow
                  icon={<CalendarDays className="size-4" />}
                  label="Ngày đặt"
                  value={formatDateTime(order.createdAt)}
                />

                <InfoRow
                  icon={<Clock3 className="size-4" />}
                  label="Ngày thanh toán"
                  value={formatDateTime(order.paidAt)}
                />
              </div>
            </section>
          </div>

          <aside className="flex flex-col gap-5 lg:sticky lg:top-[calc(var(--header-height)+24px)] lg:self-start">
            <section className="overflow-hidden rounded-3xl border border-(--primary-color)/25 bg-[#080B16]/90 p-5 shadow-[0_0_42px_rgba(168,85,247,0.14)] backdrop-blur-xl">
              <div className="mb-5 flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.26em] text-(--primary-color)">
                    Mã check-in
                  </p>

                  <h2 className="mt-1 text-2xl font-bold text-(--text-primary)">
                    {ticketState.title}
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-(--text-primary)/55">
                    {ticketState.description}
                  </p>
                </div>

                <StatusBadge tone={ticketState.tone}>
                  {ticketState.label}
                </StatusBadge>
              </div>

              <div
                className={`rounded-3xl p-4 ${
                  qrUrl
                    ? 'bg-white'
                    : 'border border-(--text-primary)/10 bg-(--text-primary)/5'
                }`}
              >
                {qrUrl ? (
                  <img
                    src={qrUrl}
                    alt="QR check-in"
                    className="mx-auto aspect-square w-full max-w-[320px] rounded-2xl object-contain"
                  />
                ) : (
                  <EmptyQrState state={ticketState} />
                )}
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3 rounded-2xl border border-(--text-primary)/10 bg-(--text-primary)/5 p-4">
                <div>
                  <p className="text-xs text-(--text-primary)/45">Ghế</p>

                  <p className="mt-1 text-lg font-bold text-(--text-primary)">
                    {selectedSeatLabel}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-(--text-primary)/45">Hạng vé</p>

                  <p className="mt-1 text-lg font-bold text-(--text-primary)">
                    {selectedTicketTypeName}
                  </p>
                </div>
              </div>

              {qrUrl ? (
                <a
                  href={qrUrl}
                  download={`ticket-${order.orderCode}-${selectedSeatLabel}.png`}
                  className="mt-4 flex items-center justify-center gap-2 rounded-2xl border border-(--primary-color)/25 bg-(--primary-color)/10 px-4 py-3 text-sm font-semibold text-(--primary-color) transition hover:border-(--primary-color)/50 hover:bg-(--primary-color)/15"
                >
                  <Download className="size-4" />
                  Tải QR
                </a>
              ) : null}
            </section>

            <section className="rounded-3xl border border-(--text-primary)/10 bg-(--text-primary)/4 p-5 backdrop-blur-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-(--primary-color)">
                Trạng thái xử lý
              </p>

              <div className="mt-5 space-y-4">
                <TimelineItem
                  active={isPaidOrder(order)}
                  tone={orderMeta.tone}
                  label="Thanh toán"
                  description={orderMeta.description}
                />

                <TimelineItem
                  active={tickets.length > 0}
                  tone={
                    tickets.length > 0
                      ? 'success'
                      : isPaidOrder(order)
                        ? 'warning'
                        : 'destructive'
                  }
                  label="Phát hành vé"
                  description={
                    tickets.length > 0
                      ? `${tickets.length} vé đã được phát hành.`
                      : isPaidOrder(order)
                        ? 'Đơn hàng đã thanh toán nhưng chưa có vé.'
                        : 'Đơn hàng không thành công nên không phát hành vé.'
                  }
                />

                <TimelineItem
                  active={Boolean(selectedTicket?.isCheckedIn)}
                  tone={selectedTicket?.isCheckedIn ? 'destructive' : 'neutral'}
                  label="Check-in"
                  description={
                    selectedTicket?.isCheckedIn
                      ? selectedTicket.checkedInAt
                        ? `Đã check-in lúc ${formatDateTime(
                            selectedTicket.checkedInAt
                          )}`
                        : 'Vé đã được sử dụng.'
                      : tickets.length > 0
                        ? 'Vé chưa được check-in.'
                        : 'Không có vé để check-in.'
                  }
                />
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default EventCheckInPage;
