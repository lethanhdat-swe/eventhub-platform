
function OrderIdCard() {
    return ( 
        <div className="bg-(--background-color)/90 border border-(--text-primary)/10 rounded-xl p-6 flex flex-col gap-3">
            <div className="flex items-center justify-between text-(--text-primary)/60">
                <p>Mã đơn hàng (Order ID)</p>                
                <p>Thời gian đặt</p>                
            </div>

            <div className="flex items-center justify-between text-(--text-primary) text-xl">
                <p>EH-2025-06-85643D</p>                
                <p>214/06/2026 - 15:23:18</p>                
            </div>
        </div>
     );
}

export default OrderIdCard;