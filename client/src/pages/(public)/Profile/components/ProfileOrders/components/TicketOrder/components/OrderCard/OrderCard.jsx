import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

function OrderCard({ order }) {
  const getStatusStyle = (status) => {
    switch (status) {
      case 'Đã đặt':
        return {
          badge:
            'border-emerald-400/30 bg-emerald-500/20 text-emerald-300 shadow-[0_0_24px_rgba(16,185,129,0.28)]',
          dot: 'bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.9)]',
        };

      case 'Đang xử lý':
        return {
          badge:
            'border-yellow-400/35 bg-yellow-500/20 text-yellow-300 shadow-[0_0_24px_rgba(234,179,8,0.25)]',
          dot: 'bg-yellow-300 shadow-[0_0_12px_rgba(253,224,71,0.9)]',
        };

      case 'Đã hủy':
        return {
          badge:
            'border-red-400/35 bg-red-500/25 text-red-300 shadow-[0_0_24px_rgba(239,68,68,0.32)]',
          dot: 'bg-red-400 shadow-[0_0_12px_rgba(248,113,113,0.9)]',
        };

      case 'Đang chờ hoàn tiền':
        return {
          badge:
            'border-amber-400/35 bg-amber-500/20 text-amber-300 shadow-[0_0_24px_rgba(245,158,11,0.25)]',
          dot: 'bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.9)]',
        };

      case 'Đã hoàn tiền':
        return {
          badge:
            'border-orange-400/35 bg-orange-500/20 text-orange-300 shadow-[0_0_24px_rgba(249,115,22,0.28)]',
          dot: 'bg-orange-400 shadow-[0_0_12px_rgba(251,146,60,0.9)]',
        };

      default:
        return {
          badge:
            'border-white/15 bg-white/10 text-white shadow-[0_0_20px_rgba(255,255,255,0.12)]',
          dot: 'bg-white/70',
        };
    }
  };

  const Wrapper = order.href ? Link : 'article';
  const wrapperProps = order.href ? { to: order.href } : {};

  return (
    <Wrapper
      {...wrapperProps}
      className="
        group relative overflow-hidden rounded-3xl
        border border-(--text-primary)/10 bg-(--text-primary)/3
        backdrop-blur-xl transition-all duration-500
        hover:-translate-y-1
        hover:border-(--primary-color)/30
        hover:shadow-[0_0_40px_rgba(168,85,247,0.15)]
      "
    >
      <div className="absolute inset-0 transition-opacity duration-500 opacity-0 bg-linear-to-br from-(--primary-color)/5 via-transparent to-blue-500/5 group-hover:opacity-100" />

      <div className="relative">
        <img
          src={order.image}
          alt={order.title}
          className="object-cover w-full transition-transform duration-700 h-44 sm:h-52 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-t from-[#050816] via-[#050816]/35 to-black/20" />
        <div className="absolute right-4 top-4 z-10">
          {(() => {
            const statusStyle = getStatusStyle(order.status);

            return (
              <div
                className={`
          inline-flex items-center gap-2 rounded-full
          border px-3.5 py-1.5
          text-xs font-medium
          backdrop-blur-xl
          ${statusStyle.badge}
        `}
              >
                <span className={`h-2 w-2 rounded-full ${statusStyle.dot}`} />
                {order.status}
              </div>
            );
          })()}
        </div>
      </div>

      <div className="relative p-4 space-y-3 sm:p-5 sm:space-y-4">
        <div>
          <h3 className="text-lg sm:text-xl font-bold tracking-wide text-(--text-primary) line-clamp-2">
            {order.title}
          </h3>
          <p className="mt-2 text-sm text-(--text-primary)">{order.date}</p>
          <p className="mt-1 text-sm text-(--text-primary) truncate">
            {order.location}
          </p>
        </div>

        <div className="flex items-center gap-3 text-sm text-(--text-primary) flex-wrap">
          <span>{order.quantity}</span>
          <div className="w-1 h-1 bg-(--text-primary) rounded-full" />
          <span className="truncate">{order.zone}</span>
        </div>

        {order.amount ? (
          <p className="text-sm font-semibold text-(--primary-color)">
            {order.amount}
          </p>
        ) : null}

        <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-(--text-primary)/10">
          <p className="text-sm text-(--text-primary)">
            Mã đơn:
            <span className="ml-2 text-(--text-primary)">
              {order.ticketCode}
            </span>
          </p>
          <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-(--text-primary)/10 bg-(--text-primary)/5 text-(--text-primary) transition-all duration-300 hover:border-(--primary-color)/30 hover:bg-(--primary-color)/20 hover:shadow-[0_0_20px_rgba(168,85,247,0.25)]">
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </Wrapper>
  );
}

export default OrderCard;
