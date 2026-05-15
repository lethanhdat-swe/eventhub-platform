import OrderTabs from "./components/OrderTabs/OrderTabs";

function ProfileOrders() {
    return (
        <div className="pb-5 mt-6 border-b border-(--text-primary)/50">
            <h1 className="text-(--text-primary) text-xl font-medium mb-4">Đơn hàng của tôi</h1>
            <OrderTabs />
        </div>
      );
}

export default ProfileOrders;