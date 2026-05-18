import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import TicketOrder from "../TicketOrder/TicketOrder";
import SavedEvents from "../SavedEvents/SavedEvents";

function OrderTabs() {
  const [activeTab, setActiveTab] = useState("ticket");

  const tabs = [
    {
      label: "Vé",
      value: "ticket",
    },
    {
      label: "Sự kiện đã lưu",
      value: "saved-events",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
            <div className="flex items-center gap-8 ">
            {tabs.map((tab) => {
            const isActive = activeTab === tab.value;

            return (
                <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`
                    relative pb-4 text-[18px] font-medium transition-all duration-300 cursor-pointer
                    ${
                    isActive
                        ? "text-(--text-primary)"
                        : "text-gray-500 hover:text-(--text-primary)"
                    }
                `}
                >
                {tab.label}

                <span
                    className={`
                    absolute bottom-3 left-1/2 h-0.5
                    -translate-x-1/2 rounded-full
                    border border-(--primary-color)
                    transition-all duration-300
                    ${
                        isActive
                        ? "w-full opacity-100"
                        : "w-0 opacity-0"
                    }
                    `}
                />
                </button>
            );
            })}
        </div>

        <Link to={'/myorder'} className="flex items-center gap-2 text-(--primary-color)">Xem tất cả vé <ArrowRight /> </Link>
      </div>

      <div>
        {activeTab === "ticket" && <TicketOrder />}

        {activeTab === "saved-events" && <SavedEvents />}
      </div>
    </div>
  );
}

export default OrderTabs;