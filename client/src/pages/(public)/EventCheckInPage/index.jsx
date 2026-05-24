import { useEffect, useMemo, useState } from "react";
import {
  Armchair,
  CalendarDays,
  CheckCircle2,
  Circle,
  Clock3,
  Crown,
  Download,
  MapPin,
  ReceiptText,
  ShieldCheck,
  Ticket,
  User,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";

import { images } from "@/assets";
import { getErrorMessage } from "@/lib/http/apiError";
import { orderService } from "@/lib/services/admin/orderService";
import { resolvePublicAssetUrl } from "@/lib/url/resolvePublicAssetUrl";

const orderStatusLabels = {
  PAID: "Đã thanh toán",
  PENDING: "Đang xử lý",
  CANCELLED: "Đã hủy",
};

const moneyFormatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0,
});

const dateTimeFormatter = new Intl.DateTimeFormat("vi-VN", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

const dateFormatter = new Intl.DateTimeFormat("vi-VN", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

function formatDateTime(value) {
  if (!value) return "—";
  return dateTimeFormatter.format(new Date(value));
}

function formatEventDate(startDate, endDate) {
  if (!startDate) return "Chưa cập nhật thời gian";
  const start = dateFormatter.format(new Date(startDate));
  if (!endDate) return start;
  const end = dateFormatter.format(new Date(endDate));
  return start === end ? start : `${start} - ${end}`;
}

function formatMoney(value) {
  if (value == null) return "—";
  return moneyFormatter.format(value);
}

function getSeatLabel(ticket) {
  const seat = ticket?.eventSeat;
  if (!seat) return "—";
  return [seat.rowLabel, seat.seatNumber]
    .filter((value) => value != null && value !== "")
    .join("");
}

function getTicketQrImageUrl(token) {
  if (!token) return null;
  return `https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encodeURIComponent(token)}`;
}

function getShortCode(value) {
  if (!value) return "—";
  return value.slice(0, 10).toUpperCase();
}

function StatusBadge({ children, tone = "neutral" }) {
  const tones = {
    success: "border-emerald-400/25 bg-emerald-400/10 text-emerald-300",
    warning: "border-yellow-400/25 bg-yellow-400/10 text-yellow-300",
    destructive: "border-red-400/25 bg-red-400/10 text-red-300",
    neutral: "border-(--text-primary)/15 bg-(--text-primary)/5 text-(--text-primary)",
  };

  return (
    <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${tones[tone]}`}>
      {children}
    </span>
  );
}

function InfoRow({ icon, label, value, children }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-(--text-primary)/10 py-3 last:border-0">
      <div className="flex items-center gap-3 text-(--text-primary)/55">
        <span className="rounded-xl bg-(--primary-color)/10 p-2 text-(--primary-color)">
          {icon}
        </span>
        <span className="text-xs font-semibold uppercase tracking-[0.18em]">
          {label}
        </span>
      </div>
      <div className="max-w-[55%] text-right text-sm font-semibold text-(--text-primary)">
        {children ?? value}
      </div>
    </div>
  );
}

function TimelineItem({ active, label, description }) {
  const Icon = active ? CheckCircle2 : Circle;

  return (
    <div className="flex gap-3">
      <Icon
        className={`mt-0.5 size-5 ${active ? "text-emerald-300" : "text-(--text-primary)/30"}`}
      />
      <div>
        <p className="text-sm font-semibold text-(--text-primary)">{label}</p>
        <p className="text-xs text-(--text-primary)/50">{description}</p>
      </div>
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
        const data = await orderService.getMyOrderDetail(id);

        if (!ignore) {
          setOrder(data);
          setSelectedTicketId(data.tickets?.[0]?.id ?? null);
        }
      } catch (err) {
        if (!ignore) {
          setError(getErrorMessage(err));
          setOrder(null);
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    if (id) {
      void loadOrder();
    }

    return () => {
      ignore = true;
    };
  }, [id]);

  const tickets = useMemo(() => order?.tickets ?? [], [order]);
  const selectedTicket = useMemo(
    () =>
      tickets.find((ticket) => ticket.id === selectedTicketId) ??
      tickets[0] ??
      null,
    [selectedTicketId, tickets]
  );
  const event = order?.event ?? {};
  const bannerUrl = resolvePublicAssetUrl(event.bannerUrl) || images.home;
  const qrUrl = getTicketQrImageUrl(selectedTicket?.qrSecureToken);
  const selectedSeatLabel = getSeatLabel(selectedTicket);
  const selectedTicketType = selectedTicket?.ticketType;
  const ticketStatusTone = selectedTicket?.isCheckedIn ? "destructive" : "success";
  const ticketStatusText = selectedTicket?.isCheckedIn ? "Đã sử dụng" : "Vé hợp lệ";
  const orderStatusTone =
    order?.status === "PAID"
      ? "success"
      : order?.status === "PENDING"
        ? "warning"
        : "destructive";

  if (isLoading) {
    return (
      <div className="px-4 pt-[calc(var(--header-height)+32px)] pb-10 sm:px-8">
        <div className="mx-auto grid max-w-[1180px] gap-4">
          <div className="h-72 animate-pulse rounded-3xl bg-(--text-primary)/5" />
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(360px,0.9fr)]">
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
          <p className="text-xl font-semibold">Không tải được thông tin vé</p>
          <p className="mt-2 text-sm text-red-200/80">{error ?? "Order not found"}</p>
          <Link
            to="/profile"
            className="mt-5 inline-flex rounded-full border border-red-300/20 px-4 py-2 text-sm"
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
            alt={event.title}
            className="absolute inset-0 h-full w-full object-cover opacity-45"
          />
          <div className="absolute inset-0 bg-linear-to-r from-[#050816] via-[#050816]/85 to-[#050816]/35" />
          <div className="absolute inset-0 bg-linear-to-br from-(--primary-color)/25 via-transparent to-blue-500/15" />

          <div className="relative flex min-h-72 flex-col justify-end gap-5 p-6 sm:p-8 lg:p-10">
            <div className="flex flex-wrap items-center gap-3">
              <StatusBadge tone={orderStatusTone}>
                {orderStatusLabels[order.status] ?? order.status}
              </StatusBadge>
              <StatusBadge>{tickets.length} vé</StatusBadge>
              <StatusBadge>{order.orderCode}</StatusBadge>
            </div>

            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.28em] text-(--primary-color)">
                EventHub Ticket Pass
              </p>
              <h1 className="max-w-3xl text-3xl font-bold text-(--text-primary) sm:text-5xl">
                {event.title ?? "Sự kiện"}
              </h1>
              <div className="mt-5 flex flex-wrap gap-4 text-sm text-(--text-primary)/75">
                <span className="flex items-center gap-2">
                  <CalendarDays className="size-4 text-(--primary-color)" />
                  {formatEventDate(event.startDate, event.endDate)}
                </span>
                <span className="flex items-center gap-2">
                  <MapPin className="size-4 text-(--primary-color)" />
                  {event.location ?? "Chưa cập nhật địa điểm"}
                </span>
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(360px,0.9fr)]">
          <div className="flex flex-col gap-5">
            <section className="rounded-3xl border border-(--text-primary)/10 bg-(--text-primary)/4 p-4 backdrop-blur-xl sm:p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-(--primary-color)">
                    Chọn vé
                  </p>
                  <h2 className="mt-1 text-xl font-bold text-(--text-primary)">
                    {tickets.length} ticket trong đơn hàng
                  </h2>
                </div>
              </div>

              <div className="flex gap-3 overflow-x-auto pb-1 lg:grid lg:grid-cols-2 lg:overflow-visible">
                {tickets.map((ticket, index) => {
                  const isActive = selectedTicket?.id === ticket.id;
                  const ticketType = ticket.ticketType;

                  return (
                    <button
                      key={ticket.id}
                      type="button"
                      onClick={() => setSelectedTicketId(ticket.id)}
                      className={`min-w-[230px] rounded-2xl border p-4 text-left transition-all ${
                        isActive
                          ? "border-(--primary-color)/60 bg-(--primary-color)/12 shadow-[0_0_28px_rgba(168,85,247,0.18)]"
                          : "border-(--text-primary)/10 bg-black/15 hover:border-(--primary-color)/30"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-semibold text-(--text-primary)">
                          Ticket {index + 1}
                        </p>
                        <StatusBadge tone={ticket.isCheckedIn ? "destructive" : "success"}>
                          {ticket.isCheckedIn ? "Used" : "Valid"}
                        </StatusBadge>
                      </div>
                      <p className="mt-4 text-2xl font-bold text-(--text-primary)">
                        Ghế {getSeatLabel(ticket)}
                      </p>
                      <p className="mt-1 text-sm text-(--text-primary)/55">
                        {ticketType?.name ?? "—"}
                      </p>
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="rounded-3xl border border-(--text-primary)/10 bg-(--text-primary)/4 p-5 backdrop-blur-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-(--primary-color)">
                Thông tin vé
              </p>
              <div className="mt-4">
                <InfoRow
                  icon={<Crown className="size-4" />}
                  label="Hạng vé"
                  value={selectedTicketType?.name ?? "—"}
                />
                <InfoRow
                  icon={<Armchair className="size-4" />}
                  label="Số ghế"
                  value={selectedSeatLabel}
                />
                <InfoRow
                  icon={<User className="size-4" />}
                  label="Người đặt"
                  value={order.user?.name ?? "—"}
                />
                <InfoRow
                  icon={<Ticket className="size-4" />}
                  label="Mã vé"
                  value={getShortCode(selectedTicket?.id)}
                />
                <InfoRow icon={<ShieldCheck className="size-4" />} label="Trạng thái">
                  <StatusBadge tone={ticketStatusTone}>{ticketStatusText}</StatusBadge>
                </InfoRow>
                <InfoRow
                  icon={<Clock3 className="size-4" />}
                  label="Check-in"
                  value={formatDateTime(selectedTicket?.checkedInAt)}
                />
              </div>
            </section>

            <section className="rounded-3xl border border-(--text-primary)/10 bg-(--text-primary)/4 p-5 backdrop-blur-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-(--primary-color)">
                Thông tin đơn hàng
              </p>
              <div className="mt-4">
                <InfoRow
                  icon={<ReceiptText className="size-4" />}
                  label="Mã đơn"
                  value={order.orderCode}
                />
                <InfoRow icon={<ShieldCheck className="size-4" />} label="Thanh toán">
                  <StatusBadge tone={orderStatusTone}>
                    {orderStatusLabels[order.status] ?? order.status}
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
              <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.26em] text-(--primary-color)">
                    Mã check-in
                  </p>
                  <h2 className="mt-1 text-2xl font-bold text-(--text-primary)">
                    QR Pass
                  </h2>
                </div>
                <StatusBadge tone={ticketStatusTone}>{ticketStatusText}</StatusBadge>
              </div>

              <div className="rounded-3xl bg-white p-4">
                {qrUrl ? (
                  <img
                    src={qrUrl}
                    alt="QR check-in"
                    className="mx-auto aspect-square w-full max-w-[320px] rounded-2xl object-contain"
                  />
                ) : (
                  <div className="flex aspect-square items-center justify-center rounded-2xl text-sm text-zinc-500">
                    Không có mã QR
                  </div>
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
                    {selectedTicketType?.name ?? "—"}
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
                Trạng thái
              </p>
              <div className="mt-5 space-y-4">
                <TimelineItem
                  active={order.status === "PAID"}
                  label="Payment completed"
                  description={order.paidAt ? formatDateTime(order.paidAt) : "Đang chờ thanh toán"}
                />
                <TimelineItem
                  active={tickets.length > 0}
                  label="Ticket issued"
                  description={`${tickets.length} vé đã phát hành`}
                />
                <TimelineItem
                  active={Boolean(selectedTicket?.isCheckedIn)}
                  label="Checked in"
                  description={
                    selectedTicket?.checkedInAt
                      ? formatDateTime(selectedTicket.checkedInAt)
                      : "Chưa check-in"
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