import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

function CheckoutButton({ event, selectedSeats = [], selectedSeatIds = [], customerInfo }) {
    const [didTryCheckout, setDidTryCheckout] = useState(false);
    const hasSelectedSeats = selectedSeatIds.length > 0;
    const hasCustomerInfo = Boolean(
        customerInfo?.name?.trim() &&
        customerInfo?.email?.trim() &&
        customerInfo?.phone?.trim()
    );
    const canCheckout = hasSelectedSeats && hasCustomerInfo;

    return ( 
        <div className="flex flex-col items-stretch justify-end w-full gap-2 sm:items-end">
            <Link
                to="/payment"
                state={{ event, selectedSeats, selectedSeatIds, customerInfo }}
                aria-disabled={!canCheckout}
                onClick={(e) => {
                    if (!canCheckout) { e.preventDefault(); setDidTryCheckout(true); }
                }}
                className={`inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold rounded-xl active:scale-95 transition-all duration-200 uppercase bg-(--primary-color) text-white ${
                    canCheckout ? 'hover:-translate-y-0.5 hover:opacity-90 shadow-lg' : 'cursor-not-allowed opacity-50'
                }`}
            >
                Checkout
                <ChevronRight size={18} />
            </Link>
            {didTryCheckout && !hasCustomerInfo ? (
                <p className="text-xs text-center text-red-400 sm:text-sm sm:text-right">
                    Vui lòng nhập đầy đủ họ tên, email và số điện thoại.
                </p>
            ) : null}
        </div>
    );
}

export default CheckoutButton;