import { ShieldCheck } from "lucide-react";

function PaymentHero() {
    return ( 
        <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col gap-2">
                <h1 className="text-(--text-primary) text-3xl font-semibold">Xác nhận thanh toán</h1>
                <p className="text-(--text-primary)/60">
                    Kiểm tra thông tin vé và hoàn tất chuyển khoản SEPAY.
                </p>
            </div>

            <div className="hidden md:flex size-12 items-center justify-center rounded-xl border border-(--text-primary)/10 bg-(--background-color)/90">
                <ShieldCheck color="var(--primary-color)" size={24} />
            </div>
        </div>
     );
}

export default PaymentHero;