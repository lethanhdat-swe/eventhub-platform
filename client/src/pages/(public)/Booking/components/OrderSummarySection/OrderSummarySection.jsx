import CheckoutButton from "./components/CheckoutButton/CheckoutButton";
import OrderPreviewCard from "./components/OrderPreviewCard/OrderPreviewCard";
import SelectedTicketsList from "./components/SelectedTicketsList/SelectedTicketsList";

function OrderSummarySection() {
    return ( 
        <div className="col-span-8 bg-(--background-color)/90 border border-(--text-primary)/10 rounded-xl p-10 space-y-5">
            <p className="text-(--text-primary) uppercase text-xl">tóm tắt đơn hàng</p>

            <div className="grid grid-cols-2 gap-3">
              <OrderPreviewCard />
               <SelectedTicketsList />
            </div>
               <CheckoutButton />
        </div>
     );
}

export default OrderSummarySection;