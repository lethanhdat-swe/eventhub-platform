import { MoveRight } from "lucide-react";
import { Link } from "react-router-dom";

function EventBooking({ eventId }) {
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