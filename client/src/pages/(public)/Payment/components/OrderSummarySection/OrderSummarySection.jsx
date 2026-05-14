import { images } from "@/assets";
import { ReceiptText } from "lucide-react";
import TicketTable from "./components/TicketTable/TicketTable";
import EventInfoCard from "./components/EventInfoCard/EventInfoCard";

function OrderSummarySection() {
    return ( 
       <div>
            <div className="flex items-center gap-3 mt-10 mb-5">
                <ReceiptText color="var(--primary-color)" size={24}/>
                <p className="text-(--text-primary) font-medium text-xl">Chi tiết sự kiện</p> 
            </div>

            <div className="grid grid-cols-12 gap-5 bg-(--background-color)/90 border border-(--text-primary)/10 rounded-xl p-10">
                <div className="col-span-4">
                    <img src={images.home} alt="" className="object-cover w-full h-full rounded-xl"/>
                </div>

                <div className="col-span-8 space-y-5">
                   <EventInfoCard />

                    <TicketTable
                        items={[
                            {
                            ticketType: "VIP Stand",
                            quantity: 2,
                            seats: ["A12", "A13"],
                            price: 2000000,
                            total: 4000000,
                            },
                        ]}
                        />
                </div>
            </div>
       </div>
     );
}

export default OrderSummarySection;