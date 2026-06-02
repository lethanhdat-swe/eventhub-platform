import { ArrowLeft, Ticket } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { images } from '@/assets';
import { getErrorMessage } from '@/lib/http/apiError';
import { orderService } from '@/lib/services/admin/orderService';
import { resolvePublicAssetUrl } from '@/lib/url/resolvePublicAssetUrl';
import OrderFilter from '../Profile/components/ProfileOrders/components/TicketOrder/components/OrderFilter/OrderFilter';
import OrderCard from '../Profile/components/ProfileOrders/components/TicketOrder/components/OrderCard/OrderCard';

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

function MyTickets() {
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
          limit: 100,
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
    <main className="min-h-screen bg-(--background-color) pt-[calc(var(--header-height)+10px)] pb-14">
      <section className="container space-y-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link
              to="/profile"
              className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-(--muted-text) transition-colors hover:text-(--primary-color)"
            >
              <ArrowLeft size={16} />
              Quay lại trang cá nhân
            </Link>

            <div className="max-w-3xl">
              <h1 className="mt-5 max-w-2xl text-3xl font-black leading-tight tracking-[-0.04em] text-(--text-primary) sm:text-5xl">
                Quản lý vé của bạn
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-(--muted-text) sm:text-base">
                Xem lại các vé đã đặt, kiểm tra trạng thái đơn hàng và mở mã
                check-in cho từng sự kiện khi cần.
              </p>
            </div>
          </div>
        </div>

        <OrderFilter
          value={activeStatus}
          counts={counts}
          onChange={setActiveStatus}
        />

        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="h-96 animate-pulse rounded-3xl border border-(--border-color) bg-(--soft-surface-color)"
              />
            ))}
          </div>
        ) : error ? (
          <div className="p-5 text-sm font-semibold text-red-300 border rounded-3xl border-red-500/20 bg-red-500/10">
            {error}
          </div>
        ) : visibleOrders.length === 0 ? (
          <div className="rounded-3xl border border-(--border-color) bg-(--card-surface-color) p-10 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-(--primary-color)/10 text-(--primary-color)">
              <Ticket size={26} />
            </div>

            <h2 className="text-lg font-black text-(--text-primary)">
              Chưa có vé nào
            </h2>

            <p className="mt-2 text-sm text-(--muted-text)">
              Khi bạn đặt vé thành công, vé sẽ xuất hiện tại đây.
            </p>

            <Link
              to="/events"
              className="mt-6 inline-flex items-center justify-center rounded-full bg-(--primary-color) px-5 py-2.5 text-sm font-black text-white transition-transform active:scale-95"
            >
              Khám phá sự kiện
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {visibleOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default MyTickets;
