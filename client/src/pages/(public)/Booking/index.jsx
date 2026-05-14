import CustomerFormSection from "./components/CustomerFormSection/CustomerFormSection";
import EventHeaderSection from "./components/EventHeaderSection/EventHeaderSection";
import EventSeat from "./components/EventSeat/EventSeat";
import OrderSummarySection from "./components/OrderSummarySection/OrderSummarySection";

function Booking() {
    return ( 
        <div className="pt-(--header-height) mb-10 mx-10 space-y-4">
            <EventHeaderSection/>
            <EventSeat />
            <CustomerFormSection />
            <OrderSummarySection />
        </div>
     );
}

export default Booking;