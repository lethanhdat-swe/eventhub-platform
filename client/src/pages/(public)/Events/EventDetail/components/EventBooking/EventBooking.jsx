import { MoveRight } from "lucide-react";
import { Link } from "react-router-dom";

function EventBooking() {
  return (
    <div className="w-full mt-5 ">
      <Link
        to="/booking"
        className="flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold rounded-xl active:scale-95 transition-all duration-200 hover:-translate-y-0.5 hover:opacity-90 shadow-lg bg-(--primary-color) text-(--text-primary)"
      >
        Đặt chỗ ngay
        <MoveRight /> 
      </Link>
    </div>
  );
}

export default EventBooking;