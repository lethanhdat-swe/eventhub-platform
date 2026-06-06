import { MoveRight } from "lucide-react";
import { Link } from "react-router-dom";

function EventBooking({ eventId, isEnded = false, isOngoing = false }) {
  if (isEnded) {
    return (
      <div className="w-full mt-4">
        <button
          type="button"
          disabled
          className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-(--text-primary)/10 px-6 py-3 text-sm font-semibold text-(--muted-text)"
        >
          Sự kiện đã kết thúc
        </button>
      </div>
    );
  }

  if (isOngoing) {
    return (
      <div className="w-full mt-4">
        <button
          type="button"
          disabled
          className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-amber-500/10 px-6 py-3 text-sm font-semibold text-amber-200/80"
        >
          Sự kiện đang diễn ra
        </button>
      </div>
    );
  }

  return (
    <div className="w-full mt-4">
      <Link
        to={eventId ? `/booking?eventId=${eventId}` : '/booking'}
        className="flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl active:scale-95 transition-all duration-200 hover:-translate-y-0.5 hover:opacity-90 shadow-md bg-(--primary-color) text-white"
      >
        Đặt chỗ ngay
        <MoveRight size={18} />
      </Link>
    </div>
  );
}

export default EventBooking;