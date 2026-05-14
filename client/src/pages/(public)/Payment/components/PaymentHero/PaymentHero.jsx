import { SecurityIcon } from "@/assets/icons";

function PaymentHero() {
    return ( 
        <div className="flex items-center justify-between">
            <div className="flex flex-col gap-2">
                <h1 className="text-(--text-primary) text-4xl font-semibold">Xác nhận thanh toán</h1>
                <p className="text-(--text-primary)/60">Vui lòng kiểm tra thông tin đơn hàng trước khi tiến hành thanh toán.</p>
            </div>

            <SecurityIcon size={170} />
        </div>
     );
}

export default PaymentHero;