import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

function CheckoutButton({
    event,
    selectedSeats = [],
    selectedSeatIds = [],
    customerInfo,
}) {
    const hasSelectedSeats = selectedSeatIds.length > 0;

    return ( 
       <div className="flex items-end justify-end w-full">
        <Link
            to="/payment"
            state={{
                event,
                selectedSeats,
                selectedSeatIds,
                customerInfo,
            }}
            aria-disabled={!hasSelectedSeats}
            onClick={(event) => {
                if (!hasSelectedSeats) {
                    event.preventDefault();
                }
            }}
            className={`inline-flex items-center gap-2 px-8 py-4 text-base font-semibold rounded-xl active:scale-95 transition-all duration-200 uppercase bg-(--primary-color) text-white ${
                hasSelectedSeats
                    ? 'hover:-translate-y-0.5 hover:opacity-90 shadow-lg'
                    : 'cursor-not-allowed opacity-50'
            }`}
        >
            Checkout
            <ChevronRight /> 
        </Link>
        </div>
     );
}

export default CheckoutButton;