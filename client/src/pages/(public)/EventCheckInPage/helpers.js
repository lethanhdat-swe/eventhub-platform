import { AlertTriangle, Ban, LockKeyhole, ShieldCheck } from 'lucide-react';

export const moneyFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0,
});

export const dateTimeFormatter = new Intl.DateTimeFormat('vi-VN', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

export const dateFormatter = new Intl.DateTimeFormat('vi-VN', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

export function getOrderPayload(payload) {
  return payload?.data ?? payload ?? null;
}

export function formatDateTime(value) {
  if (!value) return '—';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return '—';

  return dateTimeFormatter.format(date);
}

export function formatEventDate(startDate, endDate) {
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

export function formatMoney(value) {
  if (value == null) return '—';

  return moneyFormatter.format(Number(value || 0));
}

export function getSeatLabel(ticket) {
  const seat = ticket?.eventSeat;

  if (!seat) return '—';

  const label = [seat.rowLabel, seat.seatNumber]
    .filter((value) => value != null && value !== '')
    .join('');

  return label || '—';
}

export function getTicketQrImageUrl(token) {
  if (!token) return null;

  return `https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encodeURIComponent(
    token
  )}`;
}

export function getShortCode(value) {
  if (!value) return '—';

  return String(value).slice(0, 12).toUpperCase();
}

export function isPaidOrder(order) {
  return order?.status === 'PAID';
}

export function isCancelledOrder(order) {
  return order?.status === 'CANCELLED';
}

export function getOrderStatusMeta(order) {
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

export function getTicketStatus(order, ticket) {
  const orderStatus = getOrderStatusMeta(order);

  if (!isPaidOrder(order)) {
    return {
      canShowQr: false,
      tone: orderStatus.tone,
      label: orderStatus.label,
      title: orderStatus.title,
      description: orderStatus.description,
      icon: orderStatus.icon,
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
