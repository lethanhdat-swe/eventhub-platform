import { useEffect, useMemo, useState } from 'react';

import { images } from '@/assets';
import { getErrorMessage } from '@/lib/http/apiError';
import { orderService } from '@/lib/services/admin/orderService';
import { resolvePublicAssetUrl } from '@/lib/url/resolvePublicAssetUrl';
import OrderCard from './components/OrderCard/OrderCard';
import OrderFilter from './components/OrderFilter/OrderFilter';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const statusLabels = {
  PAID: 'Đã đặt',
  PENDING: 'Đang xử lý',
  CANCELLED: 'Đã hủy',
};

const dateFormatter = new Intl.DateTimeFormat('vi-VN', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

const priceFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0,
});

function formatDateRange(startDate, endDate) {
  if (!startDate) return 'Chưa cập nhật thời gian';

  const start = dateFormatter.format(new Date(startDate));
  if (!endDate) return start;

  const end = dateFormatter.format(new Date(endDate));
  return start === end ? start : `${start} - ${end}`;
}

function formatTicketTypes(ticketTypes = []) {
  if (!ticketTypes.length) return 'Chưa có hạng vé';

  return ticketTypes
    .map(
      (type) => `${type.name}${type.quantity > 1 ? ` x${type.quantity}` : ''}`
    )
    .join(', ');
}

function mapOrderCard(order) {
  const event = order.event ?? {};

  return {
    id: order.id,
    ticketCode: order.orderCode ? `#${order.orderCode}` : '—',
    title: event.title ?? 'Sự kiện',
    image: resolvePublicAssetUrl(event.bannerUrl) || images.home,
    date: formatDateRange(event.startDate, event.endDate),
    location: event.location ?? 'Chưa cập nhật địa điểm',
    quantity: `${order.ticketCount ?? 0} vé`,
    zone: formatTicketTypes(order.ticketTypes),
    status: statusLabels[order.status] ?? order.status,
    rawStatus: order.status,
    amount: priceFormatter.format(order.finalAmount ?? order.totalAmount ?? 0),
    href: `/event-checkin/${order.id}`,
  };
}

function TicketOrder() {
  const [orders, setOrders] = useState([]);
  const [activeStatus, setActiveStatus] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;

    async function loadOrders() {
      setIsLoading(true);
      setError(null);

      try {
        const payload = await orderService.getMyOrders({
          page: 1,
          limit: 4,
        });

        if (!ignore) {
          setOrders(payload.data ?? []);
        }
      } catch (err) {
        if (!ignore) {
          setError(getErrorMessage(err));
          setOrders([]);
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    void loadOrders();

    return () => {
      ignore = true;
    };
  }, []);

  const counts = useMemo(
    () =>
      orders.reduce(
        (acc, order) => {
          acc.all += 1;
          acc[order.status] = (acc[order.status] ?? 0) + 1;
          return acc;
        },
        { all: 0, PAID: 0, PENDING: 0, CANCELLED: 0 }
      ),
    [orders]
  );

  const visibleOrders = useMemo(() => {
    const filtered =
      activeStatus === 'all'
        ? orders
        : orders.filter((order) => order.status === activeStatus);

    return filtered.map(mapOrderCard);
  }, [activeStatus, orders]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <OrderFilter
          value={activeStatus}
          counts={counts}
          onChange={setActiveStatus}
        />

        <Link
          to="/my-tickets"
          className="
          inline-flex items-center justify-center gap-2
          rounded-full border border-[var(--border-color)]
          bg-[var(--card-surface-color)]
          px-4 py-2.5
          text-sm font-medium text-[var(--text-primary)]
          shadow-[0_14px_35px_rgba(0,0,0,0.16)]
          transition-all duration-300
          hover:border-[var(--primary-color)]/50
          hover:bg-[var(--soft-surface-color)]
          hover:text-[var(--primary-color)]
          active:scale-95
        "
        >
          Xem tất cả vé
          <ArrowRight size={16} />
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-96 animate-pulse rounded-3xl border border-(--text-primary)/10 bg-(--text-primary)/5"
            />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-5 text-sm text-red-300">
          {error}
        </div>
      ) : visibleOrders.length === 0 ? (
        <div className="rounded-3xl border border-(--text-primary)/10 bg-(--text-primary)/5 p-8 text-center text-(--text-primary)">
          Bạn chưa đặt vé nào
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {visibleOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}

export default TicketOrder;
