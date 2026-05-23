import CheckoutButton from "./components/CheckoutButton/CheckoutButton";
import OrderPreviewCard from "./components/OrderPreviewCard/OrderPreviewCard";
import SelectedTicketsList from "./components/SelectedTicketsList/SelectedTicketsList";

function OrderSummarySection({
    event,
    selectedSeats = [],
    selectedSeatIds = [],
    customerInfo,
}) {
    return ( 
        <div className="bg-(--background-color)/90 border border-(--text-primary)/10 rounded-xl p-5 space-y-4 lg:p-6">
            <p className="text-(--text-primary) uppercase text-lg">tóm tắt đơn hàng</p>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
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