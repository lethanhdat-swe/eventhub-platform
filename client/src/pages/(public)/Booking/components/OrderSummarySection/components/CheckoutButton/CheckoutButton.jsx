import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

function CheckoutButton() {
    return ( 
       <div className="flex items-end justify-end w-full">
        <Link
            to="/payment"
            className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold rounded-xl active:scale-95 transition-all duration-200 hover:-translate-y-0.5 hover:opacity-90 shadow-lg uppercase bg-(--primary-color) text-white"
        >
            Checkout
            <ChevronRight /> 
        </Link>
        </div>
     );
}

export default CheckoutButton;