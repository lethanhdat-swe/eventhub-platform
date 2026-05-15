import { orders } from "./components/data";
import OrderCard from "./components/OrderCard/OrderCard";
import OrderFilter from "./components/OrderFilter/OrderFilter";

function TicketOrder() {
   
    return ( 
        <div className="space-y-3">
            <OrderFilter />
            <div className="grid grid-cols-4 gap-3">
                {orders.map((order) => (
                 <OrderCard key={order.id} order={order}/>
           ))}
            </div>
        </div>
     );
}

export default TicketOrder;