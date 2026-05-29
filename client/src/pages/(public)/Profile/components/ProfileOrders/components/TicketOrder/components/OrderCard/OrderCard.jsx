import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

function OrderCard({ order }) {
  const getStatusStyle = (status) => {
    switch (status) {
      case "Đã đặt":
        return "bg-green-500/15 text-green-400 border border-green-500/20";
      case "Đang xử lý":
        return "bg-yellow-500/15 text-yellow-400 border border-yellow-500/20";
      case "Đã hủy":
        return "bg-red-500/15 text-red-400 border border-red-500/20";
      default:
        return "";
    }
  };

  const Wrapper = order.href ? Link : "article";
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
        <div className="absolute inset-0 bg-linear-to-t from-[#050816] via-[#050816]/20 to-transparent" />
        <div className="absolute right-4 top-4">
          <div className={`rounded-full px-3 py-1 text-xs font-semibold backdrop-blur-md ${getStatusStyle(order.status)}`}>
            {order.status}
          </div>
        </div>
      </div>

      <div className="relative p-4 space-y-3 sm:p-5 sm:space-y-4">
        <div>
          <h3 className="text-lg sm:text-xl font-bold tracking-wide text-(--text-primary) line-clamp-2">
            {order.title}
          </h3>
          <p className="mt-2 text-sm text-(--text-primary)">{order.date}</p>
          <p className="mt-1 text-sm text-(--text-primary) truncate">{order.location}</p>
        </div>

        <div className="flex items-center gap-3 text-sm text-(--text-primary) flex-wrap">
          <span>{order.quantity}</span>
          <div className="w-1 h-1 bg-(--text-primary) rounded-full" />
          <span className="truncate">{order.zone}</span>
        </div>

        {order.amount ? (
          <p className="text-sm font-semibold text-(--primary-color)">{order.amount}</p>
        ) : null}

        <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-(--text-primary)/10">
          <p className="text-sm text-(--text-primary)">
            Mã đơn:
            <span className="ml-2 text-(--text-primary)">{order.ticketCode}</span>
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