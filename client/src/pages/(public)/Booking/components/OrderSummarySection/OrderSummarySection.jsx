import CheckoutButton from "./components/CheckoutButton/CheckoutButton";
import OrderPreviewCard from "./components/OrderPreviewCard/OrderPreviewCard";
import SelectedTicketsList from "./components/SelectedTicketsList/SelectedTicketsList";

function OrderSummarySection({ event, selectedSeats = [], selectedSeatIds = [], customerInfo }) {
    return ( 
        <div className="bg-(--background-color)/90 border border-(--text-primary)/10 rounded-xl p-4 sm:p-5 lg:p-6 space-y-4">
            <p className="text-(--text-primary) uppercase text-sm sm:text-base lg:text-lg tracking-wide">
                tóm tắt đơn hàng
            </p>

            <div className="flex flex-col gap-4 lg:grid lg:grid-cols-2">
                <OrderPreviewCard event={event} />
                <SelectedTicketsList selectedSeats={selectedSeats} />
            </div>

            <CheckoutButton
                event={event}
                selectedSeats={selectedSeats}
                selectedSeatIds={selectedSeatIds}
                customerInfo={customerInfo}
            />
        </div>
    );
}

export default OrderSummarySection;